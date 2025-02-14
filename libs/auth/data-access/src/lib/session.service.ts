import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';

export interface ISession {
  id: string;
  userId: string;
  userAgent: string;
  ip: string;
  isValid: boolean;
  isCurrentSession: boolean;
  lastActivity: Date;
  lastUsedAt: Date;
  expiresAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly http = inject(HttpClient);
  private readonly storageService = inject(StorageService);

  refreshToken(): Observable<any> {
    return this.http.get(`/auth/refresh`).pipe(
      tap((res: any) => {
        if (res.data) {
          const session = this.storageService.getSession();
          this.storageService.setSession({
            ...session,
            accessToken: res.data.accessToken,
          });
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.log('Refresh token failed: ' + error);
        return throwError(() => error);
      })
    );
  }

  checkUsername(username: string): Observable<boolean> {
    const params = new HttpParams().set('username', username);
    return this.http
      .get<any>(`/auth/check-username`, {
        params,
      })
      .pipe(
        map((res) => {
          return res?.data?.exists || false;
        }),
        catchError((error) => {
          console.error('Check username error:', error);
          return throwError(() => error);
        })
      );
  }

  checkEmail(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    return this.http
      .get<any>(`/auth/check-email`, {
        params,
      })
      .pipe(
        map((res) => {
          return res?.data?.exists || false;
        }),
        catchError((error) => {
          console.error('Check email error:', error);
          return throwError(() => error);
        })
      );
  }

  getCurrentUser(): Observable<any> {
    const session = this.storageService.getSession();
    if (!session?.user) {
      return throwError(() => new Error('Không tìm thấy thông tin người dùng'));
    }
    return this.http.get('/auth/me').pipe(
      tap((res: any) => {
        if (res.data?.user) {
          this.storageService.setSession({
            ...session,
            user: res.data.user
          });
        }
      })
    );
  }

  getActiveSessions(): Observable<ISession[]> {
    return this.http.get<any>('/sessions').pipe(
      map((res) => {
        if (res.result && res.data?.sessions) {
          // Xử lý và chuyển đổi dữ liệu từ backend
          return res.data.sessions.map((session: any) => ({
            ...session,
            lastActivity: session.lastUsedAt, // Map lastUsedAt từ BE thành lastActivity cho FE
            isCurrentSession: this.isCurrentSession(session) // Xác định phiên hiện tại
          }));
        }
        return [];
      }),
      catchError((error) => {
        console.error('Get active sessions error:', error);
        return throwError(() => error);
      })
    );
  }

  private isCurrentSession(session: any): boolean {
    const currentSession = this.storageService.getSession();
    // So sánh thông tin để xác định phiên hiện tại
    // Có thể dựa vào refreshToken hoặc các thông tin khác
    return session.userId === currentSession?.user?._id;
  }
}
