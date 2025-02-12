import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@nx-dashboard/auth/data-access';
import { catchError, switchMap, throwError } from 'rxjs';

const PUBLIC_URLS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh'
];

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  let retried = false;

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Skip token refresh for public endpoints
      if (PUBLIC_URLS.some(url => req.url.includes(url))) {
        return throwError(() => error);
      }

      // Handle 401 errors for protected endpoints
      if (error.status === 401 && !retried) {
        retried = true;

        return authService.refreshToken().pipe(
          switchMap((success) => {
            if (success) {
              // Get new token and retry original request
              const accessToken = localStorage.getItem('accessToken');
              if (!accessToken) {
                return throwError(() => new Error('No access token after refresh'));
              }

              // Clone original request with new token
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });
              return next(newReq);
            }

            // If refresh failed, propagate original error
            return throwError(() => error);
          })
        );
      }

      // For other errors, just propagate
      return throwError(() => error);
    })
  );
};
