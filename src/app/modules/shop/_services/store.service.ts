import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../public/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private baseUrl = `${environment.BASE_URL}`;


  constructor(private http: HttpClient) { }

  logPendingPayment(payload: any): Observable<any> {
    const headers = new HttpHeaders().set('Skip-Alert', 'true');
    return this.http.post(`${this.baseUrl}Payments/log-pending`, payload, { headers });
  }

  updatePaymentStatus(transactionReference: string, payload: any): Observable<any> {
    const headers = new HttpHeaders().set('Skip-Alert', 'true');
    return this.http.put(`${this.baseUrl}Payments/update-status/${transactionReference}`, payload, { headers });
  }

  checkout(orderPayload: any): Observable<any> {
    const headers = new HttpHeaders().set('Skip-Alert', 'true');
    // This method will be called from the checkout page to send the order details
    // and initiate the payment process.
    return this.http.post(`${this.baseUrl}Order`, orderPayload, { headers });
  }
}