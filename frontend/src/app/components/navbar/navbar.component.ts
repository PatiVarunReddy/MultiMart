import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar">
      <div class="container navbar-content">
        <div class="navbar-brand">
          <a routerLink="/" class="logo">
            <lucide-icon name="shopping-cart" class="logo-icon"></lucide-icon>
            <span class="logo-text">MultiMart</span>
          </a>
        </div>
        
        <div class="navbar-menu">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
            <lucide-icon name="home" class="nav-icon"></lucide-icon>
            Home
          </a>
          <a routerLink="/products" routerLinkActive="active" class="nav-link">
            <lucide-icon name="package" class="nav-icon"></lucide-icon>
            Products
          </a>
          <a routerLink="/cart" *ngIf="isLoggedIn" routerLinkActive="active" class="nav-link cart-link">
            <lucide-icon name="shopping-cart" class="nav-icon"></lucide-icon>
            Cart
            <span class="cart-badge" *ngIf="cartCount > 0">{{cartCount}}</span>
          </a>
          
          <span *ngIf="isLoggedIn" class="user-menu">
            <a *ngIf="userRole === 'vendor'" routerLink="/vendor/dashboard" routerLinkActive="active" class="nav-link">
              <lucide-icon name="trending-up" class="nav-icon"></lucide-icon>
              Dashboard
            </a>
            <a *ngIf="userRole === 'admin'" routerLink="/admin/dashboard" routerLinkActive="active" class="nav-link">
              <lucide-icon name="settings" class="nav-icon"></lucide-icon>
              Admin
            </a>
            <div class="user-dropdown">
              <button class="user-btn">
                <lucide-icon name="user" class="nav-icon"></lucide-icon>
                {{userName}}
              </button>
              <div class="dropdown-content">
                <a href="#" (click)="logout($event)" class="dropdown-item">
                  <lucide-icon name="log-out" class="nav-icon"></lucide-icon>
                  Logout
                </a>
              </div>
            </div>
          </span>
          
          <span *ngIf="!isLoggedIn" class="auth-buttons">
            <a routerLink="/login" class="nav-link btn-login">
              <lucide-icon name="user" class="nav-icon"></lucide-icon>
              Login
            </a>
            <a routerLink="/register" class="nav-link btn-register">
              <lucide-icon name="user" class="nav-icon"></lucide-icon>
              Register
            </a>
          </span>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
    }
    
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: bold;
      transition: transform 0.3s;
    }
    
    .logo:hover {
      transform: scale(1.05);
    }
    
    .logo-icon {
      width: 28px;
      height: 28px;
      stroke-width: 2;
    }
    
    .logo-text {
      font-family: 'Segoe UI', sans-serif;
      letter-spacing: 1px;
    }
    
    .tagline {
      color: rgba(255,255,255,0.8);
      font-size: 0.85rem;
      display: none;
    }
    
    @media (min-width: 768px) {
      .tagline {
        display: block;
      }
    }
    
    .navbar-menu {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .nav-link {
      color: white;
      text-decoration: none;
      padding: 0.6rem 1rem;
      border-radius: 8px;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 500;
      position: relative;
    }
    
    .nav-link:hover {
      background: rgba(255,255,255,0.2);
      transform: translateY(-2px);
    }
    
    .nav-link.active {
      background: rgba(255,255,255,0.25);
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .nav-icon {
      width: 18px;
      height: 18px;
      stroke-width: 2;
    }
    
    .cart-link {
      position: relative;
    }
    
    .cart-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #e74c3c;
      color: white;
      border-radius: 50%;
      padding: 0.2rem 0.5rem;
      font-size: 0.75rem;
      font-weight: bold;
      min-width: 20px;
      text-align: center;
    }
    
    .auth-buttons {
      display: flex;
      gap: 0.5rem;
    }
    
    .btn-login {
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.3);
    }
    
    .btn-register {
      background: rgba(255,255,255,0.95);
      color: #667eea;
      font-weight: 600;
    }
    
    .btn-register:hover {
      background: white;
      color: #764ba2;
    }
    
    .user-menu {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .user-dropdown {
      position: relative;
    }
    
    .user-btn {
      background: rgba(255,255,255,0.2);
      color: white;
      border: none;
      padding: 0.6rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 500;
      transition: all 0.3s;
    }
    
    .user-btn:hover {
      background: rgba(255,255,255,0.3);
    }
    
    .dropdown-content {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      min-width: 150px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s;
    }
    
    .user-dropdown:hover .dropdown-content {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.8rem 1rem;
      color: #2c3e50;
      text-decoration: none;
      transition: all 0.3s;
    }
    
    .dropdown-item:hover {
      background: #f8f9fa;
      color: #667eea;
    }
    
    .dropdown-item:first-child {
      border-radius: 8px 8px 0 0;
    }
    
    .dropdown-item:last-child {
      border-radius: 0 0 8px 8px;
    }
  `]
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userRole = '';
  userName = '';
  cartCount = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user: any) => {
      this.isLoggedIn = !!user;
      this.userRole = user?.role || '';
      this.userName = user?.name || 'User';
      
      // Load cart when user is logged in
      if (user) {
        this.cartService.loadCartCount();
      }
    });

    this.cartService.cartItems$.subscribe((count: any) => {
      this.cartCount = count;
    });
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.cartService.loadCartCount(); // Clear cart count on logout
    this.router.navigate(['/']);
  }
}
