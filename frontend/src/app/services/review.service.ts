import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  product: string;
  rating: number;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewResponse {
  success: boolean;
  data: Review[] | Review;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/api/reviews`;

  constructor(private http: HttpClient) { }

  // Get reviews for a product
  getProductReviews(productId: string): Observable<ReviewResponse> {
    return this.http.get<ReviewResponse>(`${this.apiUrl}/product/${productId}`);
  }

  // Create a review with optional images
  createReview(productId: string, review: { rating: number; comment: string }, images?: File[]): Observable<ReviewResponse> {
    const formData = new FormData();
    formData.append('product', productId);
    formData.append('rating', review.rating.toString());
    formData.append('comment', review.comment);
    
    if (images) {
      images.forEach((image, index) => {
        formData.append('images', image, `review-image-${index}`);
      });
    }

    return this.http.post<ReviewResponse>(this.apiUrl, formData);
  }

  // Delete a review
  deleteReview(reviewId: string): Observable<ReviewResponse> {
    return this.http.delete<ReviewResponse>(`${this.apiUrl}/${reviewId}`);
  }

  // Mark review as helpful
  markHelpful(reviewId: string): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(`${this.apiUrl}/${reviewId}/helpful`, {});
  }
}