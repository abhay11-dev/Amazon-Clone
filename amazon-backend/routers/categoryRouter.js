import express from 'express';
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';

const categoryRouter = express.Router();

categoryRouter.get('/', getAllCategories);
categoryRouter.get('/:slug', getCategoryBySlug);

categoryRouter.post('/', isAuth, isAdmin, createCategory);
categoryRouter.put('/:id', isAuth, isAdmin, updateCategory);
categoryRouter.delete('/:id', isAuth, isAdmin, deleteCategory);

export default categoryRouter;
