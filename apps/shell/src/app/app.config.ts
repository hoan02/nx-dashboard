import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environments/environment.development';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  API_URL,
  errorInterceptor,
  httpInterceptor,
} from '@nx-dashboard/core/http-client';

const toastrConfig = {
  timeOut: 3000,
  positionClass: 'toast-top-right',
  preventDuplicates: false,
  closeButton: true,
  progressBar: true,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([httpInterceptor, errorInterceptor])),
    provideToastr(toastrConfig),
    { provide: API_URL, useValue: environment.api_url },
  ],
};
