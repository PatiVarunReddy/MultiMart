import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:5000/api/orders';

  constructor(private http: HttpClient) { }

  addToCart(product: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, product);
  }

  getCart(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cart`);
  }

  placeOrder(order: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/checkout`, order);
  }
}
