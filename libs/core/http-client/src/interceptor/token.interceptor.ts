import { HttpInterceptorFn } from '@angular/common/http';

const PUBLIC_URLS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh'
];

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip adding token for public endpoints
  if (PUBLIC_URLS.some(url => req.url.includes(url))) {
    return next(req);
  }

  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    const newRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return next(newRequest);
  }
  return next(req);
};
