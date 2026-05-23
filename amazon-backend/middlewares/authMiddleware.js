import jwt from 'jsonwebtoken';
import AppError from './errorHandler.js';
import User from '../models/userModel.js';

// Verifies JWT token from Authorization header and attaches minimal user data to request.
// Only the JWT_SECRET from environment is used - never hardcoded fallback values.
export const isAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new AppError('Please login to access this resource', 401));
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedData.id);

    if (!user) {
      return next(new AppError('Invalid or expired token', 401));
    }

    // Attach only minimal user data to avoid exposing sensitive fields
    req.user = { _id: user._id, isAdmin: user.isAdmin };
    next();
  } catch (error) {
    // Return generic error message to client - don't leak JWT error details
    return next(new AppError('Invalid or expired token', 401));
  }
};

// Checks if authenticated user has admin privileges.
export const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next(new AppError('Admin access required', 403));
  }
  next();
};

// Checks if user has one of the specified roles.
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }
    next();
  };
};
