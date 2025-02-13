import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser, IUserTable } from '@nx-dashboard/core/api-types';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private prefixUrl = '/users';
  private readonly http = inject(HttpClient);

  getUsers(pageNumber: number, pageSize: number): Observable<IUserTable> {
    const params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('limit', pageSize.toString());
    return this.http.get<IUserTable>(this.prefixUrl, { params });
  }

  getUserById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.prefixUrl}/${id}`);
  }

  createUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.prefixUrl, user);
  }

  updateUser(id: string, user: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${this.prefixUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.prefixUrl}/${id}`);
  }

  checkUsername(username: string): Observable<boolean> {
    const params = new HttpParams().set('username', username);
    return this.http.get<boolean>(`${this.prefixUrl}/check-username`, {
      params,
    });
  }

  checkEmail(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    return this.http.get<boolean>(`${this.prefixUrl}/check-email`, { params });
  }
}
