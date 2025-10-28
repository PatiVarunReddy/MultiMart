import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  createOrder(orderData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, orderData);
  }

  getMyOrders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/myorders`);
  }
  
  getVendorOrders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/vendor/orders`);
  }

  getOrderById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getAllOrders(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  updateOrderStatus(id: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, { status });
  }
}
