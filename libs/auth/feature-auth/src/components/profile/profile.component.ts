import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SessionService } from '@nx-dashboard/auth/data-access';
import { IUser } from '@nx-dashboard/core/api-types';

@Component({
  selector: 'lib-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private readonly sessionService = inject(SessionService);

  user?: IUser;
  isLoading = true;
  error?: string;

  ngOnInit() {
    this.sessionService.profile$.subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.error = 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.';
        this.isLoading = false;
      }
    });
  }

  loadUserProfile() {
    const session = this.sessionService.getSession();
    if (session?.user) {
      this.user = session.user;
      this.isLoading = false;
      this.error = undefined;
    } else {
      this.error = 'Không tìm thấy thông tin người dùng';
      this.isLoading = false;
    }
  }
}
