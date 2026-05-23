import Product from '../models/productsModel.js';
import Review from '../models/reviewModel.js';
import AppError from '../middlewares/errorHandler.js';

export const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, sortBy = '-createdAt', search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    // category is stored as a plain String in the Product model
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip(skip);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      totalPages,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name email',
        },
      });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    if (!query) {
      return next(new AppError('Search query is required', 400));
    }

    const searchFilter = {
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
      ],
    };

    const products = await Product.find(searchFilter)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Product.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      totalPages,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const filterProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, rating, sortBy = '-createdAt', page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = { isActive: true };

    // category is a plain String field
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip(skip);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      totalPages,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 12, sortBy = '-createdAt' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // category is stored as a plain String — match case-insensitively
    const categoryFilter = { $regex: new RegExp(`^${slug}$`, 'i') };

    const total = await Product.countDocuments({ category: categoryFilter, isActive: true });
    const products = await Product.find({ category: categoryFilter, isActive: true })
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip(skip);

    if (total === 0) {
      return next(new AppError('Category not found or no products in this category', 404));
    }

    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      totalPages,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getSimilarProducts = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    const similarProducts = await Product.find({
      _id: { $ne: id },
      category: product.category,
      isActive: true,
    }).limit(4);

    res.status(200).json({
      success: true,
      count: similarProducts.length,
      products: similarProducts,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, brand, image } = req.body;

    if (!name || !description || !price || stock === undefined || !category || !brand) {
      return next(new AppError('Please provide all required fields', 400));
    }

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return next(new AppError('Product already exists', 400));
    }

    // category is a plain String — no ObjectId lookup needed
    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      brand,
      image,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getProductStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });
    const averagePrice = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avgPrice: { $avg: '$price' } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        outOfStockProducts,
        averagePrice: averagePrice[0]?.avgPrice || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};