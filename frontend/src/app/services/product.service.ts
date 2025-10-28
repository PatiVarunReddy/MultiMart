import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getProducts(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  getProduct(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createProduct(productData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, productData);
  }

  updateProduct(id: string, productData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, productData);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getMyProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-products`);
  }
}
