import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  template: `
    <div class="container" style="margin-top: 2rem; max-width: 800px;">
      <!-- Success Modal -->
      <div *ngIf="orderSuccess" class="success-overlay">
        <div class="success-modal">
          <div class="success-icon">
            <lucide-icon name="check-circle" size="64"></lucide-icon>
          </div>
          <h2>Order Placed Successfully!</h2>
          <p class="success-message">Thank you for your order. Your order has been received and is being processed.</p>
          <div class="order-details">
            <div class="detail-item">
              <span>Order Total:</span>
              <strong>₹{{total}}</strong>
            </div>
            <div class="detail-item">
              <span>Payment Method:</span>
              <strong>{{paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod}}</strong>
            </div>
            <div class="detail-item">
              <span>Delivery Address:</span>
              <strong>{{formatAddress()}}</strong>
            </div>
          </div>
          <div class="success-actions">
            <button (click)="goToHome()" class="btn btn-primary">Continue Shopping</button>
            <button (click)="viewOrders()" class="btn btn-outline">View Orders</button>
          </div>
        </div>
      </div>

      <!-- Checkout Form -->
      <div [class.blur-background]="orderSuccess">
        <h1>Checkout</h1>
        
        <div class="card">
          <h3>Shipping Address</h3>
          <div class="form-group">
            <input 
              type="text" 
              [(ngModel)]="address.street" 
              placeholder="Street Address" 
              class="form-control"
              autocomplete="street-address">
          </div>
          <div class="form-group">
            <input 
              type="text" 
              [(ngModel)]="address.city" 
              placeholder="City" 
              class="form-control"
              autocomplete="address-level2">
          </div>
          <div class="form-group">
            <input 
              type="text" 
              [(ngModel)]="address.state" 
              placeholder="State" 
              class="form-control"
              autocomplete="address-level1">
          </div>
          <div class="form-group">
            <input 
              type="text" 
              [(ngModel)]="address.zipCode" 
              placeholder="ZIP Code" 
              class="form-control"
              autocomplete="postal-code">
          </div>
          <div class="form-group">
            <input 
              type="tel" 
              [(ngModel)]="address.phone" 
              placeholder="Phone" 
              class="form-control"
              autocomplete="tel">
          </div>
        </div>
        
        <div class="card">
          <h3>Payment Method</h3>
          <select [(ngModel)]="paymentMethod" class="form-control">
            <option value="COD">Cash on Delivery</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
          </select>
        </div>
        
        <div class="card">
          <h3>Order Total: ₹{{total}}</h3>
          <button (click)="placeOrder()" class="btn btn-success" [disabled]="loading">
            <span *ngIf="!loading">Place Order</span>
            <div *ngIf="loading" class="loading-spinner">
              <div class="spinner"></div>
              <span>Placing Order...</span>
            </div>
          </button>
        </div>
        
        <div *ngIf="message && !orderSuccess" [class]="messageClass">{{message}}</div>
      </div>
    </div>
  `,
  styles: [`
    .success-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .success-modal {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .success-icon {
      color: #28a745;
      margin-bottom: 1rem;
    }

    .success-message {
      color: #666;
      margin: 1rem 0;
      font-size: 1.1rem;
    }

    .order-details {
      margin: 2rem 0;
      text-align: left;
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #dee2e6;
    }

    .detail-item:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .success-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
    }

    .btn-outline {
      background: transparent;
      border: 2px solid #007bff;
      color: #007bff;
      padding: 0.5rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-outline:hover {
      background: #007bff;
      color: white;
    }

    .blur-background {
      filter: blur(4px);
      pointer-events: none;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #ffffff;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      margin-bottom: 1.5rem;
    }
  `]
})
export class CheckoutComponent implements OnInit {
  address = { street: '', city: '', state: '', zipCode: '', country: 'India', phone: '' };
  paymentMethod = 'COD';
  total = 0;
  loading = false;
  message = '';
  messageClass = '';
  cart: any = null;
  orderSuccess = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe({
      next: (response: any) => {
        this.cart = response.data;
        this.calculateTotal();
      }
    });
  }

  calculateTotal(): void {
    if (!this.cart || !this.cart.items) return;
    this.total = this.cart.items.reduce((sum: number, item: any) => {
      const price = item.product.discountPrice || item.product.price;
      return sum + (price * item.quantity);
    }, 0);
  }

  formatAddress(): string {
    const addr = this.address;
    return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  viewOrders(): void {
    this.router.navigate(['/orders']);
  }

  placeOrder(): void {
    if (!this.address.street || !this.address.city) {
      this.message = 'Please fill in all address fields';
      this.messageClass = 'alert alert-error';
      return;
    }

    this.loading = true;
    
    const orderData = {
      orderItems: this.cart.items.map((item: any) => ({
        product: item.product._id,
        vendor: item.product.vendor,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.discountPrice || item.product.price,
        image: item.product.images[0]
      })),
      shippingAddress: this.address,
      paymentMethod: this.paymentMethod,
      itemsPrice: this.total,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: this.total
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        this.cartService.clearCart().subscribe();
        this.orderSuccess = true;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.message = 'Failed to place order';
        this.messageClass = 'alert alert-error';
      }
    });
  }
}
