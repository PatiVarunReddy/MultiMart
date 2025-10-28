import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ShoppingCart } from 'lucide-angular';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
  template: `
    <div class="container" style="margin-top: 2rem;">
      <h1>Shopping Cart</h1>
      
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading your cart...</p>
      </div>
      
      <div *ngIf="!loading && cart && cart.items.length === 0" class="empty-cart-container">
        <div class="empty-cart-content">
          <i-lucide name="shopping-cart" size="64"></i-lucide>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <div class="suggestions">
            <h3>What you can do:</h3>
            <ul>
              <li>Browse our featured products</li>
              <li>Check out the latest deals</li>
              <li>Look at your saved items</li>
            </ul>
          </div>
          <button (click)="goToProducts()" class="btn btn-primary">
            Start Shopping
          </button>
        </div>
      </div>
      
      <div *ngIf="!loading && cart && cart.items.length > 0">
        <div *ngFor="let item of cart.items" class="card" style="display: flex; flex-direction: row; align-items: center; gap: 1rem; margin-bottom: 1rem;">
          <img [src]="item.product.images[0] || 'https://via.placeholder.com/100'" 
               [alt]="item.product.name"
               style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px;">
          <div style="flex: 1;">
            <h3>{{item.product.name}}</h3>
            <p class="price">₹{{item.product.discountPrice || item.product.price}}</p>
          </div>
          <div class="quantity-controls">
            <button (click)="updateQuantity(item.product._id, item.quantity - 1)" 
                    [disabled]="item.quantity <= 1"
                    class="btn btn-outline-secondary">-</button>
            <input type="number" [(ngModel)]="item.quantity" 
                   (change)="updateQuantity(item.product._id, item.quantity)" 
                   min="1" 
                   class="form-control quantity-input">
            <button (click)="updateQuantity(item.product._id, item.quantity + 1)"
                    class="btn btn-outline-secondary">+</button>
          </div>
          <div>
            <button (click)="removeItem(item.product._id)" class="btn btn-danger">
              Remove
            </button>
          </div>
        </div>
        
        <div class="cart-summary card">
          <h3>Order Summary</h3>
          <div class="summary-item">
            <span>Subtotal:</span>
            <span>₹{{calculateTotal()}}</span>
          </div>
          <div class="summary-item">
            <span>Shipping:</span>
            <span>FREE</span>
          </div>
          <div class="summary-item total">
            <span>Total:</span>
            <span>₹{{calculateTotal()}}</span>
          </div>
          <button (click)="checkout()" class="btn btn-success checkout-btn">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>

    <style>
      .empty-cart-container {
        text-align: center;
        padding: 3rem;
        background: #f8f9fa;
        border-radius: 8px;
        margin: 2rem 0;
      }

      .empty-cart-content {
        max-width: 500px;
        margin: 0 auto;
      }

      .empty-cart-content i-lucide {
        color: #6c757d;
        margin-bottom: 1.5rem;
      }

      .empty-cart-content h2 {
        color: #343a40;
        margin-bottom: 1rem;
      }

      .empty-cart-content p {
        color: #6c757d;
        font-size: 1.1rem;
        margin-bottom: 2rem;
      }

      .suggestions {
        text-align: left;
        margin: 2rem 0;
        padding: 1.5rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }

      .suggestions h3 {
        color: #495057;
        font-size: 1.2rem;
        margin-bottom: 1rem;
      }

      .suggestions ul {
        list-style: none;
        padding: 0;
      }

      .suggestions li {
        padding: 0.5rem 0;
        color: #6c757d;
        position: relative;
        padding-left: 1.5rem;
      }

      .suggestions li:before {
        content: "•";
        position: absolute;
        left: 0;
        color: #007bff;
      }

      .btn-primary {
        padding: 0.75rem 2rem;
        font-size: 1.1rem;
        background-color: #007bff;
        border: none;
        transition: all 0.3s ease;
      }

      .btn-primary:hover {
        background-color: #0056b3;
        transform: translateY(-2px);
      }

      .loading {
        text-align: center;
        padding: 2rem;
      }

      .spinner {
        width: 40px;
        height: 40px;
        margin: 0 auto 1rem;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .quantity-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .quantity-input {
        width: 60px;
        text-align: center;
      }

      .cart-summary {
        margin-top: 2rem;
        padding: 1.5rem;
        background: #f8f9fa;
        border-radius: 8px;
      }

      .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid #dee2e6;
      }

      .summary-item.total {
        border-bottom: none;
        font-weight: bold;
        font-size: 1.2rem;
        padding-top: 1rem;
        margin-bottom: 1.5rem;
      }

      .checkout-btn {
        width: 100%;
        padding: 1rem;
        font-size: 1.1rem;
      }

      .price {
        font-size: 1.1rem;
        color: #28a745;
        font-weight: 500;
      }
    </style>
  `
})
export class CartComponent implements OnInit {
  cart: any = null;
  loading = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (response: any) => {
        this.cart = response.data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) return;
    this.cartService.updateCartItem(productId, quantity).subscribe({
      next: () => this.loadCart()
    });
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => this.loadCart()
    });
  }

  calculateTotal(): number {
    if (!this.cart || !this.cart.items) return 0;
    return this.cart.items.reduce((total: number, item: any) => {
      const price = item.product.discountPrice || item.product.price;
      return total + (price * item.quantity);
    }, 0);
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}
