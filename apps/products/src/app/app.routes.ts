import { Route } from '@angular/router';
import { ListProductComponent } from './components/list-product/list-product.component';
import { ProductFormComponent } from './components/product-form/product-form.component';

export const productsRoutes: Route[] = [
  {
    path: '',
    component: ListProductComponent,
  },
  {
    path: 'add',
    component: ProductFormComponent,
  },
  {
    path: ':productId',
    component: ProductFormComponent,
  },
];
