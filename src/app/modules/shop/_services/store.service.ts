import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../public/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private baseUrl = `${environment.BASE_URL}`;


  constructor(private http: HttpClient) { }

  logPendingPayment(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}Payments/log-pending`, payload);
  }

  updatePaymentStatus(transactionReference: string, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}Payments/update-status/${transactionReference}`, payload);
  }

  checkout(orderPayload: any): Observable<any> {
    // This method will be called from the checkout page to send the order details
    // and initiate the payment process.
    return this.http.post(`${this.baseUrl}Order`, orderPayload);
  }
}