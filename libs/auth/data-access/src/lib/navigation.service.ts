import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly router = inject(Router);

  // Lưu URL trước khi chuyển đến trang login
  saveReturnUrl(url: string): void {
    if (url && !url.includes('/auth/')) {
      localStorage.setItem('returnUrl', url);
    }
  }

  // Điều hướng về trang trước đó hoặc trang chủ
  navigateToSavedUrl(): void {
    const returnUrl = localStorage.getItem('returnUrl') || '/';
    localStorage.removeItem('returnUrl');
    this.router.navigate([returnUrl]);
  }

  // Điều hướng về trang chủ
  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  // Điều hướng đến trang login
  navigateToLogin(): void {
    const currentUrl = this.router.url;
    this.saveReturnUrl(currentUrl);
    this.router.navigate(['/auth/login']);
  }
}
