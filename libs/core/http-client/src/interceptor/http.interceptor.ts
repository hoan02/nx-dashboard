import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_URL } from '../lib';

const PUBLIC_URLS = ['/auth/login', '/auth/register', '/auth/refresh'];

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = inject(API_URL);
  let fullUrl = req.url;
  if (!req.url.startsWith('http')) {
    fullUrl = `${apiUrl}${req.url}`;
  }
  let newRequest = req.clone({
    url: fullUrl,
    withCredentials: true,
  });

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
