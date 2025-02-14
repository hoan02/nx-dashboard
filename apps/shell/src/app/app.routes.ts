import { Route } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from '@nx-dashboard/auth/data-access';
import { ErrorComponent } from '@nx-dashboard/ui';

export const appRoutes: Route[] = [
  {
    path: 'users',
    loadChildren: () => import('users/Routes').then((m) => m!.usersRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('categories/Routes').then((m) => m!.categoriesRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'products',
    loadChildren: () =>
      import('products/Routes').then((m) => m!.productsRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'lifecycle-hooks',
    loadChildren: () =>
      import('lifecycleHooks/Routes').then((m) => m!.lifecycleHooksRoutes),
  },
  {
    path: 'auth',
    loadChildren: () => import('auth/Routes').then((m) => m!.authRoutes),
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
];
