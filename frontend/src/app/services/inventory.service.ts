import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/inventory`;

  constructor(private http: HttpClient) {}

  getMyInventory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-inventory`);
  }

  getBrowseProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/browse`);
  }

  sourceProduct(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/source`, data);
  }

  updateInventory(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteInventory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getInventoryAnalytics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/analytics`);
  }
}
