import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { isAuth } from '../middlewares/authMiddleware.js';

const cartRouter = express.Router();

cartRouter.get('/', isAuth, getCart);
cartRouter.post('/add', isAuth, addToCart);
cartRouter.put('/update', isAuth, updateCartItem);
cartRouter.delete('/remove/:productId', isAuth, removeFromCart);
cartRouter.delete('/clear', isAuth, clearCart);

export default cartRouter;
