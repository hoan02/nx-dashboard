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

  login(value: LoginUser): void {
    this.http
      .post(`/auth/login`, value, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          if (res.data) {
            this.sessionService.setSession({
              user: res.data.user,
              accessToken: res.data.accessToken
            });
            this.navigationService.navigateToSavedUrl();
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
        },
      });
  }

  register(value: LoginUser): void {
    this.http.post(`/auth/register`, value).subscribe({
      next: (res: any) => {
        if (res.data) {
          this.sessionService.setSession({
            user: res.data.user,
            accessToken: res.data.accessToken
          });
          this.navigationService.navigateToHome();
        }
      },
      error: (error) => {
        console.error('Registration failed:', error);
      },
    });
  }

  logout(): void {
    // Call API to clear server-side cookie
    this.http.post(`/auth/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          this.clearUserData();
          this.navigationService.navigateToLogin();
        },
        error: (error) => {
          console.error('Logout failed:', error);
          this.clearUserData();
          this.navigationService.navigateToLogin();
        }
      });
  }

  private clearUserData(): void {
    // Clear session
    this.sessionService.clearSession();

    // Clear refreshToken cookie
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost; secure; samesite=strict;';
  }

  refreshToken(): Observable<any> {
    return this.http.get(`/auth/refresh`).pipe(
      tap((res: any) => {
        if (res.data) {
          const session = this.sessionService.getSession();
          this.sessionService.setSession({
            ...session,
            accessToken: res.data.accessToken
          });
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
    return this.http.get(`/user`).pipe(
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
    return this.http.get(`/auth/sessions`);
  }
}
