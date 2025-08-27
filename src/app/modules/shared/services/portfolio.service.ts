import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../public/environment/environment';
import { PortfolioItem } from '../models/portfolio-item.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = `${environment.BASE_URL}Portfolio`;
  private categoryApiUrl = `${environment.BASE_URL}Category`;

  constructor(private http: HttpClient) { }

  getPortfolioItems(pageNumber: number, pageSize: number, searchTerm: string = ''): Observable<{ status: boolean, data: { items: PortfolioItem[], pageNumber: number, pageSize: number, totalPages: number, totalCount: number }, errorMessage: string }> {
    let url = `${this.apiUrl}?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    if (searchTerm) {
      url += `&SearchTerm=${searchTerm}`;
    }
    return this.http.get<{ status: boolean, data: { items: PortfolioItem[], pageNumber: number, pageSize: number, totalPages: number, totalCount: number }, errorMessage: string }>(url);
  }

  getPortfolioItem(id: string): Observable<{ status: boolean, data: PortfolioItem, errorMessage: string }> {
    return this.http.get<{ status: boolean, data: PortfolioItem, errorMessage: string }>(`${this.apiUrl}/${id}`);
  }

  addPortfolio(items: any[]): Observable<any> {
    return this.http.post<any>(this.apiUrl, items);
  }

  updatePortfolioItem(id: string, item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, item);
  }

  uploadImage(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post(`${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getAllCategories(): Observable<{ status: boolean, data: Category[], errorMessage: string }> {
    return this.http.get<{ status: boolean, data: Category[], errorMessage: string }>(this.categoryApiUrl);
  }
}
