# Multi-Vendor Marketplace Platform (MEAN Stack)

A complete eCommerce platform built with **MongoDB, Express.js, Angular, and Node.js**.

## 🚀 Features

### Customer Features
- Browse products with search and filters
- Product details with reviews and ratings
- Shopping cart management
- Checkout with multiple payment options (COD, Card, UPI)
- Order tracking

### Vendor Features
- Vendor dashboard with analytics
- Product management (CRUD operations)
- Order management
- Sales tracking

### Admin Features
- Platform management
- User and vendor approval
- Product moderation
- Analytics and reporting

## 📁 Project Structure

```
mvmp_project/
├── backend/           # Node.js + Express API
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── controllers/   # Business logic
│   ├── middleware/    # Auth & validation
│   ├── config/        # DB configuration
│   └── server.js      # Entry point
│
└── frontend/          # Angular application
    ├── src/
    │   ├── app/
    │   │   ├── components/    # Reusable components
    │   │   ├── pages/         # Page components
    │   │   ├── services/      # API services
    │   │   ├── guards/        # Route guards
    │   │   ├── interceptors/  # HTTP interceptors
    │   │   └── models/        # TypeScript interfaces
    │   └── styles.css         # Global styles
    └── angular.json
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (v5+)
- Angular CLI (optional)

### Backend Setup

1. Navigate to backend folder:
```powershell
cd backend
```

2. Install dependencies:
```powershell
npm install
```

3. Configure environment variables:
Edit `.env` file with your MongoDB URI and JWT secret

4. Start MongoDB (if running locally)

5. Run the backend server:
```powershell
npm run dev
```
Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```powershell
cd frontend
```

2. Install dependencies:
```powershell
npm install
```

3. Start the development server:
```powershell
npm start
```
Frontend will run on `http://localhost:4200`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Vendor/Admin)
- `PUT /api/products/:id` - Update product (Vendor/Admin)
- `DELETE /api/products/:id` - Delete product (Vendor/Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:productId` - Update cart item
- `DELETE /api/cart/:productId` - Remove from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/:productId` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist

## 🔐 User Roles

1. **Customer** - Browse and purchase products
2. **Vendor** - Sell products and manage inventory
3. **Admin** - Platform management and oversight

## 🎯 Quick Test

### Register as Customer
```
POST http://localhost:5000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"
}
```

### Register as Vendor
```
POST http://localhost:5000/api/auth/register
{
  "name": "Seller Name",
  "email": "seller@example.com",
  "password": "password123",
  "role": "vendor",
  "phone": "1234567890"
}
```

## 🔧 Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt
- **Frontend**: Angular 17, RxJS, TypeScript
- **Security**: Helmet, Rate Limiting, CORS
- **Authentication**: JWT with role-based access control

## 📝 License

MIT

## 👨‍💻 Development

This is a clean, minimal implementation focused on core functionality. No unnecessary files or bloat!
