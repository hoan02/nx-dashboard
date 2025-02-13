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
    this.http
      .post(`${this.apiUrl}/auth/login`, value, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          if (res.data) {
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem('accessToken', res.data.accessToken);
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
          this.navigationService.navigateToHome();
        }
      },
      error: (error) => {
        console.error('Registration failed:', error);
      },
    });
  }

  logout(): void {
    // Gọi API logout để clear cookie phía server
    this.http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          // Clear localStorage
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');

          // Clear refreshToken cookie với đầy đủ các attributes
          document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost; secure; samesite=strict;';

          this.navigationService.navigateToLogin();
        },
        error: (error) => {
          console.error('Logout failed:', error);
          // Vẫn clear localStorage và cookie nếu có lỗi
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost; secure; samesite=strict;';

          this.navigationService.navigateToLogin();
        }
      });
  }

  refreshToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/refresh`).pipe(
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
