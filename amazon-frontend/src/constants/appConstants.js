export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";
  
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Latest' },
  { value: 'price', label: 'Price Low to High' },
  { value: '-price', label: 'Price High to Low' },
  { value: '-rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name A to Z' },
];

export const PRICE_RANGES = [
  { min: 0, max: 50, label: 'Under $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: 500, label: '$100 - $500' },
  { min: 500, max: 1000, label: '$500 - $1000' },
  { min: 1000, max: Infinity, label: 'Over $1000' },
];

export const RATING_FILTER = [
  { value: 5, label: '5 Stars' },
  { value: 4, label: '4 Stars & up' },
  { value: 3, label: '3 Stars & up' },
  { value: 2, label: '2 Stars & up' },
  { value: 1, label: '1 Star & up' },
];

export const PAYMENT_METHODS = [
  { id: 'cod', name: 'Cash on Delivery', description: 'Pay when you receive' },
  { id: 'card', name: 'Credit/Debit Card', description: 'Secure card payment' },
  { id: 'upi', name: 'UPI', description: 'Quick UPI transfer' },
];

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const ITEMS_PER_PAGE = 12;

export const TAX_RATE = 0.1;

export const SHIPPING_RATE = 5;

export const TOAST_DURATION = 3000;

export const DEBOUNCE_DELAY = 500;
