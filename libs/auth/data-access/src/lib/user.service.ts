import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

interface CheckResponse {
  result: boolean;
  data: {
    exists: boolean;
  };
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  checkUsername(username: string): Observable<boolean> {
    const params = new HttpParams().set('username', username);
    return this.http.get<CheckResponse>(`/auth/check-username`, {
      params,
    }).pipe(
      map(response => response.data.exists)
    );
  }

  checkEmail(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    return this.http.get<CheckResponse>(`/auth/check-email`, {
      params
    }).pipe(
      map(response => response.data.exists)
    );
  }
}
