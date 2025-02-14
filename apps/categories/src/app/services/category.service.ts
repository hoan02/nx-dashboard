import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ICategory } from '@nx-dashboard/core/api-types';

export interface ICategoryTable {
  data: ICategory[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = environment.API_URL + 'categories';

  constructor(private http: HttpClient) {}

  getCategories(pageNumber = 1, pageSize = 10): Observable<ICategoryTable> {
    const params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('limit', pageSize.toString());
    return this.http.get<ICategoryTable>(this.apiUrl, { params });
  }

  getCategoryById(id: string): Observable<ICategory> {
    return this.http.get<ICategory>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: ICategory): Observable<ICategory> {
    return this.http.post<ICategory>(this.apiUrl, category);
  }

  updateCategory(id: string, category: ICategory): Observable<ICategory> {
    return this.http.put<ICategory>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
