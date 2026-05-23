import Cart from '../models/cartModel.js';
import Product from '../models/productsModel.js';
import AppError from '../middlewares/errorHandler.js';

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
      await cart.save();
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity < 1) {
      return next(new AppError('Invalid product ID or quantity', 400));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    if (product.stock < quantity) {
      return next(new AppError('Not enough stock available', 400));
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;

      if (existingItem.quantity > product.stock) {
        return next(new AppError('Not enough stock available', 400));
      }
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
      return next(new AppError('Invalid product ID or quantity', 400));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    if (product.stock < quantity) {
      return next(new AppError('Not enough stock available', 400));
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    const item = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!item) {
      return next(new AppError('Product not found in cart', 404));
    }

    item.quantity = quantity;

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      cart,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      cart,
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    cart.items = [];
    await cart.save();
    // FIX: populate after clear for consistent response shape (empty array)
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart,
    });
  } catch (error) {
    next(error);
  }
};