import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { Review } from '../../services/review.service';
import { LucideAngularModule, Image } from 'lucide-angular';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, StarRatingComponent, LucideAngularModule],
  template: `
    <div class="reviews-container">
      <div *ngFor="let review of reviews" class="review-card">
        <div class="review-header">
          <div class="user-info">
            <div class="avatar-name">
              <div class="user-avatar">
                <img [src]="review.user.avatar || 'assets/default-avatar.png'" 
                     [alt]="review.user.name">
              </div>
              <div class="user-details">
                <div class="name-rating">
                  <span class="user-name">{{review.user.name}}</span>
                  <app-star-rating 
                    [rating]="review.rating"
                    [interactive]="false"
                    [showCount]="false">
                  </app-star-rating>
                </div>
                <span class="review-date">{{review.createdAt | date:'MMM dd, yyyy'}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="review-content">
          <p class="review-comment">{{review.comment}}</p>

          <div *ngIf="review.images?.length" class="review-images">
            <div *ngFor="let image of review.images" class="review-image-container">
              <img [src]="'http://localhost:3000/' + image"
                   alt="Review photo"
                   class="review-image"
                   (click)="openImageModal('http://localhost:3000/' + image)"
                   (error)="onImageError($event)">
            </div>
          </div>

          <div class="review-footer">
            <div class="review-badges">
              <span *ngIf="review.isVerifiedPurchase" class="verified-badge">
                ✓ Verified Purchase
              </span>
            </div>
            <button class="helpful-btn" (click)="onHelpfulClick(review)">
              Helpful ({{review.helpfulCount || 0}})
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reviews-container {
      margin-top: 2rem;
    }

    .review-card {
      padding: 2rem;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: box-shadow 0.2s ease;
    }

    .review-card:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    }

    .review-header {
      margin-bottom: 1.5rem;
    }

    .user-info {
      display: flex;
      align-items: flex-start;
    }

    .avatar-name {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid #f3f4f6;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .name-rating {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-name {
      font-weight: 600;
      color: #111827;
      font-size: 1.05rem;
    }

    .review-date {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .review-content {
      padding-left: calc(48px + 1rem);
    }

    .review-comment {
      margin: 1rem 0;
      line-height: 1.7;
      color: #374151;
      font-size: 0.95rem;
    }

    .review-images {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin: 1.5rem 0;
    }

    .review-image-container {
      position: relative;
      width: 140px;
      height: 140px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease;
    }

    .review-image-container:hover {
      transform: translateY(-2px);
    }

    .review-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .review-image-container:hover .review-image {
      transform: scale(1.08);
    }

    .review-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #f3f4f6;
    }

    .verified-badge {
      background-color: #ecfdf5;
      color: #065f46;
      padding: 0.375rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    .helpful-btn {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      color: #4b5563;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .helpful-btn:hover {
      background-color: #f3f4f6;
      border-color: #d1d5db;
    }
  `]
})
export class ReviewListComponent {
  @Input() reviews: Review[] = [];

  openImageModal(imageUrl: string) {
    window.open(imageUrl, '_blank');
  }

  onImageError(event: any) {
    event.target.src = 'assets/image-placeholder.png';
    event.target.classList.add('error');
  }

  onHelpfulClick(review: Review) {
    // TODO: Implement helpful functionality
    console.log('Marked as helpful:', review._id);
  }
}