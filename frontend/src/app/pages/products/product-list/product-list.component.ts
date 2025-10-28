import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="container" style="margin-top: 2rem;">
      <h1>All Products</h1>
      
      <!-- Simple Search and Filter Section -->
      <div class="filters-section">
        <div class="search-bar">
          <lucide-icon name="search" class="search-icon"></lucide-icon>
          <input type="text" 
                 [(ngModel)]="searchTerm" 
                 (keyup.enter)="applyFilters()"
                 placeholder="Search products..." 
                 class="search-input">
        </div>

        <div class="filter-controls">
          <select [(ngModel)]="selectedCategory" (change)="applyFilters()" class="control-item">
            <option value="">All Categories</option>
            <option *ngFor="let category of categories" [value]="category._id">
              {{category.name}}
            </option>
          </select>

          <input type="number" 
                 [(ngModel)]="minPrice" 
                 (change)="applyFilters()"
                 placeholder="Min Price (₹)" 
                 class="control-item">

          <input type="number" 
                 [(ngModel)]="maxPrice" 
                 (change)="applyFilters()"
                 placeholder="Max Price (₹)" 
                 class="control-item">

          <select [(ngModel)]="sortBy" (change)="applyFilters()" class="control-item">
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          <button class="btn-apply" (click)="applyFilters()">
            Apply Filters
          </button>

          <button class="btn-clear" (click)="clearFilters()" *ngIf="hasActiveFilters()">
            Clear All
          </button>
        </div>
      </div>
          
          <div class="filter-item">
            <button class="btn-clear" (click)="clearFilters()">
              <lucide-icon name="x" style="width: 16px; height: 16px;"></lucide-icon>
              Clear All
            </button>
          </div>
        </div>
        
        <!-- Active Filters Display -->
        <div *ngIf="hasActiveFilters()" class="active-filters">
          <span class="filter-label">Active Filters:</span>
          <span *ngIf="searchTerm" class="filter-tag">
            Search: "{{searchTerm}}"
            <lucide-icon name="x" style="width: 12px; height: 12px; cursor: pointer;" (click)="searchTerm=''; applyFilters()"></lucide-icon>
          </span>
          <span *ngIf="selectedCategory" class="filter-tag">
            {{getCategoryName(selectedCategory)}}
            <lucide-icon name="x" style="width: 12px; height: 12px; cursor: pointer;" (click)="selectedCategory=''; applyFilters()"></lucide-icon>
          </span>
          <span *ngIf="minPrice" class="filter-tag">
            Min: ₹{{minPrice}}
            <lucide-icon name="x" style="width: 12px; height: 12px; cursor: pointer;" (click)="minPrice=null; applyFilters()"></lucide-icon>
          </span>
          <span *ngIf="maxPrice" class="filter-tag">
            Max: ₹{{maxPrice}}
            <lucide-icon name="x" style="width: 12px; height: 12px; cursor: pointer;" (click)="maxPrice=null; applyFilters()"></lucide-icon>
          </span>
        </div>
      
      <!-- Results Header -->
      <div class="results-header">
        <h2>
          {{searchTerm || selectedCategory || minPrice || maxPrice ? 'Filtered Results' : 'All Products'}}
        </h2>
        <p class="results-count">
          Showing <strong>{{products.length}}</strong> of <strong>{{totalProducts}}</strong> products
        </p>
      </div>
      
      <div *ngIf="loading" class="loading">
        <lucide-icon name="package" style="width: 48px; height: 48px; animation: spin 1s linear infinite;"></lucide-icon>
        <p>Loading products...</p>
      </div>
      
      <div *ngIf="!loading && products.length === 0" class="no-products">
        <lucide-icon name="package" style="width: 64px; height: 64px; stroke: #bdc3c7; margin-bottom: 1rem;"></lucide-icon>
        <p style="font-size: 1.2rem; color: #7f8c8d;">No products found matching your criteria</p>
        <button class="btn btn-primary" (click)="clearFilters()">Clear All Filters</button>
      </div>
      
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
  `,
  styles: [`
    .filters-section {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      margin: 2rem 0;
    }
    
    .search-container {
      margin-bottom: 2rem;
    }
    
    .search-bar {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #f8f9fa;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      border: 2px solid #e9ecef;
      transition: all 0.3s ease;
    }
    
    .search-bar:focus-within {
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }
    
    .search-icon {
      width: 24px;
      height: 24px;
      stroke: #6c757d;
      stroke-width: 2;
      flex-shrink: 0;
    }
    
    .search-suggestions {
      margin-top: 0.75rem;
      padding: 0.5rem 1rem;
      color: #6c757d;
      font-size: 0.9rem;
    }
    
    .search-input {
      flex: 1;
      
    .filter-controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      align-items: start;
    }
    
    .filter-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .filter-item label {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #495057;
      font-weight: 500;
      font-size: 0.95rem;
      line-height: 1;
      margin-bottom: 0.5rem;
    }
    
    .filter-item label lucide-icon {
      width: 18px;
      height: 18px;
      stroke: #6c757d;
      stroke-width: 2;
      flex-shrink: 0;
      position: relative;
      top: -1px;
    }
    
    .filter-item label span {
      position: relative;
      top: 1px;
    }
    
    .filter-select, .filter-input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      background-color: white;
      color: #495057;
      font-size: 0.95rem;
      height: 38px;
    }
    
    .filter-select:focus, .filter-input:focus {
      border-color: #80bdff;
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }
    
    .btn-clear {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: #e9ecef;
      border: none;
      border-radius: 4px;
      color: #495057;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 1.5rem;
    }
    
    .btn-clear:hover {
      background-color: #dee2e6;
    }
    
    .btn-clear lucide-icon {
      width: 16px;
      height: 16px;
      stroke: #495057;
    }
    
    .search-input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      font-size: 0.95rem;
    }
    
    .btn-search {
      padding: 0.5rem 1.5rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .btn-search:hover {
      background-color: #0056b3;
    }
      padding: 0.8rem 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s;
    }
    
    .search-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .btn-search {
      padding: 0.8rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .btn-search:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .filter-controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      align-items: end;
    }
    
    .filter-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .filter-item label {
      font-weight: 600;
      font-size: 0.9rem;
      color: #2c3e50;
    }
    
    .filter-select,
    .filter-input {
      padding: 0.7rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: all 0.3s;
      background: white;
    }
    
    .filter-select:focus,
    .filter-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .btn-clear {
      padding: 0.7rem 1.5rem;
      background: #ecf0f1;
      color: #2c3e50;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s;
    }
    
    .btn-clear:hover {
      background: #d5dbdb;
    }
    
    .active-filters {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
    }
    
    .filter-label {
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.9rem;
    }
    
    .filter-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
      transition: all 0.3s ease;
    }

    .filter-badge:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }

    .filter-badge lucide-icon {
      width: 16px;
      height: 16px;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .filter-badge lucide-icon:hover {
      transform: scale(1.2);
    }

    .filter-summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      margin: 1.5rem 0;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .btn-clear-all {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.2rem;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-clear-all:hover {
      background: #c82333;
      transform: translateY(-1px);
    }

    .btn-clear-all lucide-icon {
      width: 16px;
      height: 16px;
    }
    
    .results-header {
      margin: 2rem 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    
    .results-header h2 {
      margin: 0;
      color: #2c3e50;
    }
    
    .results-count {
      color: #7f8c8d;
      font-size: 1rem;
      margin: 0;
    }
    
    .loading {
      text-align: center;
      padding: 4rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      color: #7f8c8d;
    }
    
    .no-products {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .star-icon {
      width: 16px;
      height: 16px;
      stroke: #f39c12;
      fill: #f39c12;
      stroke-width: 2;
      flex-shrink: 0;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: any[] = [];
  loading = false;
  searchTerm = '';
  selectedCategory = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy = 'newest';
  totalProducts = 0;

  constructor(
    private productService: ProductService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.http.get<any>(`${environment.apiUrl}/categories`)
      .subscribe({
        next: (response) => {
          this.categories = response.data || response || [];
        },
        error: (error) => {
          console.error('Error loading categories:', error);
        }
      });
  }

  loadProducts(): void {
    this.loading = true;
    const params: any = {
      sort: this.sortBy,
      limit: 50
    };

    if (this.searchTerm) {
      params.search = this.searchTerm;
    }
    if (this.selectedCategory) {
      params.category = this.selectedCategory;
    }
    if (this.minPrice !== null && this.minPrice !== undefined) {
      params.minPrice = this.minPrice;
    }
    if (this.maxPrice !== null && this.maxPrice !== undefined) {
      params.maxPrice = this.maxPrice;
    }

    this.productService.getProducts(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data || [];
          this.totalProducts = response.total || response.data?.length || 0;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.loadProducts();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.sortBy = 'newest';
    this.loadProducts();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.selectedCategory || this.minPrice || this.maxPrice);
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c._id === categoryId);
    return category ? category.name : '';
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

  getSortLabel(): string {
    switch (this.sortBy) {
      case 'price-asc':
        return 'Price: Low to High';
      case 'price-desc':
        return 'Price: High to Low';
      case 'rating':
        return 'Highest Rated';
      default:
        return 'Newest First';
    }
  }

  viewProduct(id: string): void {
    window.location.href = `/products/${id}`;
  }
}
