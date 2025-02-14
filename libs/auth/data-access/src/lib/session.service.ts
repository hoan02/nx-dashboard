import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';

export interface DeviceInfo {
  deviceType: string;
  deviceModel: string;
  deviceVendor: string;
  osName: string;
  osVersion: string;
  browserName: string;
  browserVersion: string;
  ip: string;
}

export interface ISession {
  userId: string;
  token: string;
  expiresAt: string;
  deviceInfo: DeviceInfo;
  ipAddress: string;
  isValid: boolean;
  lastUsedAt: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  isCurrentSession?: boolean;
}

export interface SessionResponse {
  message: string;
  result: boolean;
  data: {
    sessions: ISession[];
  };
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

  // getCurrentUser(): Observable<any> {
  //   const session = this.storageService.getSession();
  //   if (!session?.user) {
  //     return throwError(() => new Error('Không tìm thấy thông tin người dùng'));
  //   }
  //   return this.http.get('/auth/me').pipe(
  //     tap((res: any) => {
  //       if (res.data?.user) {
  //         this.storageService.setSession({
  //           ...session,
  //           user: res.data.user
  //         });
  //       }
  //     })
  //   );
  // }

  getActiveSessions(): Observable<ISession[]> {
    return this.http.get<SessionResponse>('/sessions').pipe(
      map((res) => {
        if (res.result && res.data?.sessions) {
          return res.data.sessions.map((session) => ({
            ...session,
            isCurrentSession: this.isCurrentSession(session)
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

  private isCurrentSession(session: ISession): boolean {
    const currentSession = this.storageService.getSession();
    return session.token === currentSession?.accessToken;
  }
}
