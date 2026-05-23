import Order from '../models/orderModel.js';
import Product from '../models/productsModel.js';
import AppError from '../middlewares/errorHandler.js';
import { generateOrderId } from '../utils.js';

export const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return next(new AppError('Cart is empty', 400));
    }

    if (!shippingAddress || !paymentMethod) {
      return next(new AppError('Please provide shipping address and payment method', 400));
    }

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return next(new AppError(`Product ${item.product} not found`, 404));
      }
      if (product.stock < item.qty) {
        return next(new AppError(`Not enough stock for ${product.name}`, 400));
      }
    }

    const order = new Order({
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      user: req.user._id,
    });

    const createdOrder = await order.save();

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.qty } },
        { new: true }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: createdOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.product').sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product').populate('user', 'name email');

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return next(new AppError('Not authorized to access this order', 403));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: 'Order marked as paid',
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (!order.isPaid) {
      return next(new AppError('Order has not been paid', 400));
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: 'Order marked as delivered',
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized', 403));
    }

    if (order.isDelivered) {
      return next(new AppError('Cannot cancel delivered order', 400));
    }

    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.qty } },
        { new: true }
      );
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    if (status) {
      query.isPaid = status === 'paid';
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      totalPages,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    const pendingOrders = await Order.countDocuments({ isPaid: false });
    const completedOrders = await Order.countDocuments({ isDelivered: true });

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders,
        completedOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};
