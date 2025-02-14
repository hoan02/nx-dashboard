import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, StorageService } from '@nx-dashboard/auth/data-access';
import { IUser } from '@nx-dashboard/core/api-types';
import { ISession } from '@nx-dashboard/auth/data-access';

@Component({
  selector: 'lib-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private readonly storageService = inject(StorageService);
  private readonly authService = inject(AuthService);

  user?: IUser;
  sessions: ISession[] = [];
  isLoading = true;
  error?: string;

  ngOnInit() {
    this.storageService.profile$.subscribe({
      next: (user) => {
        this.user = user;
        this.loadSessions();
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.error = 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.';
        this.isLoading = false;
      }
    });
  }

  loadUserProfile() {
    const session = this.storageService.getSession();
    if (session?.user) {
      this.user = session.user;
      this.loadSessions();
    } else {
      this.error = 'Không tìm thấy thông tin người dùng';
      this.isLoading = false;
    }
  }

  loadSessions() {
    this.authService.getSessions().subscribe({
      next: (sessions) => {
        this.sessions = sessions;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading sessions:', error);
        this.error = 'Không thể tải thông tin phiên đăng nhập';
        this.isLoading = false;
      }
    });
  }
}
