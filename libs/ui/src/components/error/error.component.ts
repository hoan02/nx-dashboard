import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorService, ErrorState } from '@nx-dashboard/core/http-client';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
})
export class ErrorComponent implements OnInit {
  error: ErrorState | null = null;

  constructor(private errorService: ErrorService, private router: Router) {}

  ngOnInit() {
    this.errorService.errorState$.subscribe((error: ErrorState | null) => {
      this.error = error;
    });
  }

  goBack() {
    this.errorService.clearError();
    this.router.navigate(['/']);
  }
}
