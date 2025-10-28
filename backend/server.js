import mongoose from "mongoose";
import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root (one level up from backend)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Build MongoDB URI with the same priority used in backend/config/db.js
const buildMongoUri = () => {
  const {
    MONGODB_URI,
    MONGO_URI,
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_HOST,
    MONGODB_DB,
    MONGODB_OPTIONS
  } = process.env;

  if (MONGODB_URI) return MONGODB_URI;
  if (MONGO_URI) return MONGO_URI;

  if (MONGODB_HOST) {
    const isSrv = MONGODB_HOST.includes('mongodb.net') || MONGODB_HOST.includes('+srv');
    const user = MONGODB_USER ? encodeURIComponent(MONGODB_USER) : '';
    const pass = MONGODB_PASSWORD ? encodeURIComponent(MONGODB_PASSWORD) : '';
    const auth = user && pass ? `${user}:${pass}@` : '';
    const dbName = MONGODB_DB || 'mvmpDB';
    const opts = MONGODB_OPTIONS ? `?${MONGODB_OPTIONS}` : '?retryWrites=true&w=majority';

    if (isSrv) return `mongodb+srv://${auth}${MONGODB_HOST}/${dbName}${opts}`;
    return `mongodb://${auth}${MONGODB_HOST}/${dbName}${opts}`;
  }

  return 'mongodb://127.0.0.1:27017/mvmpDB';
};

const MONGO_URI = buildMongoUri();

mongoose.connect(MONGO_URI)
  .then(() => {
    const using = MONGO_URI.includes('mongodb+srv') || MONGO_URI.includes('mongodb.net') ? 'MongoDB Atlas' : 'MongoDB (local)';
    console.log(`✅ ${using} connected`);
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Allow inline scripts for Angular
      scriptSrcAttr: ["'unsafe-inline'"], // Allow inline event handlers
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles
      imgSrc: ["'self'", "data:", "https:", "http:"], // Allow images from https and data URIs
      connectSrc: ["'self'", "https://multimart-bwaz.onrender.com"], // Allow API calls to same origin and Render
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback: serve index.html for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Test Route (remove this as it's now handled by SPA)
// app.get('/', (req, res) => {
//   res.json({ message: '🚀 MultiMart API is running!' });
// });

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
