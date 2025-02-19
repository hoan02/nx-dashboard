import { Component, EventEmitter, Input, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StorageService } from '@nx-dashboard/auth/data-access';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatToolbarModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Output() menuItemClick = new EventEmitter<void>();
  private storageService = inject(StorageService);
  profile$ = this.storageService.profile$;
  menuItems = [
    {
      icon: 'dashboard',
      label: 'Trang chủ',
      route: '/',
      exact: true,
    },
    {
      icon: 'people',
      label: 'Người dùng',
      route: '/users',
      adminOnly: true,
    },
    {
      icon: 'inventory_2',
      label: 'Sản phẩm',
      route: '/products',
    },
    {
      icon: 'category',
      label: 'Danh mục',
      route: '/categories',
    },
    {
      icon: 'category',
      label: 'Lifecycle hooks',
      route: '/lifecycle-hooks',
    },
  ];
}
