import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@nx-dashboard/auth/data-access';
import { InputErrorsComponent, ListErrorsComponent } from '@nx-dashboard/ui';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'lib-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, InputErrorsComponent, ListErrorsComponent],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  authService = inject(AuthService);
  errors: string[] = [];

  form = this.fb.nonNullable.group({
    email: ['', [
      Validators.required,
      Validators.email,
      // Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(6),
      // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$')
    ]],
  });

  onSubmit() {
    if (this.form.valid) {
      this.errors = [];
      this.authService.login(this.form.getRawValue()).subscribe({
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.errors = ['Email hoặc mật khẩu không chính xác'];
          } else if (error.error?.message) {
            this.errors = [error.error.message];
          } else {
            this.errors = ['Đã có lỗi xảy ra khi đăng nhập'];
          }
        }
      });
    }
  }
}
