import jwt from 'jsonwebtoken';

// Generates a JWT authentication token valid for 7 days.
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

// Generates a JWT refresh token valid for 30 days.
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

// Verifies a JWT token and returns the decoded payload or null if invalid.
export const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

// Calculates tax amount on a given price using the specified tax rate.
export const calculateTax = (price, taxRate = 0.1) => {
  return Math.round(price * taxRate * 100) / 100;
};

// Calculates shipping cost based on weight and delivery distance.
export const calculateShippingCost = (weight, distance = 'standard') => {
  const baseCost = 5;
  const perKgCost = 0.5;
  const distanceMultiplier = distance === 'express' ? 1.5 : 1;
  return Math.round(baseCost + weight * perKgCost * distanceMultiplier * 100) / 100;
};

// Generates a unique order ID using timestamp and random characters.
export const generateOrderId = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Formats a numerical amount as a USD currency string.
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Validates email format using regex pattern.
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validates phone number format as 10 digits.
export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

// Validates zip code format as 5 or 6 digits.
export const validateZipCode = (zipCode) => {
  const zipRegex = /^[0-9]{5,6}$/;
  return zipRegex.test(zipCode);
};

// Calculates discount percentage between original and discount price.
export const calculateDiscount = (originalPrice, discountPrice) => {
  if (!discountPrice || discountPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

// Creates a URL-friendly slug from text by removing special characters and spaces.
export const createSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};
