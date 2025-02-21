import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, StorageService } from '@nx-dashboard/auth/data-access';
import { IUser } from '@nx-dashboard/core/api-types';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeToggleButtonComponent } from '@nx-dashboard/ui';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    ThemeToggleButtonComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  get isLoggedIn(): boolean {
    const session = this.storageService.getSession();
    return !!session?.user;
  }

  get currentUser(): IUser | null {
    const session = this.storageService.getSession();
    return session?.user || null;
  }

  constructor(
    protected authService: AuthService,
    private storageService: StorageService
  ) {}

  onToggleSidebar() {
    if (this.isLoggedIn) {
      this.toggleSidebar.emit();
    }
  }
}
