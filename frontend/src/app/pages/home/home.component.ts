import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/models';

@Component({
  selector: 'app-home',
  template: `
    <div class="container" style="margin-top: 2rem;">
      <h1>Welcome to Multi-Vendor Marketplace</h1>
      <p style="font-size: 1.1rem; margin: 1rem 0;">Discover amazing products from multiple vendors!</p>
      
      <h2 style="margin: 2rem 0 1rem;">Featured Products</h2>
      
      <div *ngIf="loading" class="loading">Loading products...</div>
      
      <div class="grid">
        <div *ngFor="let product of products" class="product-card" (click)="viewProduct(product._id)">
          <div class="image-container" [class.no-image]="!hasValidImage(product)">
            <img *ngIf="hasValidImage(product)" 
                 [src]="product.images[0]" 
                 [alt]="product.name"
                 loading="lazy"
                 onerror="this.style.display='none'; this.parentElement.classList.add('no-image')">
          </div>
          <div class="product-card-body">
            <span *ngIf="product.brand" class="brand-tag">{{product.brand}}</span>
            <h3>{{product.name}}</h3>
            <p>{{product.description}}</p>
            
            <div class="product-meta">
              <div class="product-price">
                <span class="current-price">₹{{product.discountPrice || product.price}}</span>
                <span *ngIf="product.discountPrice" class="original-price">₹{{product.price}}</span>
                <span *ngIf="product.discountPrice" class="discount-badge">
                  {{calculateDiscount(product.price, product.discountPrice)}}% OFF
                </span>
              </div>
              
              <div class="rating-info">
                <lucide-icon name="star" class="star-icon"></lucide-icon>
                <span><strong>{{product.rating}}</strong> ({{product.numReviews}} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .star-icon {
      width: 16px;
      height: 16px;
      stroke: #f39c12;
      fill: #f39c12;
      stroke-width: 2;
      flex-shrink: 0;
    }
  `]
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  loading = false;

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.loading = true;
    this.productService.getProducts({ limit: 8, sort: 'newest' }).subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data;
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  calculateDiscount(original: number, discounted: number): number {
    return Math.round(((original - discounted) / original) * 100);
  }

  hasValidImage(product: Product): boolean {
    return !!(product.images && product.images.length > 0 && product.images[0] && product.images[0].trim() !== '');
  }

  viewProduct(id: string): void {
    window.location.href = `/products/${id}`;
  }
}
