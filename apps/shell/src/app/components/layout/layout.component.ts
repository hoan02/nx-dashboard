import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '@nx-dashboard/auth/data-access';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, HeaderComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  private authService = inject(AuthService);

  constructor() {
    this.authService.tokenExpired$.subscribe((res: boolean) => {
      if (res) {
        this.authService.refreshToken();
      }
    });
  }
}
