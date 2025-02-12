import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@nx-dashboard/auth/data-access';
import { catchError, throwError } from 'rxjs';

export const errrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const isContinue = confirm('Are you sure want to continue');
        if (isContinue) {
          authService.tokenExpired$.next(true);
        }
      }
      return throwError(() => error);
    })
  );
};
