import { Routes } from '@angular/router';
import { ListUserComponent } from './components/list-user/list-user.component';
import { UserFormComponent } from './components/user-form/user-form.component';

export const usersRoutes: Routes = [
  {
    path: '',
    component: ListUserComponent,
  },
  {
    path: 'add',
    component: UserFormComponent,
  },
  {
    path: ':userId',
    component: UserFormComponent,
  },
];
