import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService, SessionService } from '@nx-dashboard/auth/data-access';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly sessionService = inject(SessionService);

  user$ = this.sessionService.profile$;

  isLoggedIn(): boolean {
    return !!this.sessionService.getSession();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
