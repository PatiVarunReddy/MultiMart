# NPM Package Installation Guide

## 🎯 Complete Installation Commands

### Backend Packages

#### Core Dependencies (Install All at Once)
```powershell
cd backend
npm install express mongoose bcryptjs jsonwebtoken dotenv cors helmet morgan express-validator express-rate-limit multer csv-parser
```

#### Or Install One by One
```powershell
npm install express              # Web framework
npm install mongoose             # MongoDB ODM
npm install bcryptjs             # Password hashing
npm install jsonwebtoken         # JWT authentication
npm install dotenv               # Environment variables
npm install cors                 # Cross-origin resource sharing
npm install helmet               # Security headers
npm install morgan               # Request logging
npm install express-validator    # Input validation
npm install express-rate-limit   # Rate limiting
npm install multer               # File uploads
npm install csv-parser           # CSV file parsing
```

#### Dev Dependencies
```powershell
npm install --save-dev nodemon   # Auto-restart on changes
```

### Frontend Packages

#### Angular & Core Packages
```powershell
cd frontend
npm install
```

This will install all packages from `package.json` including:
- `@angular/core`, `@angular/common`, `@angular/router`, `@angular/forms`
- `rxjs` - Reactive programming
- `tslib` - TypeScript runtime
- `zone.js` - Angular change detection
- `lucide-angular` - Icon library

#### Additional Frontend Packages (if needed)
```powershell
npm install lucide-angular       # Modern icon library
```

## 📋 Package Purposes

### Backend

| Package | Purpose | When Used |
|---------|---------|-----------|
| `express` | Web framework for Node.js | Core - Always needed |
| `mongoose` | MongoDB object modeling | Core - Always needed |
| `bcryptjs` | Hash passwords securely | User authentication |
| `jsonwebtoken` | Create & verify JWT tokens | Authentication & authorization |
| `dotenv` | Load environment variables from .env | Configuration management |
| `cors` | Enable CORS for frontend-backend communication | API requests from Angular |
| `helmet` | Add security headers to responses | Production security |
| `morgan` | Log HTTP requests | Debugging & monitoring |
| `express-validator` | Validate & sanitize user input | Form submissions |
| `express-rate-limit` | Limit repeated requests | API protection |
| `multer` | Handle file uploads | Product images |
| `csv-parser` | Parse CSV files | Bulk product import |
| `nodemon` | Auto-restart server on code changes | Development only |

### Frontend

| Package | Purpose |
|---------|---------|
| `@angular/core` | Angular framework core |
| `@angular/router` | Client-side routing |
| `@angular/forms` | Form handling (Template & Reactive) |
| `@angular/common/http` | HTTP client for API calls |
| `rxjs` | Reactive programming & observables |
| `lucide-angular` | Modern SVG icon library |
| `typescript` | TypeScript compiler |
| `zone.js` | Change detection |

## 🔍 Verify Installation

### Check Installed Packages
```powershell
# Backend
cd backend
npm list --depth=0

# Frontend
cd frontend
npm list --depth=0
```

### Check for Vulnerabilities
```powershell
npm audit

# Fix vulnerabilities
npm audit fix
```

### Update Packages
```powershell
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm update express
```

## 🚨 Common Issues & Solutions

### Issue: `npm install` fails
**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Module not found
**Solution:**
```powershell
# Make sure you're in the correct directory
cd backend  # or cd frontend

# Reinstall the missing package
npm install <package-name>
```

### Issue: Version conflicts
**Solution:**
```powershell
# Use exact versions from package.json
npm ci

# Or force install
npm install --force
```

## 📦 Package.json Scripts

### Backend Scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed:categories": "node scripts/seedCategories.js",
    "seed:products": "node scripts/importProductsFromCSV.js"
  }
}
```

**Usage:**
```powershell
npm start                # Production mode
npm run dev             # Development mode with nodemon
npm run seed:categories # Seed categories
npm run seed:products   # Import 100 products from CSV
```

### Frontend Scripts
```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch",
    "test": "ng test"
  }
}
```

**Usage:**
```powershell
npm start              # Start dev server
npm run build          # Build for production
npm run build --prod   # Optimized production build
npm test               # Run tests
```

## 🎓 Quick Reference

### Full Setup (First Time)
```powershell
# Backend
cd backend
npm install
echo MONGODB_URI=mongodb://localhost:27017/mvmp_db > .env
echo JWT_SECRET=your-secret-key-here >> .env
echo PORT=5000 >> .env
node scripts/seedCategories.js
node scripts/importProductsFromCSV.js
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm start
```

### Daily Development
```powershell
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start
```

## ✅ Installation Checklist

- [ ] Node.js installed (v16+)
- [ ] MongoDB installed and running
- [ ] Backend: `npm install` completed
- [ ] Backend: `.env` file created
- [ ] Backend: Categories seeded
- [ ] Backend: Products imported
- [ ] Frontend: `npm install` completed
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 4200)
- [ ] Can access http://localhost:4200

## 🔗 Useful NPM Commands

```powershell
npm init                    # Initialize new package.json
npm install <package>       # Install package
npm install -g <package>    # Install globally
npm uninstall <package>     # Remove package
npm list                    # List installed packages
npm outdated                # Check for updates
npm update                  # Update packages
npm audit                   # Check vulnerabilities
npm run <script>           # Run package.json script
npm cache clean --force    # Clear npm cache
```

---

**Note:** Always run `npm install` after pulling new code to ensure you have the latest dependencies!
