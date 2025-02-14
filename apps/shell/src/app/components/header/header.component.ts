import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService, StorageService } from '@nx-dashboard/auth/data-access';
import { CommonModule } from '@angular/common';
import { IUserRole } from '@nx-dashboard/core/api-types';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly storageService = inject(StorageService);

  user$ = this.storageService.profile$;

  isLoggedIn(): boolean {
    return !!this.storageService.getSession();
  }

  isAdmin(): boolean {
    const session = this.storageService.getSession();
    return session?.user?.role === IUserRole.ADMIN;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
