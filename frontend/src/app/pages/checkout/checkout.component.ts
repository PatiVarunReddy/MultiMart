import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  template: `
    <div class="container" style="margin-top: 2rem; max-width: 800px;">
      <h1>Checkout</h1>
      
      <div class="card">
        <h3>Shipping Address</h3>
        <div class="form-group">
          <input type="text" [(ngModel)]="address.street" placeholder="Street" class="form-control">
        </div>
        <div class="form-group">
          <input type="text" [(ngModel)]="address.city" placeholder="City" class="form-control">
        </div>
        <div class="form-group">
          <input type="text" [(ngModel)]="address.state" placeholder="State" class="form-control">
        </div>
        <div class="form-group">
          <input type="text" [(ngModel)]="address.zipCode" placeholder="ZIP Code" class="form-control">
        </div>
        <div class="form-group">
          <input type="text" [(ngModel)]="address.phone" placeholder="Phone" class="form-control">
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
          {{loading ? 'Placing Order...' : 'Place Order'}}
        </button>
      </div>
      
      <div *ngIf="message" [class]="messageClass">{{message}}</div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  address = { street: '', city: '', state: '', zipCode: '', country: 'India', phone: '' };
  paymentMethod = 'COD';
  total = 0;
  loading = false;
  message = '';
  messageClass = '';
  cart: any = null;

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
        this.message = 'Order placed successfully!';
        this.messageClass = 'alert alert-success';
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: () => {
        this.loading = false;
        this.message = 'Failed to place order';
        this.messageClass = 'alert alert-error';
      }
    });
  }
}
