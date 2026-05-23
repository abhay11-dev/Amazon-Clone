import Wishlist from '../models/wishlistModel.js';
import Product from '../models/productsModel.js';
import AppError from '../middlewares/errorHandler.js';

export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return next(new AppError('Product ID is required', 400));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    const existingWishlist = await Wishlist.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingWishlist) {
      return next(new AppError('Product already in wishlist', 400));
    }

    const wishlist = new Wishlist({
      user: req.user._id,
      product: productId,
    });

    await wishlist.save();

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOneAndDelete({
      user: req.user._id,
      product: productId,
    });

    if (!wishlist) {
      return next(new AppError('Product not found in wishlist', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
    });
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user._id }).populate('product');

    res.status(200).json({
      success: true,
      count: wishlist.length,
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

export const isInWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: req.user._id,
      product: productId,
    });

    res.status(200).json({
      success: true,
      isInWishlist: !!wishlist,
    });
  } catch (error) {
    next(error);
  }
};

export const moveToCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOneAndDelete({
      user: req.user._id,
      product: productId,
    });

    if (!wishlist) {
      return next(new AppError('Product not found in wishlist', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Product moved to cart',
    });
  } catch (error) {
    next(error);
  }
};
