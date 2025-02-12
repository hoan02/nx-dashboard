import { SessionService } from './session.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LoginUser } from '@nx-dashboard/core/api-types';
import {
  Observable,
  Subject,
  tap,
  of,
  catchError,
  map,
  throwError,
} from 'rxjs';
import { NavigationService } from './navigation.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly navigationService = inject(NavigationService);
  private readonly sessionService = inject(SessionService);
  private readonly apiUrl = 'http://localhost:8888';

  login(value: LoginUser): void {
    this.http.post(`${this.apiUrl}/auth/login`, value).subscribe({
      next: (res: any) => {
        if (res.data) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          this.navigationService.navigateToSavedUrl();
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  register(value: LoginUser): void {
    this.http.post(`${this.apiUrl}/auth/register`, value).subscribe({
      next: (res: any) => {
        if (res.data) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          this.navigationService.navigateToHome();
        }
      },
      error: (error) => {
        console.error('Registration failed:', error);
      },
    });
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.navigationService.navigateToLogin();
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');

    return this.http.post(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap((res: any) => {
        if (res.data) {
          localStorage.setItem('accessToken', res.data.accessToken);
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.log('Refresh token failed: ' + error);
        this.navigationService.navigateToLogin();
        return throwError(error);
      })
    );
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`).pipe(
      tap((res: any) => {
        const session = this.sessionService.getSession();
        this.sessionService.setSession({
          ...session,
          user: res.data.user,
        });
      })
    );
  }

  getSessions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/sessions`);
  }
}
