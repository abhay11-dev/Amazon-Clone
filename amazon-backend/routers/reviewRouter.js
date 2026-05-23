import express from 'express';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  markHelpful,
} from '../controllers/reviewController.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { validateReview, validatePagination, validateIdParam } from '../middlewares/validation.js';

const reviewRouter = express.Router();

reviewRouter.post('/', isAuth, validateReview, createReview);
reviewRouter.get('/:productId', validatePagination, getProductReviews);
reviewRouter.put('/:reviewId', isAuth, validateIdParam, updateReview);
reviewRouter.delete('/:reviewId', isAuth, validateIdParam, deleteReview);
reviewRouter.put('/:reviewId/helpful', isAuth, validateIdParam, markHelpful);

export default reviewRouter;
