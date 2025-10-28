import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5000/api/admin';

  constructor(private http: HttpClient) {}

  // Dashboard stats
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  // Review management
  getPendingReviews(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reviews/pending`);
  }

  getAllReviews(status?: string, page: number = 1, limit: number = 20): Observable<any> {
    let url = `${this.apiUrl}/reviews?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<any>(url);
  }

  approveReview(reviewId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/reviews/${reviewId}/approve`, {});
  }

  rejectReview(reviewId: string, reason: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/reviews/${reviewId}/reject`, { reason });
  }

  deleteReview(reviewId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/reviews/${reviewId}`);
  }
}
