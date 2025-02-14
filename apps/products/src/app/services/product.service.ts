import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { IProduct } from '@nx-dashboard/core/api-types';

export interface IProductTable {
  data: IProduct[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.API_URL + 'products';

  constructor(private http: HttpClient) {}

  getProducts(pageNumber = 1, pageSize = 10): Observable<IProductTable> {
    const params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('limit', pageSize.toString());
    return this.http.get<IProductTable>(this.apiUrl, { params });
  }

  getProductById(id: string): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(this.apiUrl, product);
  }

  updateProduct(id: string, product: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
