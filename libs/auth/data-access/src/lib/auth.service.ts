import { StorageService } from './storage.service';
import { SessionService } from './session.service';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  private readonly storageService = inject(StorageService);
  private readonly sessionService = inject(SessionService);

  login(value: LoginUser): Observable<any> {
    return this.http.post(`/auth/login`, value, { withCredentials: true }).pipe(
      tap((res: any) => {
        if (res.data) {
          this.storageService.setSession({
            user: res.data.user,
            accessToken: res.data.accessToken,
          });
          this.navigationService.navigateToSavedUrl();
        }
      })
    );
  }

  register(value: LoginUser): Observable<any> {
    return this.http.post(`/auth/register`, value).pipe(
      tap((res: any) => {
        if (res.data) {
          this.storageService.setSession({
            user: res.data.user,
            accessToken: res.data.accessToken,
          });
          this.navigationService.navigateToHome();
        }
      })
    );
  }

  logout(): void {
    console.log('logout');
    // Call API to clear server-side cookie
    this.http.post(`/auth/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.clearUserData();
        this.navigationService.navigateToLogin();
      },
      error: (error) => {
        console.error('Logout failed:', error);
        this.clearUserData();
        this.navigationService.navigateToLogin();
      },
    });
  }

  private clearUserData(): void {
    // Clear session
    this.storageService.clearSession();

    // Clear refreshToken cookie
    document.cookie =
      'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost; secure; samesite=strict;';
  }

  refreshToken(): Observable<any> {
    return this.sessionService.refreshToken().pipe(
      catchError((error) => {
        console.log('Refresh token failed: ' + error);
        this.navigationService.navigateToLogin();
        return throwError(() => error);
      })
    );
  }

  checkUsername(username: string): Observable<boolean> {
    return this.sessionService.checkUsername(username).pipe(
      catchError((error) => {
        console.error('Check username error:', error);
        return of(false);
      })
    );
  }

  checkEmail(email: string): Observable<boolean> {
    return this.sessionService.checkEmail(email).pipe(
      catchError((error) => {
        console.error('Check email error:', error);
        return of(false);
      })
    );
  }

  getCurrentUser(): Observable<any> {
    return this.sessionService.getCurrentUser().pipe(
      catchError((error) => {
        console.error('Get current user error:', error);
        return throwError(() => error);
      })
    );
  }

  getSessions(): Observable<any> {
    return this.sessionService.getActiveSessions().pipe(
      catchError((error) => {
        console.error('Get sessions error:', error);
        return throwError(() => error);
      })
    );
  }
}
