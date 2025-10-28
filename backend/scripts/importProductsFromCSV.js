import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

// Import models
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

const importProducts = async () => {
  try {
    // Connect to MongoDB
    console.log('[INFO] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[SUCCESS] Connected to MongoDB');

    // Get a vendor user (or create one if doesn't exist)
    let vendor = await User.findOne({ role: 'vendor' });
    if (!vendor) {
      console.log('[INFO] No vendor found, creating default vendor...');
      vendor = await User.create({
        name: 'Default Vendor',
        email: 'vendor@marketplace.com',
        password: 'vendor123', // This will be hashed by the model
        role: 'vendor',
        phone: '1234567890'
      });
      console.log('[SUCCESS] Default vendor created');
    }

    // Get all categories
    const categories = await Category.find();
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    console.log('[INFO] Found categories:', Object.keys(categoryMap).join(', '));

    // Clear existing products (optional - comment out if you want to keep existing)
    await Product.deleteMany({});
    console.log('[INFO] Cleared existing products');

    const products = [];
    const csvPath = path.join(__dirname, '..', 'data', 'new_products.csv');

    // Read CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          // Map category name to category ID
          const categoryId = categoryMap[row.category];
          
          if (!categoryId) {
            console.log(`[WARNING] Category "${row.category}" not found for product "${row.name}"`);
            return;
          }

          // Parse images (multiple images separated by comma)
          const images = row.images ? row.images.split(',').map(img => img.trim()) : [];
          
          // Parse tags
          const tags = row.tags ? row.tags.split(',').map(tag => tag.trim()) : [];

          const product = {
            name: row.name,
            // Don't set slug - let the pre-save hook generate it
            description: row.description,
            price: parseFloat(row.price),
            discountPrice: row.discountPrice ? parseFloat(row.discountPrice) : undefined,
            category: categoryId,
            brand: row.brand || undefined,
            stock: parseInt(row.stock) || 0,
            images: images,
            tags: tags,
            vendor: vendor._id,
            isApproved: true, // Auto-approve imported products
            isActive: true,
            rating: parseFloat(row.rating) || 4.0,
            numReviews: parseInt(row.numReviews) || 0
          };

          products.push(product);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`[INFO] Parsed ${products.length} products from CSV`);

    // Insert products one by one to trigger pre-save hooks
    let successCount = 0;
    let errorCount = 0;

    console.log('[INFO] Starting product import...');
    
    for (let i = 0; i < products.length; i++) {
      try {
        await Product.create(products[i]);
        successCount++;
        if ((i + 1) % 10 === 0) {
          console.log(`[PROGRESS] Imported ${i + 1}/${products.length} products...`);
        }
        // Small delay to ensure unique timestamps in slugs
        await new Promise(resolve => setTimeout(resolve, 10));
      } catch (error) {
        errorCount++;
        console.log(`[ERROR] Failed to import "${products[i].name}":`, error.message);
      }
    }

    console.log('\n[SUMMARY]');
    console.log(`[SUCCESS] Total products imported: ${successCount}`);
    console.log(`[ERROR] Total errors: ${errorCount}`);
    console.log(`[INFO] Import completed!`);

    // Display some sample products
    const sampleProducts = await Product.find().limit(5).populate('category');
    console.log('\n[SAMPLE PRODUCTS]');
    sampleProducts.forEach(product => {
      console.log(`- ${product.name} (${product.category.name}) - ₹${product.discountPrice || product.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Import failed:', error);
    process.exit(1);
  }
};

importProducts();
