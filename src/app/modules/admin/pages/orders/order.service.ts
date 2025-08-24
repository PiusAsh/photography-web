import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../public/environment/environment';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.BASE_URL}Order`;

  constructor(private http: HttpClient) { }

  getOrders(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?PageNumber=${pageNumber}&PageSize=${pageSize}`);
  }

  getCustomers(pageNumber: number, pageSize: number, searchTerm?: string): Observable<any> {
    let url = `${this.apiUrl}/customers?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    if (searchTerm) {
      url += `&searchTerm=${searchTerm}`;
    }
    return this.http.get<any>(url);
  }

  updateOrderStatus(orderId: string, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${orderId}/status`, payload);
  }
}
