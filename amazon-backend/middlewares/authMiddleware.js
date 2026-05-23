import jwt from 'jsonwebtoken';
import AppError from './errorHandler.js';
import User from '../models/userModel.js';

export const isAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new AppError('Please login to access this resource', 401));
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);

    if (!req.user) {
      return next(new AppError('User not found', 404));
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next(new AppError('Admin access required', 403));
  }
  next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }
    next();
  };
};
