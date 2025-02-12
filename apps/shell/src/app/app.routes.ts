import { Route } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const appRoutes: Route[] = [
  {
    path: 'users',
    loadChildren: () => import('users/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('categories/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'products',
    loadChildren: () => import('products/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'auth',
    loadChildren: () => import('auth/Routes').then((m) => m!.authRoutes),
  },
  {
    path: '',
    component: HomeComponent,
  },
];
