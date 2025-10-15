import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  template: `
    <div class="container" style="margin-top: 2rem;">
      <h1>Shopping Cart</h1>
      
      <div *ngIf="loading" class="loading">Loading...</div>
      
      <div *ngIf="!loading && cart && cart.items.length === 0">
        <p>Your cart is empty. <a routerLink="/products">Continue shopping</a></p>
      </div>
      
      <div *ngIf="!loading && cart && cart.items.length > 0">
        <div *ngFor="let item of cart.items" class="card" style="display: flex; flex-direction: row; align-items: center; gap: 1rem;">
          <img [src]="item.product.images[0] || 'https://via.placeholder.com/100'" style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px;">
          <div style="flex: 1;">
            <h3>{{item.product.name}}</h3>
            <p>₹{{item.product.discountPrice || item.product.price}}</p>
          </div>
          <div>
            <input type="number" [(ngModel)]="item.quantity" (change)="updateQuantity(item.product._id, item.quantity)" 
                   min="1" style="width: 60px;" class="form-control">
          </div>
          <div>
            <button (click)="removeItem(item.product._id)" class="btn btn-danger">Remove</button>
          </div>
        </div>
        
        <div class="card">
          <h3>Total: ₹{{calculateTotal()}}</h3>
          <button (click)="checkout()" class="btn btn-success">Proceed to Checkout</button>
        </div>
      </div>
    </div>
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
}
