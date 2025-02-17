import { Routes } from '@angular/router';
import { ListCategoryComponent } from './components/list-category/list-category.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';

export const categoriesRoutes: Routes = [
  {
    path: '',
    component: ListCategoryComponent,
  },
  {
    path: 'add',
    component: CategoryFormComponent,
  },
  {
    path: ':categoryId',
    component: CategoryFormComponent,
  },
];
