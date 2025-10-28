# MEAN Stack Multi-Vendor Marketplace - Quick Start Guide

Write-Host "🚀 Welcome to MultiMart" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Backend Setup:" -ForegroundColor Green
Write-Host "   • Models: User, Vendor, Product, Order, Cart, Wishlist, Review, Category"
Write-Host "   • Authentication: JWT with role-based access (Customer/Vendor/Admin)"
Write-Host "   • API Endpoints: Auth, Products, Cart, Orders, Reviews, etc."
Write-Host ""

Write-Host "✅ Frontend Setup:" -ForegroundColor Green
Write-Host "   • Angular 17 with routing"
Write-Host "   • Components: Home, Products, Cart, Checkout, Dashboards"
Write-Host "   • Services: Auth, Product, Cart, Order"
Write-Host "   • Guards: Authentication & Role-based"
Write-Host ""

Write-Host "📋 To Start the Application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Start MongoDB (if not running):" -ForegroundColor White
Write-Host "    mongod" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  Start Backend Server (Terminal 1):" -ForegroundColor White
Write-Host "    cd backend" -ForegroundColor Gray
Write-Host "    npm run dev" -ForegroundColor Gray
Write-Host "    → Backend will run on http://localhost:5000" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣  Start Frontend Server (Terminal 2):" -ForegroundColor White
Write-Host "    cd frontend" -ForegroundColor Gray
Write-Host "    npm start" -ForegroundColor Gray
Write-Host "    → Frontend will run on http://localhost:4200" -ForegroundColor Gray
Write-Host ""

Write-Host "🎯 Quick Test Users:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Customer:" -ForegroundColor White
Write-Host "  Email: customer@test.com" -ForegroundColor Gray
Write-Host "  Password: password123" -ForegroundColor Gray
Write-Host ""
Write-Host "Vendor:" -ForegroundColor White
Write-Host "  Email: vendor@test.com" -ForegroundColor Gray
Write-Host "  Password: password123" -ForegroundColor Gray
Write-Host ""

Write-Host "📚 API Documentation: Check README.md for all endpoints" -ForegroundColor Cyan
Write-Host ""

$choice = Read-Host "Would you like to start the servers now? (y/n)"

if ($choice -eq "y" -or $choice -eq "Y") {
    Write-Host ""
    Write-Host "Starting Backend Server..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev"
    
    Start-Sleep -Seconds 3
    
    Write-Host "Starting Frontend Server..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm start"
    
    Write-Host ""
    Write-Host "✅ Both servers are starting in separate windows!" -ForegroundColor Green
    Write-Host "   Backend: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:4200" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "No problem! Start them manually when ready." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Happy coding! 🎉" -ForegroundColor Magenta
