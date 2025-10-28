import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, forkJoin } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartItemsSubject = new BehaviorSubject<number>(0);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    // Don't load cart on initialization - let it be loaded when user logs in
    // Initialize cart count from guest storage so the UI shows correct badge for guests
    const guestCount = this.getGuestCart().reduce((s, it) => s + it.quantity, 0);
    this.cartItemsSubject.next(guestCount);
  }

  loadCartCount(): void {
    // Check if user has token before loading cart
    const user = localStorage.getItem('currentUser');
    if (!user) {
      this.cartItemsSubject.next(0);
      return;
    }

    // If there is a guest cart, merge it into the user's server cart first
    const guest = this.getGuestCart();
    if (guest.length > 0) {
      const requests = guest.map(g => this.http.post<any>(this.apiUrl, { productId: g.productId, quantity: g.quantity }).pipe(catchError(() => of(null))));
      forkJoin(requests).subscribe({
        next: () => {
          // clear guest cart after merging
          this.setGuestCart([]);
          // now fetch server cart
          this.getCart().subscribe({
            next: (response) => {
              if (response.success && response.data) {
                const count = response.data.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
                this.cartItemsSubject.next(count);
              }
            },
            error: () => this.cartItemsSubject.next(0)
          });
        },
        error: () => {
          // even if merge fails, attempt to load server cart
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
      });
      return;
    }

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
    const user = localStorage.getItem('currentUser');
    if (!user) {
      // Build a guest cart response from localStorage
      const guest = this.getGuestCart();
      const items = guest.map(g => ({ product: { _id: g.productId }, quantity: g.quantity }));
      return of({ success: true, data: { items } });
    }

    return this.http.get<any>(this.apiUrl).pipe(
      catchError(() => of({ success: false, data: { items: [] } }))
    );
  }

  addToCart(productId: string, quantity: number = 1): Observable<any> {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      // Guest flow - store in localStorage
      const guest = this.getGuestCart();
      const idx = guest.findIndex(i => i.productId === productId);
      if (idx > -1) {
        guest[idx].quantity += quantity;
      } else {
        guest.push({ productId, quantity });
      }
      this.setGuestCart(guest);
      // update subject
      const count = guest.reduce((s, it) => s + it.quantity, 0);
      this.cartItemsSubject.next(count);
      return of({ success: true, data: { items: guest } });
    }

    return this.http.post<any>(this.apiUrl, { productId, quantity })
      .pipe(tap(() => this.loadCartCount()));
  }

  updateCartItem(productId: string, quantity: number): Observable<any> {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      const guest = this.getGuestCart();
      const idx = guest.findIndex(i => i.productId === productId);
      if (idx > -1) {
        guest[idx].quantity = quantity;
        this.setGuestCart(guest);
      }
      const count = guest.reduce((s, it) => s + it.quantity, 0);
      this.cartItemsSubject.next(count);
      return of({ success: true, data: { items: guest } });
    }

    return this.http.put<any>(`${this.apiUrl}/${productId}`, { quantity })
      .pipe(tap(() => this.loadCartCount()));
  }

  removeFromCart(productId: string): Observable<any> {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      let guest = this.getGuestCart();
      guest = guest.filter(i => i.productId !== productId);
      this.setGuestCart(guest);
      const count = guest.reduce((s, it) => s + it.quantity, 0);
      this.cartItemsSubject.next(count);
      return of({ success: true, data: { items: guest } });
    }

    return this.http.delete<any>(`${this.apiUrl}/${productId}`)
      .pipe(tap(() => this.loadCartCount()));
  }

  clearCart(): Observable<any> {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      this.setGuestCart([]);
      this.cartItemsSubject.next(0);
      return of({ success: true, message: 'Cart cleared' });
    }

    return this.http.delete<any>(this.apiUrl)
      .pipe(tap(() => this.cartItemsSubject.next(0)));
  }

  // Guest cart helpers
  private getGuestCart(): Array<{ productId: string; quantity: number }> {
    try {
      const raw = localStorage.getItem('guestCart');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  private setGuestCart(cart: Array<{ productId: string; quantity: number }>): void {
    try {
      localStorage.setItem('guestCart', JSON.stringify(cart));
    } catch (e) {
      // ignore
    }
  }
}
