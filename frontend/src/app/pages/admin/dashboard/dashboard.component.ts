import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Review {
  _id: string;
  user: { name: string; email: string };
  product: { _id: string; name: string; images: string[] };
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  rejectionReason?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h1>Admin Dashboard</h1>
        <div class="tab-nav">
          <button 
            [class.active]="activeTab === 'overview'" 
            (click)="activeTab = 'overview'; loadDashboardStats()">
            Overview
          </button>
          <button 
            [class.active]="activeTab === 'reviews'" 
            (click)="activeTab = 'reviews'; loadPendingReviews()">
            Review Management
            <span class="badge" *ngIf="stats?.pendingReviews > 0">{{stats?.pendingReviews}}</span>
          </button>
        </div>
      </div>

      <!-- Overview Tab -->
      <div *ngIf="activeTab === 'overview'" class="tab-content">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon users-icon">👥</div>
            <div class="stat-info">
              <h3>{{stats?.totalUsers || 0}}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon products-icon">📦</div>
            <div class="stat-info">
              <h3>{{stats?.totalProducts || 0}}</h3>
              <p>Total Products</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon orders-icon">🛒</div>
            <div class="stat-info">
              <h3>{{stats?.totalOrders || 0}}</h3>
              <p>Total Orders</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon revenue-icon">💰</div>
            <div class="stat-info">
              <h3>₹{{stats?.totalRevenue || 0}}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        <div class="review-stats">
          <h2>Review Statistics</h2>
          <div class="review-stat-grid">
            <div class="review-stat pending">
              <h3>{{stats?.pendingReviews || 0}}</h3>
              <p>Pending Reviews</p>
            </div>
            <div class="review-stat approved">
              <h3>{{stats?.approvedReviews || 0}}</h3>
              <p>Approved Reviews</p>
            </div>
            <div class="review-stat rejected">
              <h3>{{stats?.rejectedReviews || 0}}</h3>
              <p>Rejected Reviews</p>
            </div>
          </div>
        </div>

        <div class="recent-section">
          <div class="recent-users">
            <h2>Recent Users</h2>
            <div class="user-list">
              <div *ngFor="let user of recentUsers" class="user-item">
                <div>
                  <strong>{{user.name}}</strong>
                  <span class="email">{{user.email}}</span>
                </div>
                <span class="role-badge" [class]="user.role">{{user.role}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Tab -->
      <div *ngIf="activeTab === 'reviews'" class="tab-content">
        <div class="review-filters">
          <button 
            [class.active]="reviewFilter === 'pending'" 
            (click)="filterReviews('pending')">
            Pending ({{stats?.pendingReviews || 0}})
          </button>
          <button 
            [class.active]="reviewFilter === 'approved'" 
            (click)="filterReviews('approved')">
            Approved ({{stats?.approvedReviews || 0}})
          </button>
          <button 
            [class.active]="reviewFilter === 'rejected'" 
            (click)="filterReviews('rejected')">
            Rejected ({{stats?.rejectedReviews || 0}})
          </button>
          <button 
            [class.active]="reviewFilter === 'all'" 
            (click)="filterReviews('all')">
            All Reviews
          </button>
        </div>

        <div *ngIf="loading" class="loading">Loading reviews...</div>

        <div *ngIf="!loading && reviews.length === 0" class="no-reviews">
          <p>No {{reviewFilter}} reviews found</p>
        </div>

        <div class="reviews-list">
          <div *ngFor="let review of reviews" class="review-card">
            <div class="review-header">
              <div class="review-product">
                <img [src]="review.product.images[0]" [alt]="review.product.name" *ngIf="review.product.images?.length">
                <div>
                  <h3>{{review.product.name}}</h3>
                  <p class="review-user">
                    By: {{review.user.name}} 
                    <span class="verified" *ngIf="review.isVerifiedPurchase">✓ Verified Purchase</span>
                  </p>
                </div>
              </div>
              <span class="status-badge" [class]="review.status">{{review.status}}</span>
            </div>

            <div class="review-rating">
              <span class="stars">
                <span *ngFor="let star of [1,2,3,4,5]" [class.filled]="star <= review.rating">★</span>
              </span>
              <span class="rating-value">{{review.rating}}/5</span>
            </div>

            <p class="review-comment">{{review.comment}}</p>

            <div class="review-images" *ngIf="review.images?.length">
              <img *ngFor="let img of review.images" [src]="img" alt="Review image">
            </div>

            <div class="review-meta">
              <span class="review-date">{{formatDate(review.createdAt)}}</span>
              <span class="review-email">{{review.user.email}}</span>
            </div>

            <div class="review-actions" *ngIf="review.status === 'pending'">
              <button class="btn-approve" (click)="approveReview(review._id)">
                ✓ Approve
              </button>
              <button class="btn-reject" (click)="openRejectModal(review)">
                ✕ Reject
              </button>
            </div>

            <div class="rejection-reason" *ngIf="review.status === 'rejected' && review.rejectionReason">
              <strong>Rejection Reason:</strong> {{review.rejectionReason}}
            </div>
          </div>
        </div>
      </div>

      <!-- Reject Modal -->
      <div class="modal" *ngIf="showRejectModal" (click)="closeRejectModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>Reject Review</h2>
          <p>Please provide a reason for rejecting this review:</p>
          <textarea 
            [(ngModel)]="rejectionReason" 
            placeholder="Enter rejection reason..."
            rows="4"></textarea>
          <div class="modal-actions">
            <button class="btn-cancel" (click)="closeRejectModal()">Cancel</button>
            <button class="btn-confirm" (click)="confirmReject()">Reject Review</button>
          </div>
        </div>
      </div>

      <div *ngIf="message" class="alert" [class.success]="messageType === 'success'" [class.error]="messageType === 'error'">
        {{message}}
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .admin-header {
      margin-bottom: 2rem;
    }

    .admin-header h1 {
      margin-bottom: 1rem;
      color: #2c3e50;
    }

    .tab-nav {
      display: flex;
      gap: 1rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .tab-nav button {
      padding: 0.75rem 1.5rem;
      background: none;
      border: none;
      font-size: 1rem;
      color: #64748b;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      transition: all 0.2s;
      position: relative;
    }

    .tab-nav button:hover {
      color: #4f46e5;
    }

    .tab-nav button.active {
      color: #4f46e5;
      border-bottom-color: #4f46e5;
    }

    .badge {
      background: #ef4444;
      color: white;
      padding: 0.2rem 0.5rem;
      border-radius: 10px;
      font-size: 0.75rem;
      margin-left: 0.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      font-size: 2.5rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
    }

    .users-icon { background: #dbeafe; }
    .products-icon { background: #fce7f3; }
    .orders-icon { background: #fef3c7; }
    .revenue-icon { background: #d1fae5; }

    .stat-info h3 {
      margin: 0;
      font-size: 2rem;
      color: #2c3e50;
    }

    .stat-info p {
      margin: 0;
      color: #64748b;
    }

    .review-stats {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .review-stats h2 {
      margin-top: 0;
      margin-bottom: 1.5rem;
    }

    .review-stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .review-stat {
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
    }

    .review-stat.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .review-stat.approved {
      background: #d1fae5;
      color: #065f46;
    }

    .review-stat.rejected {
      background: #fee2e2;
      color: #991b1b;
    }

    .review-stat h3 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
    }

    .review-stat p {
      margin: 0;
      font-weight: 500;
    }

    .recent-section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .recent-users h2 {
      margin-top: 0;
    }

    .user-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .user-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 8px;
    }

    .user-item strong {
      display: block;
      color: #2c3e50;
    }

    .email {
      font-size: 0.875rem;
      color: #64748b;
    }

    .role-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .role-badge.admin {
      background: #dbeafe;
      color: #1e40af;
    }

    .role-badge.vendor {
      background: #fce7f3;
      color: #9f1239;
    }

    .role-badge.customer {
      background: #e0e7ff;
      color: #4338ca;
    }

    .review-filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .review-filters button {
      padding: 0.75rem 1.5rem;
      border: 2px solid #e2e8f0;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.95rem;
    }

    .review-filters button:hover {
      border-color: #4f46e5;
      color: #4f46e5;
    }

    .review-filters button.active {
      background: #4f46e5;
      color: white;
      border-color: #4f46e5;
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .review-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
    }

    .review-product {
      display: flex;
      gap: 1rem;
      align-items: start;
    }

    .review-product img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 8px;
    }

    .review-product h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
    }

    .review-user {
      margin: 0;
      font-size: 0.875rem;
      color: #64748b;
    }

    .verified {
      color: #16a34a;
      font-weight: 500;
    }

    .status-badge {
      padding: 0.375rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.approved {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.rejected {
      background: #fee2e2;
      color: #991b1b;
    }

    .review-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .stars {
      color: #fbbf24;
      font-size: 1.25rem;
    }

    .stars span.filled {
      color: #f59e0b;
    }

    .rating-value {
      color: #64748b;
      font-size: 0.875rem;
    }

    .review-comment {
      color: #2c3e50;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .review-images {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .review-images img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
      cursor: pointer;
    }

    .review-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #64748b;
      margin-bottom: 1rem;
    }

    .review-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-approve, .btn-reject {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-approve {
      background: #16a34a;
      color: white;
    }

    .btn-approve:hover {
      background: #15803d;
    }

    .btn-reject {
      background: #dc2626;
      color: white;
    }

    .btn-reject:hover {
      background: #b91c1c;
    }

    .rejection-reason {
      margin-top: 1rem;
      padding: 1rem;
      background: #fee2e2;
      border-radius: 8px;
      color: #991b1b;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      max-width: 500px;
      width: 90%;
    }

    .modal-content h2 {
      margin-top: 0;
    }

    .modal-content textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-family: inherit;
      resize: vertical;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    .btn-cancel, .btn-confirm {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-cancel {
      background: #e2e8f0;
      color: #2c3e50;
    }

    .btn-confirm {
      background: #dc2626;
      color: white;
    }

    .loading, .no-reviews {
      text-align: center;
      padding: 3rem;
      color: #64748b;
    }

    .alert {
      position: fixed;
      top: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1001;
      animation: slideIn 0.3s ease;
    }

    .alert.success {
      background: #d1fae5;
      color: #065f46;
    }

    .alert.error {
      background: #fee2e2;
      color: #991b1b;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'overview';
  reviewFilter: string = 'pending';
  stats: any = null;
  reviews: Review[] = [];
  recentUsers: any[] = [];
  loading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  showRejectModal: boolean = false;
  selectedReview: Review | null = null;
  rejectionReason: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.data.stats;
          this.recentUsers = response.data.recentUsers;
        }
      },
      error: (error) => {
        this.showMessage('Failed to load dashboard stats', 'error');
      }
    });
  }

  loadPendingReviews(): void {
    this.reviewFilter = 'pending';
    this.loadReviews('pending');
  }

  filterReviews(filter: string): void {
    this.reviewFilter = filter;
    const status = filter === 'all' ? undefined : filter;
    this.loadReviews(status);
  }

  loadReviews(status?: string): void {
    this.loading = true;
    this.adminService.getAllReviews(status).subscribe({
      next: (response) => {
        if (response.success) {
          this.reviews = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        this.showMessage('Failed to load reviews', 'error');
        this.loading = false;
      }
    });
  }

  approveReview(reviewId: string): void {
    this.adminService.approveReview(reviewId).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage('Review approved successfully', 'success');
          this.loadReviews(this.reviewFilter === 'all' ? undefined : this.reviewFilter);
          this.loadDashboardStats();
        }
      },
      error: (error) => {
        this.showMessage('Failed to approve review', 'error');
      }
    });
  }

  openRejectModal(review: Review): void {
    this.selectedReview = review;
    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.selectedReview = null;
    this.rejectionReason = '';
  }

  confirmReject(): void {
    if (!this.selectedReview || !this.rejectionReason.trim()) {
      this.showMessage('Please provide a rejection reason', 'error');
      return;
    }

    this.adminService.rejectReview(this.selectedReview._id, this.rejectionReason).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage('Review rejected successfully', 'success');
          this.closeRejectModal();
          this.loadReviews(this.reviewFilter === 'all' ? undefined : this.reviewFilter);
          this.loadDashboardStats();
        }
      },
      error: (error) => {
        this.showMessage('Failed to reject review', 'error');
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}
