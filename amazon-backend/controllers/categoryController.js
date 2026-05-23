import Category from '../models/categoryModel.js';
import { createSlug } from '../utils.js';
import AppError from '../middlewares/errorHandler.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort('name');

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug });

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;

    if (!name) {
      return next(new AppError('Category name is required', 400));
    }

    const existingCategory = await Category.findOne({
      name: name.toLowerCase(),
    });

    if (existingCategory) {
      return next(new AppError('Category already exists', 400));
    }

    const slug = createSlug(name);

    const category = new Category({
      name,
      slug,
      description,
      image,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;

    let category = await Category.findById(id);

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        name: name.toLowerCase(),
        _id: { $ne: id },
      });

      if (existingCategory) {
        return next(new AppError('Category name already in use', 400));
      }

      category.name = name;
      category.slug = createSlug(name);
    }

    if (description) {
      category.description = description;
    }

    if (image) {
      category.image = image;
    }

    category = await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
