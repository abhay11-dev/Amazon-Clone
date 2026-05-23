import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const required = ['JWT_SECRET', 'NODE_ENV'];
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
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 5000;
const connectionUrl = 'mongodb://localhost:27017/shopnest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://abhayrajsinghmandloi_db_user:Zh8JTyBww3ny43ws@cluster0.a3o86x0.mongodb.net/?appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Make sure your internet connection is working');
    process.exit(1);
  }
};

await connectDB();

// API routes
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);   // FIXED: was '/products', must be '/api/products'
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

// Serve static files from React frontend build in production
const buildPath = path.join(__dirname, '../amazon-frontend/build');

// Check if build folder exists and serve static files
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
} else if (process.env.NODE_ENV === 'development') {
  console.warn(`Frontend build folder not found at ${buildPath}`);
}

// SPA fallback - serve index.html for all non-API routes
app.get('/*', (req, res) => {
  // Don't serve index.html for API routes or health checks
  if (req.path.startsWith('/api') || req.path === '/health') {
    return res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  }

  // Serve React app
  const indexPath = path.join(buildPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If build doesn't exist, send helpful message
      if (err.code === 'ENOENT') {
        return res.status(503).json({
          success: false,
          message: 'Frontend build not found. The build process may still be running.',
          path: buildPath,
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error loading frontend',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server on configured port
// Keep this for local dev
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// THIS is what Vercel uses — must be default export

// Graceful shutdown handler
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
export default app;