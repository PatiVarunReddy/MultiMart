# MultiMart Platform (MEAN Stack)

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

**Required packages:**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `dotenv` - Environment variables
- `cors` - Cross-origin resource sharing
- `helmet` - Security headers
- `morgan` - Request logging
- `express-validator` - Input validation
- `express-rate-limit` - Rate limiting
- `multer` - File upload handling
- `csv-parser` - CSV file parsing (for bulk product import)

**Dev dependencies:**
- `nodemon` - Auto-restart server on changes

3. Configure environment variables:
Create a `.env` file in the backend folder:
```env
MONGODB_URI=mongodb://localhost:27017/mvmp_db
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
```

4. Seed initial data:
```powershell
# Seed categories
node scripts/seedCategories.js

# (Optional) Import 100 sample products from CSV
node scripts/importProductsFromCSV.js
```

5. Start MongoDB (if running locally):
```powershell
mongod
```

6. Run the backend server:
```powershell
# Development mode (auto-restart)
npm run dev

# OR Production mode
npm start
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

**Required packages:**
- `@angular/core` - Angular framework
- `@angular/router` - Routing
- `@angular/forms` - Forms handling
- `@angular/common/http` - HTTP client
- `rxjs` - Reactive programming
- `lucide-angular` - Icon library
- `tslib` - TypeScript runtime library

3. Update API endpoint (if needed):
The frontend is configured to connect to `http://localhost:5000/api`
If your backend runs on a different port, update the service files in `src/app/services/`

4. Start the development server:
```powershell
npm start
# OR
ng serve
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

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Express Validator** - Input validation
- **Express Rate Limit** - API rate limiting
- **Multer** - File upload handling
- **CSV Parser** - CSV file processing
- **Dotenv** - Environment configuration

### Frontend
- **Angular 17** - Frontend framework
- **TypeScript** - Programming language
- **RxJS** - Reactive programming
- **Lucide Angular** - Modern icon library
- **Angular Router** - Client-side routing
- **Angular Forms** - Form handling
- **HttpClient** - HTTP requests

### Security Features
- JWT with role-based access control
- Password hashing with bcrypt
- Helmet security headers
- Rate limiting on API endpoints
- CORS configuration
- Input validation and sanitization

## 📦 Complete Package List

### Backend Dependencies
```json
{
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "csv-parser": "^3.2.0",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "express-rate-limit": "^7.1.5",
  "express-validator": "^7.0.1",
  "helmet": "^7.1.0",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.0.0",
  "morgan": "^1.10.0",
  "multer": "^1.4.5-lts.1"
}
```

### Backend Dev Dependencies
```json
{
  "nodemon": "^3.0.2"
}
```

### Frontend Dependencies
Check `frontend/package.json` for the complete list of Angular dependencies.

## 🚀 Quick Start Commands

### First Time Setup
```powershell
# Backend
cd backend
npm install
# Create .env file with your MongoDB URI and JWT secret
node scripts/seedCategories.js
node scripts/importProductsFromCSV.js
npm run dev

# Frontend (in a new terminal)
cd frontend
npm install
npm start
```

### Daily Development
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

Access the application at `http://localhost:4200`

## 📝 License

MIT

## 👨‍💻 Development

This is a clean, minimal implementation focused on core functionality. No unnecessary files or bloat!
