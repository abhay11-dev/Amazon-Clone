import express from 'express';
import {
  getAllProducts,
  getProductById,
  searchProducts,
  filterProducts,
  getProductsByCategory,
  getSimilarProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} from '../controllers/productController.js';
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';
import { validatePagination, validateIdParam } from '../middlewares/validation.js';

const productRouter = express.Router();

// IMPORTANT: specific routes must come BEFORE /:id to avoid shadowing
productRouter.get('/', validatePagination, getAllProducts);
productRouter.get('/search', validatePagination, searchProducts);
productRouter.get('/filter', validatePagination, filterProducts);
productRouter.get('/stats', isAuth, isAdmin, getProductStats);
productRouter.get('/category/:slug', validatePagination, getProductsByCategory);
productRouter.get('/similar/:id', validateIdParam, getSimilarProducts);
productRouter.get('/:id', validateIdParam, getProductById);

productRouter.post('/', isAuth, isAdmin, createProduct);
productRouter.put('/:id', isAuth, isAdmin, validateIdParam, updateProduct);
productRouter.delete('/:id', isAuth, isAdmin, validateIdParam, deleteProduct);

export default productRouter;