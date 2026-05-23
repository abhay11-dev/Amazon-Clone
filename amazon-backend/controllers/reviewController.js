import Review from '../models/reviewModel.js';
import Product from '../models/productsModel.js';
import Order from '../models/orderModel.js';
import AppError from '../middlewares/errorHandler.js';

export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !title || !comment) {
      return next(new AppError('Please provide all required fields', 400));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (existingReview) {
      return next(new AppError('You have already reviewed this product', 400));
    }

    const userHasOrdered = await Order.findOne({
      user: req.user._id,
      'orderItems.product': productId,
      isPaid: true,
    });

    const review = new Review({
      product: productId,
      user: req.user._id,
      rating,
      title,
      comment,
      verified: !!userHasOrdered,
    });

    await review.save();

    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    const totalReviews = reviews.length;

    product.rating = avgRating;
    product.numRev = totalReviews;
    product.reviews.push(review._id);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 5 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Review.countDocuments({ product: productId });
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page: parseInt(page),
      totalPages,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;

    let review = await Review.findById(reviewId);

    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to update this review', 403));
    }

    if (rating) {
      review.rating = rating;
    }
    if (title) {
      review.title = title;
    }
    if (comment) {
      review.comment = comment;
    }

    review = await review.save();

    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: review.product });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    product.rating = avgRating;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return next(new AppError('Not authorized to delete this review', 403));
    }

    const productId = review.product;

    await Review.findByIdAndDelete(reviewId);

    const product = await Product.findById(productId);
    const reviews = await Review.find({ product: productId });

    if (reviews.length > 0) {
      const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
      product.rating = avgRating;
      product.numRev = reviews.length;
      product.reviews = reviews.map(r => r._id);
    } else {
      product.rating = 0;
      product.numRev = 0;
      product.reviews = [];
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const markHelpful = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Review marked as helpful',
      review,
    });
  } catch (error) {
    next(error);
  }
};
