import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../public/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = `${environment.BASE_URL}Portfolio`;
  private uploadUrl = `${environment.BASE_URL}Upload/image`; // Assuming a generic image upload endpoint

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<any> {
        const headers = new HttpHeaders().set('Skip-Alert', 'true');
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post('https://server.bennyhosea.com/api/Upload/image', formData,  { headers });
  }

  addPortfolio(portfolioData: any[]): Observable<any> {
    return this.http.post(this.apiUrl, portfolioData);
  }

  getPortfolioItems(pageNumber: number, pageSize: number, searchTerm?: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?PageNumber=${pageNumber}&PageSize=${pageSize}&searchTerm=${searchTerm}`);
  }

  deletePortfolioItem(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getPortfolioItem(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  getAllCategories(): Observable<any> {
    return this.http.get<any>(`${environment.BASE_URL}Categories`);
  }

  updatePortfolioItem(id: string, portfolioData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, portfolioData);
  }
}
