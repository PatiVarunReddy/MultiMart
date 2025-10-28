import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { ReviewService, Review } from '../../../services/review.service';
import { Product } from '../../../models/models';
import { StarRatingComponent } from '../../../components/star-rating/star-rating.component';
import { ReviewListComponent } from '../../../components/review-list/review-list.component';
import { ReviewFormComponent } from '../../../components/review-form/review-form.component';
import { LucideAngularModule, Star, ShoppingCart, Package } from 'lucide-angular';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    StarRatingComponent,
    ReviewListComponent,
    ReviewFormComponent
  ],
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
            <app-star-rating [rating]="product.rating" [interactive]="false"></app-star-rating>
            <span>{{product.rating | number:'1.1-1'}} ({{product.numReviews}} {{product.numReviews === 1 ? 'review' : 'reviews'}})</span>
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

      <!-- Reviews Section -->
      <div class="reviews-section">
        <h2>Customer Reviews</h2>
        
        <div class="reviews-summary" *ngIf="product">
          <div class="overall-rating">
            <app-star-rating
              [rating]="product.rating"
              [ratingCount]="product.numReviews"
              [interactive]="false">
            </app-star-rating>
            <span class="rating-count">Based on {{product.numReviews}} reviews</span>
          </div>
        </div>

        <!-- Review Form -->
        <app-review-form
          *ngIf="showReviewForm"
          [productId]="product?._id!"
          (reviewSubmit)="onReviewSubmit($event)">
        </app-review-form>

        <!-- Review List -->
        <app-review-list
          [reviews]="reviews">
        </app-review-list>
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

    .reviews-section {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid #e0e0e0;
    }

    .reviews-summary {
      margin: 1.5rem 0;
      padding: 1.5rem;
      background-color: #f9f9f9;
      border-radius: 8px;
    }

    .overall-rating {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .rating-count {
      color: #666;
      font-size: 0.9rem;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  quantity = 1;
  message = '';
  messageClass = '';
  reviews: Review[] = [];
  showReviewForm = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private reviewService: ReviewService
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
        this.loadReviews(id);
        this.checkCanReview();
      },
      error: () => this.loading = false
    });
  }

  loadReviews(productId: string): void {
    this.reviewService.getProductReviews(productId).subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.reviews = response.data;
        }
      },
      error: (error) => console.error('Error loading reviews:', error)
    });
  }

  checkCanReview(): void {
    // TODO: Check if user has purchased the product
    // For now, we'll just allow reviews if logged in
    this.showReviewForm = true;
  }

  onReviewSubmit(review: { rating: number; comment: string; files: File[] }): void {
    if (!this.product?._id) return;

    this.reviewService.createReview(
      this.product._id,
      { rating: review.rating, comment: review.comment },
      review.files
    ).subscribe({
      next: (response) => {
        if (response.success) {
          // Update the product's rating and review count
          if (this.product) {
            this.product.numReviews = (this.product.numReviews || 0) + 1;
            // Recalculate average rating including the new review
            const totalRating = (this.product.rating * (this.product.numReviews - 1)) + review.rating;
            this.product.rating = totalRating / this.product.numReviews;
          }
          this.loadReviews(this.product!._id);
          this.showReviewForm = false;
        }
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        // Show error message to user
        this.message = 'Failed to submit review. Please try again.';
        this.messageClass = 'alert alert-error';
      }
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
