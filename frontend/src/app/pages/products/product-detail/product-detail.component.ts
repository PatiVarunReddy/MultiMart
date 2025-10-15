import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../models/models';

@Component({
  selector: 'app-product-detail',
  template: `
    <div class="container" style="margin-top: 2rem;">
      <div *ngIf="loading" class="loading">Loading...</div>
      
      <div *ngIf="product" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div>
          <img [src]="product.images[0] || 'https://via.placeholder.com/500'" 
               [alt]="product.name" style="width: 100%; border-radius: 8px;">
        </div>
        
        <div>
          <h1>{{product.name}}</h1>
          <p style="font-size: 1.1rem; margin: 1rem 0;">{{product.description}}</p>
          
          <div class="product-price" style="font-size: 2rem; margin: 1rem 0;">
            ₹{{product.discountPrice || product.price}}
          </div>
          
          <div class="rating-container">
            <lucide-icon name="star" class="star-icon"></lucide-icon>
            <span>{{product.rating}} ({{product.numReviews}} reviews)</span>
          </div>
          <div class="stock-info">
            <lucide-icon name="package" class="package-icon"></lucide-icon>
            <span>Stock: {{product.stock}} units available</span>
          </div>
          
          <div style="margin: 2rem 0;">
            <label>Quantity: </label>
            <input type="number" [(ngModel)]="quantity" min="1" [max]="product.stock" 
                   style="width: 80px; margin: 0 1rem;" class="form-control">
            <button (click)="addToCart()" class="btn btn-primary" [disabled]="product.stock === 0">
              <lucide-icon name="shopping-cart" style="width: 18px; height: 18px; margin-right: 0.5rem;"></lucide-icon>
              Add to Cart
            </button>
          </div>
          
          <div *ngIf="message" [class]="messageClass">{{message}}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rating-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 1rem 0;
      font-size: 1rem;
    }
    
    .star-icon {
      width: 20px;
      height: 20px;
      stroke: #f39c12;
      fill: #f39c12;
      stroke-width: 2;
    }
    
    .stock-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 1rem 0;
      color: #27ae60;
    }
    
    .package-icon {
      width: 20px;
      height: 20px;
      stroke-width: 2;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  quantity = 1;
  message = '';
  messageClass = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadProduct(id);
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (response: any) => {
        this.product = response.data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  addToCart(): void {
    if (!this.product) return;
    
    this.cartService.addToCart(this.product._id, this.quantity).subscribe({
      next: () => {
        this.message = 'Product added to cart!';
        this.messageClass = 'alert alert-success';
        setTimeout(() => this.message = '', 3000);
      },
      error: () => {
        this.message = 'Failed to add to cart';
        this.messageClass = 'alert alert-error';
      }
    });
  }
}
