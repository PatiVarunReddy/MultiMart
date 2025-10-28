# 🧪 Testing Guide - MultiMart Platform

## Quick Test Flow

### 1️⃣ Start the Application

**Option A: Use the PowerShell script**
```powershell
.\START.ps1
```

**Option B: Manual start**

Terminal 1 (Backend):
```powershell
cd backend
npm run dev
```

Terminal 2 (Frontend):
```powershell
cd frontend
npm start
```

### 2️⃣ Test the Backend API (Using Postman/Thunder Client/curl)

#### Register a Customer
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{ +
  "name": "John Customer",
  "email": "customer@test.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "customer"
}
```

#### Register a Vendor
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "ABC Store",
  "email": "vendor@test.com",
  "password": "password123",
  "phone": "9876543211",
  "role": "vendor"
}
```

#### Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "vendor@test.com",
  "password": "password123"
}
```

**Save the token from response for subsequent requests!**

#### Create a Category (as Admin - you'll need to manually set a user's role to 'admin' in MongoDB)
```http
POST http://localhost:5000/api/categories
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices and gadgets"
}
```

#### Create a Product (as Vendor)
```http
POST http://localhost:5000/api/products
Authorization: Bearer VENDOR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Smartphone XYZ",
  "description": "Latest smartphone with amazing features",
  "price": 29999,
  "discountPrice": 24999,
  "stock": 50,
  "category": "CATEGORY_ID_FROM_ABOVE",
  "brand": "TechBrand",
  "images": ["https://via.placeholder.com/500"],
  "tags": ["smartphone", "electronics", "mobile"]
}
```

#### Get All Products (Public)
```http
GET http://localhost:5000/api/products
```

#### Search Products
```http
GET http://localhost:5000/api/products?search=smartphone&minPrice=20000&maxPrice=30000
```

#### Add to Cart (as Customer)
```http
POST http://localhost:5000/api/cart
Authorization: Bearer CUSTOMER_TOKEN_HERE
Content-Type: application/json

{
  "productId": "PRODUCT_ID_HERE",
  "quantity": 2
}
```

#### Get Cart
```http
GET http://localhost:5000/api/cart
Authorization: Bearer CUSTOMER_TOKEN_HERE
```

#### Create Order
```http
POST http://localhost:5000/api/orders
Authorization: Bearer CUSTOMER_TOKEN_HERE
Content-Type: application/json

{
  "orderItems": [
    {
      "product": "PRODUCT_ID",
      "vendor": "VENDOR_ID",
      "name": "Smartphone XYZ",
      "quantity": 1,
      "price": 24999,
      "image": "https://via.placeholder.com/500"
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India",
    "phone": "9876543210"
  },
  "paymentMethod": "COD",
  "itemsPrice": 24999,
  "taxPrice": 0,
  "shippingPrice": 0,
  "totalPrice": 24999
}
```

### 3️⃣ Test the Frontend (Browser)

1. **Open http://localhost:4200**

2. **Register as Customer:**
   - Click "Register"
   - Fill in details
   - Select role: "Customer"
   - Submit

3. **Browse Products:**
   - Go to "Products" in navbar
   - See all products
   - Search for products

4. **View Product Details:**
   - Click on any product card
   - See details, price, stock
   - Add to cart

5. **Cart Management:**
   - Click "Cart" in navbar
   - Update quantities
   - Remove items
   - See total price

6. **Checkout:**
   - Click "Proceed to Checkout"
   - Fill shipping address
   - Select payment method
   - Place order

7. **Register as Vendor:**
   - Logout
   - Register new account
   - Select role: "Vendor/Seller"

8. **Vendor Dashboard:**
   - After login as vendor, click "Dashboard"
   - Add new products
   - View your products
   - Delete products

### 4️⃣ Database Verification (MongoDB Compass/Shell)

Connect to: `mongodb://localhost:27017/mvmp_db`

**Check Collections:**
```javascript
// View users
db.users.find().pretty()

// View vendors
db.vendors.find().pretty()

// View products
db.products.find().pretty()

// View orders
db.orders.find().pretty()

// View carts
db.carts.find().pretty()
```

**Manually Create Admin User:**
```javascript
// First, register a user via API, then update their role
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { role: "admin" } }
)
```

## 🐛 Common Issues & Solutions

### Backend won't start
- **Check**: Is MongoDB running?
  ```powershell
  mongod
  ```
- **Check**: Port 5000 available?
- **Check**: Dependencies installed?
  ```powershell
  cd backend
  npm install
  ```

### Frontend won't start
- **Check**: Dependencies installed?
  ```powershell
  cd frontend
  npm install
  ```
- **Check**: Port 4200 available?

### CORS Errors
- Backend has CORS enabled, but ensure backend is running on port 5000

### Can't add to cart
- **Check**: You're logged in (check navbar)
- **Check**: Token is being sent (check Network tab in browser DevTools)

### Products not showing
- **Check**: Backend is running
- **Check**: Products exist in database
- **Check**: Products have `isActive: true` and `isApproved: true`

## ✅ Test Checklist

- [ ] Backend server starts successfully
- [ ] Frontend server starts successfully
- [ ] Can register as customer
- [ ] Can register as vendor
- [ ] Can login with credentials
- [ ] Can browse products on homepage
- [ ] Can search products
- [ ] Can view product details
- [ ] Can add product to cart
- [ ] Can view cart
- [ ] Can update cart quantities
- [ ] Can remove items from cart
- [ ] Can checkout and place order
- [ ] Vendor can access dashboard
- [ ] Vendor can add products
- [ ] Vendor can view their products
- [ ] Vendor can delete products
- [ ] JWT token is stored and used
- [ ] Protected routes redirect to login
- [ ] Role-based access works

## 🎯 Expected Results

After successful setup:
- ✅ Backend API responds at http://localhost:5000
- ✅ Frontend loads at http://localhost:4200
- ✅ Users can register and login
- ✅ Products can be created and viewed
- ✅ Shopping cart works
- ✅ Orders can be placed
- ✅ Vendor dashboard is functional
- ✅ Authentication protects routes

## 📊 Sample Test Data

Use these for quick testing:

**Customer Login:**
- Email: customer@test.com
- Password: password123

**Vendor Login:**
- Email: vendor@test.com  
- Password: password123

**Admin Login (after manual DB update):**
- Email: admin@test.com
- Password: password123

Happy Testing! 🎉
