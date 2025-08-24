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
}
