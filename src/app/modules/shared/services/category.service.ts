import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = '/api/Categories';

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<{ status: boolean, data: Category[], errorMessage: string }> {
    return this.http.get<{ status: boolean, data: Category[], errorMessage: string }>(this.apiUrl);
  }
}
