import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LoginUser } from '@nx-dashboard/core/api-types';
import { Subject } from 'rxjs';
// import { API_URL } from '@nx-dashboard/core/http-client';

@Injectable({ providedIn: 'root' })
export class AuthService {
  http = inject(HttpClient);
  // private readonly api_url = inject(API_URL);
  private readonly api_url = 'http://localhost:8888';
  tokenExpired$: Subject<boolean> = new Subject<boolean>();
  tokenReceived$: Subject<boolean> = new Subject<boolean>();

  login(value: LoginUser): void {
    this.http.post(`${this.api_url}/auth/login`, value).subscribe((res) => {
      console.log('res', res);
    });
  }

  register(value: LoginUser): void {
    this.http.post(`${this.api_url}/auth/register`, value).subscribe((res) => {
      console.log('res', res);
    });
  }

  refreshToken(): void {
    const loggedData = localStorage.getItem('accessToken');
    if (loggedData) {
      const loggedUser = JSON.parse(loggedData);
      const obj = {
        email: loggedUser.email,
        accessToken: loggedUser.accessToken,
        refreshToken: loggedUser.refreshToken,
      };
      this.http
        .post(`${this.api_url}/auth/refresh`, obj)
        .subscribe((res: any) => {
          console.log(res);
          localStorage.setItem('user', res.data.user);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('tokenData', JSON.stringify(res.data.token));
          this.tokenReceived$.next(true);
        });
    }
  }
}
