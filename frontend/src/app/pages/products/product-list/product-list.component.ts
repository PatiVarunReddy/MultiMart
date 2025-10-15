import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/models';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="container" style="margin-top: 2rem;">
      <h1>All Products</h1>
      
      <div style="margin: 2rem 0;">
        <input type="text" [(ngModel)]="searchTerm" (keyup.enter)="search()" placeholder="Search products..." class="form-control" style="max-width: 400px;">
      </div>
      
      <div *ngIf="loading" class="loading">Loading...</div>
      
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
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  searchTerm = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts({ search: this.searchTerm }).subscribe({
      next: (response: any) => {
        this.products = response.data;
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

  search(): void {
    this.loadProducts();
  }

  viewProduct(id: string): void {
    window.location.href = `/products/${id}`;
  }
}
