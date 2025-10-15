import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart';
  private cartItemsSubject = new BehaviorSubject<number>(0);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartCount();
  }

  loadCartCount(): void {
    this.getCart().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const count = response.data.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
          this.cartItemsSubject.next(count);
        }
      },
      error: () => this.cartItemsSubject.next(0)
    });
  }

  getCart(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addToCart(productId: string, quantity: number = 1): Observable<any> {
    return this.http.post<any>(this.apiUrl, { productId, quantity })
      .pipe(tap(() => this.loadCartCount()));
  }

  updateCartItem(productId: string, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${productId}`, { quantity })
      .pipe(tap(() => this.loadCartCount()));
  }

  removeFromCart(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${productId}`)
      .pipe(tap(() => this.loadCartCount()));
  }

  clearCart(): Observable<any> {
    return this.http.delete<any>(this.apiUrl)
      .pipe(tap(() => this.cartItemsSubject.next(0)));
  }
}
