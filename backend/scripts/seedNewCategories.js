const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Category = require('../models/Category');

const categories = [
  {
    name: 'Footwear',
    description: 'Shoes, sneakers, and other footwear',
    slug: 'footwear'
  },
  {
    name: 'Clothing',
    description: 'Shirts, pants, jackets, and other apparel',
    slug: 'clothing'
  },
  {
    name: 'Electronics',
    description: 'Gadgets, devices, and electronic accessories',
    slug: 'electronics'
  },
  {
    name: 'Accessories',
    description: 'Sunglasses, watches, and other accessories',
    slug: 'accessories'
  }
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[SUCCESS] Connected to MongoDB');

    await Category.deleteMany({});
    console.log('[INFO] Cleared existing categories');

    const createdCategories = await Category.insertMany(categories);
    console.log('[SUCCESS] Categories created:', createdCategories.map(cat => cat.name).join(', '));

    await mongoose.disconnect();
    console.log('[INFO] Disconnected from MongoDB');
  } catch (error) {
    console.error('[ERROR]', error);
    process.exit(1);
  }
}

seedCategories();