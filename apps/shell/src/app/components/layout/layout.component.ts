import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StorageService } from '@nx-dashboard/auth/data-access';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, interval } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    MatSidenavModule,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  @ViewChild('drawer') drawer!: MatSidenav;
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  private authSubject!: BehaviorSubject<boolean>;
  isLoggedIn$!: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private storageService: StorageService
  ) {
    this.authSubject = new BehaviorSubject<boolean>(
      !!this.storageService.getSession()?.user
    );
    this.isLoggedIn$ = this.authSubject.asObservable();

    // Check session status periodically
    interval(500).subscribe(() => {
      const isLoggedIn = !!this.storageService.getSession()?.user;
      if (this.authSubject.value !== isLoggedIn) {
        this.authSubject.next(isLoggedIn);
      }
    });

    // Tự động thu gọn sidebar khi màn hình nhỏ
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((result) => {
        if (result.matches) {
          this.isCollapsed = true;
        }
      });

    // Mở drawer mặc định
    setTimeout(() => {
      this.drawer?.open();
    });
  }

  // Chỉ thu gọn sidebar khi chuyển route trên màn hình nhỏ
  onRouteChange() {
    if (
      this.breakpointObserver.isMatched([Breakpoints.XSmall, Breakpoints.Small])
    ) {
      this.isCollapsed = true;
    }
  }
}
