import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
// import { StorageService } from '@nx-dashboard/auth/data-access';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    MatSidenavModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  @ViewChild('drawer') drawer!: MatSidenav;

  // get isLoggedIn(): boolean {
  //   const session = this.storageService.getSession();
  //   return !!session?.user;
  // }

  constructor(
    private breakpointObserver: BreakpointObserver,
    // private storageService: StorageService
  ) {
    // Tự động đóng sidebar khi màn hình nhỏ
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      if (result.matches && this.drawer?.opened) {
        this.drawer.close();
      }
    });
  }

  // Tự động đóng sidebar khi chuyển route trên màn hình nhỏ
  onRouteChange() {
    if (this.breakpointObserver.isMatched([Breakpoints.XSmall, Breakpoints.Small])) {
      this.drawer?.close();
    }
  }
}
