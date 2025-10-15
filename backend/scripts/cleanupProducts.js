const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Product = require('../models/Product');

const cleanupProducts = async () => {
  try {
    console.log('[INFO] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[SUCCESS] Connected to MongoDB');

    // Delete all products (to start fresh)
    const result = await Product.deleteMany({});
    console.log(`[SUCCESS] Deleted ${result.deletedCount} existing products`);

    console.log('[INFO] Database cleaned! Now run: node scripts/importProductsFromCSV.js');
    
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Cleanup failed:', error);
    process.exit(1);
  }
};

cleanupProducts();
