import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService, StorageService } from '@nx-dashboard/auth/data-access';
import { catchError, switchMap, throwError } from 'rxjs';
import { ErrorService } from '../lib/error.service';
import { PUBLIC_URLS } from '../constants/url';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const storageService = inject(StorageService);
  const errorService = inject(ErrorService);
  let retried = false;

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (PUBLIC_URLS.some((url) => req.url.includes(url))) {
        return throwError(() => error);
      }

      // For 401 errors, try refresh token without error handling
      if (error.status === 401 && !retried) {
        retried = true;

        return authService.refreshToken().pipe(
          switchMap((success) => {
            if (success) {
              // Get new token from session and retry original request
              const session = storageService.getSession();
              if (!session?.accessToken) {
                const noTokenError = new Error('No access token after refresh');
                errorService.handleError(noTokenError);
                return throwError(() => noTokenError);
              }

              // Clone original request with new token and handle any errors from retry
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${session.accessToken}`,
                },
              });
              return next(newReq).pipe(
                catchError((retryError) => {
                  errorService.handleError(retryError);
                  return throwError(() => retryError);
                })
              );
            }

            // If refresh failed, just propagate error without handling
            return throwError(() => error);
          })
        );
      }

      // Handle non-401 errors with ErrorService
      if (error.status !== 401) {
        errorService.handleError(error);
      }
      return throwError(() => error);
    })
  );
};
