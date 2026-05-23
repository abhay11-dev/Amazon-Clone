import { body, param, query, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),

  handleValidationErrors,
];

export const validateSignIn = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  handleValidationErrors,
];

export const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3 })
    .withMessage('Product name must be at least 3 characters long'),

  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a valid positive number'),

  body('stock')
    .notEmpty()
    .withMessage('Stock is required')
    .isInt({ min: 0 })
    .withMessage('Stock must be a valid non-negative integer'),

  body('category')
    .notEmpty()
    .withMessage('Category is required'),

  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required'),

  handleValidationErrors,
];

// FIX: Removed 'state' and 'phone' — they don't exist in the Order model's shippingAddress schema.
// Only validate fields that are actually saved: fullName, address, city, postalcode, country.
export const validateShippingAddress = [
  body('shippingAddress.fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),

  body('shippingAddress.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 5 })
    .withMessage('Address must be at least 5 characters long'),

  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),

  body('shippingAddress.postalcode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required')
    .matches(/^[0-9]{4,10}$/)
    .withMessage('Postal code must be 4-10 digits'),

  body('shippingAddress.country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),

  handleValidationErrors,
];

export const validateReview = [
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),

  body('title')
    .trim()
    .notEmpty()
    .withMessage('Review title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Review title must be between 5 and 100 characters'),

  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Review comment is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Review comment must be between 10 and 2000 characters'),

  handleValidationErrors,
];

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  handleValidationErrors,
];

// FIX: The original only validated param('id'), but reviewRouter uses 'reviewId' and 'productId'.
// This version validates whichever named param is present, covering all routers.
export const validateIdParam = [
  param('id')
    .optional()
    .isMongoId()
    .withMessage('Invalid ID format'),

  param('reviewId')
    .optional()
    .isMongoId()
    .withMessage('Invalid review ID format'),

  param('productId')
    .optional()
    .isMongoId()
    .withMessage('Invalid product ID format'),

  handleValidationErrors,
];