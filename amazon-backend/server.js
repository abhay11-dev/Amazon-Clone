import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const required = ['MONGO_URL', 'JWT_SECRET', 'NODE_ENV'];
if (process.env.NODE_ENV === 'production') {
  required.push('CORS_ORIGIN');
}

const missing = required.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error('Server cannot start. Missing environment variables:', missing.join(', '));
  process.exit(1);
}

import userRouter from './routers/userRouter.js';
import productRouter from './routers/productRouter.js';
import orderRouter from './routers/orderRouter.js';
import cartRouter from './routers/cartRouter.js';
import wishlistRouter from './routers/wishlistRouter.js';
import categoryRouter from './routers/categoryRouter.js';
import reviewRouter from './routers/reviewRouter.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const connectionUrl = process.env.MONGO_URL;

// Security and logging middleware
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS configuration with fallback for development
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.CORS_ORIGIN]
  : [process.env.CORS_ORIGIN, 'http://localhost:3000'].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin not allowed — ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: 'Too many requests, please try again later.',
});
app.use('/api/', limiter);

// Body parser middleware with size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Database connection
mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('MongoDB connected successfully');
  }
}).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// API routes
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/reviews', reviewRouter);

// PayPal configuration endpoint
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// Root endpoint returns API information
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ShopNest - E-commerce Backend API',
    version: '1.0.0',
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server on configured port
app.listen(port, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  }
});

// Graceful shutdown handler
process.on('SIGINT', () => {
  mongoose.connection.close();
  process.exit(0);
});


