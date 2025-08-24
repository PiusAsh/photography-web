import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../public/environment/environment';
import { PortfolioItem } from '../models/portfolio-item.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = `${environment.BASE_URL}Portfolio`;

  constructor(private http: HttpClient) { }

  getPortfolioItems(pageNumber: number, pageSize: number, searchTerm: string = ''): Observable<{ status: boolean, data: { items: PortfolioItem[], pageNumber: number, pageSize: number, totalPages: number, totalCount: number }, errorMessage: string }> {
    let url = `${this.apiUrl}?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    if (searchTerm) {
      url += `&SearchTerm=${searchTerm}`;
    }
    return this.http.get<{ status: boolean, data: { items: PortfolioItem[], pageNumber: number, pageSize: number, totalPages: number, totalCount: number }, errorMessage: string }>(url);
  }
}
