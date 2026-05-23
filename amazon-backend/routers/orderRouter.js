import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  cancelOrder,
  getAllOrders,
  getOrderStats,
} from '../controllers/orderController.js';
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';
import { validateShippingAddress, validateIdParam } from '../middlewares/validation.js';

const orderRouter = express.Router();

orderRouter.post('/', isAuth, validateShippingAddress, createOrder);
orderRouter.get('/mine', isAuth, getMyOrders);
orderRouter.get('/stats', isAuth, isAdmin, getOrderStats);
orderRouter.get('/', isAuth, isAdmin, getAllOrders);
orderRouter.get('/:id', isAuth, validateIdParam, getOrderById);
orderRouter.put('/:id/pay', isAuth, validateIdParam, updateOrderToPaid);
orderRouter.put('/:id/deliver', isAuth, isAdmin, validateIdParam, updateOrderToDelivered);
orderRouter.delete('/:id', isAuth, validateIdParam, cancelOrder);

export default orderRouter;