import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_URL } from '../lib';
import { SessionService } from '@nx-dashboard/auth/data-access';
import { PUBLIC_URLS } from '../constants/url';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = inject(API_URL);
  const sessionService = inject(SessionService);

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

  const session = sessionService.getSession();
  if (session?.accessToken) {
    newRequest = newRequest.clone({
      setHeaders: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
  }

  return next(newRequest);
};
