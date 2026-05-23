import express from 'express';
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  isInWishlist,
  moveToCart,
} from '../controllers/wishlistController.js';
import { isAuth } from '../middlewares/authMiddleware.js';

const wishlistRouter = express.Router();

wishlistRouter.get('/', isAuth, getWishlist);
wishlistRouter.post('/add', isAuth, addToWishlist);
wishlistRouter.get('/check/:productId', isAuth, isInWishlist);
wishlistRouter.delete('/remove/:productId', isAuth, removeFromWishlist);
wishlistRouter.put('/move-to-cart/:productId', isAuth, moveToCart);

export default wishlistRouter;
