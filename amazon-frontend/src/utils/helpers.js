export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || !currentPrice || currentPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
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

export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const formatDate = (date) => {
  if (!date) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const getRatingColor = (rating) => {
  if (rating >= 4) return '#22c55e';
  if (rating >= 3) return '#f59e0b';
  if (rating >= 2) return '#ef4444';
  return '#ef4444';
};

export const getStarArray = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push('full');
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }
  return stars;
};

export const calculateTax = (amount, rate = 0.1) => {
  return Math.round(amount * rate * 100) / 100;
};

export const calculateTotal = (subtotal, tax, shipping, discount = 0) => {
  return Math.round((subtotal + tax + shipping - discount) * 100) / 100;
};

export const getCartSummary = (items, discountRate = 0) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = calculateTax(subtotal);
  const shipping = subtotal > 100 ? 0 : 10;
  const discount = (subtotal * discountRate) / 100;
  const total = calculateTotal(subtotal, tax, shipping, discount);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax,
    shipping,
    discount,
    total,
  };
};
