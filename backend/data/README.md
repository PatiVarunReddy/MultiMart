# Product Data Import Guide

## 📦 What's Included

- **products.csv**: 100 premium products across all categories with real images from Pexels
- **importProductsFromCSV.js**: Automated script to import products into MongoDB

## 🎯 Product Categories

- **Electronics** (20 products): Smartphones, Laptops, Cameras, Gaming, Accessories
- **Fashion** (20 products): Shoes, Clothing, Accessories, Watches, Bags
- **Books** (20 products): Fiction, Self-Help, Business, Classics
- **Sports** (20 products): Gym Equipment, Sports Gear, Fitness Accessories
- **Beauty** (10 products): Skincare, Makeup, Haircare
- **Home** (10 products): Furniture, Decor, Appliances

## 🚀 How to Import Products

### Step 1: Install Required Package
```bash
cd backend
npm install csv-parser
```

### Step 2: Ensure Categories Exist
Make sure you've run the categories seed script first:
```bash
node scripts/seedCategories.js
```

### Step 3: Import Products
```bash
node scripts/importProductsFromCSV.js
```

## ✅ What the Script Does

1. **Connects to MongoDB** using your .env configuration
2. **Finds or creates a vendor** (default vendor for all products)
3. **Maps categories** from names to MongoDB IDs
4. **Clears existing products** (optional - you can comment this out)
5. **Reads CSV file** and parses product data
6. **Generates unique slugs** for each product (product-name-abc123)
7. **Adds random ratings** (3.0-5.0 stars) and reviews (10-210 reviews)
8. **Imports in batches** of 20 products for better performance
9. **Auto-approves products** so they appear immediately
10. **Shows summary** with success/error counts

## 📊 Product Data Fields

Each product includes:
- ✅ Name & Description
- ✅ Price & Discount Price
- ✅ Category (Electronics, Fashion, Books, Sports, Beauty, Home)
- ✅ Brand
- ✅ Stock quantity
- ✅ High-quality images from Pexels
- ✅ Relevant tags for search
- ✅ Auto-generated unique slug
- ✅ Random rating & reviews
- ✅ Auto-approved & active status

## 🖼️ Image Sources

All product images are from **Pexels.com** - free high-quality stock photos that you can use commercially without attribution.

## 🔧 Customization

### To Keep Existing Products
Comment out this line in `importProductsFromCSV.js`:
```javascript
// await Product.deleteMany({});
```

### To Add More Products
Simply add more rows to `products.csv` following the same format:
```csv
name,description,price,discountPrice,category,brand,stock,images,tags
"Product Name","Description here",9999,7999,Electronics,BrandName,50,"https://image-url.jpg","tag1,tag2,tag3"
```

## 📝 Notes

- All prices are in Indian Rupees (₹)
- Images are direct URLs from Pexels CDN (fast & reliable)
- Products are automatically assigned to the first vendor account
- Slugs are auto-generated with random suffixes to ensure uniqueness
- Categories must match exactly: Electronics, Fashion, Books, Sports, Beauty, Home

## 🐛 Troubleshooting

**Error: "Category not found"**
- Run `node scripts/seedCategories.js` first

**Error: "csv-parser not found"**
- Run `npm install csv-parser`

**Error: "MONGODB_URI not defined"**
- Check your `.env` file has MONGODB_URI configured

**Error: "E11000 duplicate key slug"**
- The script now adds random suffixes, but if you still get this, delete existing products first

## 🎉 Success!

After successful import, you should see:
```
[SUCCESS] Total products imported: 100
[SAMPLE PRODUCTS]
- Apple iPhone 15 Pro (Electronics) - ₹109900
- Nike Air Max 270 (Fashion) - ₹9999
...
```

Now your marketplace has 100 professional products ready to display!
