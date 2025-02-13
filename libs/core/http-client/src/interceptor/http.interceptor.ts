import { HttpInterceptorFn } from '@angular/common/http';

const PUBLIC_URLS = ['/auth/login', '/auth/register', '/auth/refresh'];

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  // Clone request với withCredentials: true
  let newRequest = req.clone({ withCredentials: true });

  // Skip adding token for public endpoints
  if (PUBLIC_URLS.some((url) => req.url.includes(url))) {
    return next(newRequest);
  }

  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    newRequest = newRequest.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(newRequest);
};
