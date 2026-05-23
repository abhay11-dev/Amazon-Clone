import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || 'somethingsecret',
    {
      expiresIn: '7d',
    }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESH_SECRET || 'refreshsecret',
    {
      expiresIn: '30d',
    }
  );
};

export const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  try {
    return jwt.verify(token, secret || 'somethingsecret');
  } catch (error) {
    return null;
  }
};

export const calculateTax = (price, taxRate = 0.1) => {
  return Math.round(price * taxRate * 100) / 100;
};

export const calculateShippingCost = (weight, distance = 'standard') => {
  const baseCost = 5;
  const perKgCost = 0.5;
  const distanceMultiplier = distance === 'express' ? 1.5 : 1;
  return Math.round(baseCost + weight * perKgCost * distanceMultiplier * 100) / 100;
};

export const generateOrderId = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

export const validateZipCode = (zipCode) => {
  const zipRegex = /^[0-9]{5,6}$/;
  return zipRegex.test(zipCode);
};

export const calculateDiscount = (originalPrice, discountPrice) => {
  if (!discountPrice || discountPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

export const createSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};
