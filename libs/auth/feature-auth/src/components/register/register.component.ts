import { AuthService, UserValidators } from '@nx-dashboard/auth/data-access';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputErrorsComponent, ListErrorsComponent } from '@nx-dashboard/ui';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'lib-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    InputErrorsComponent,
    ListErrorsComponent,
  ],
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  errors: string[] = [];

  form = this.fb.nonNullable.group({
    username: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z0-9_-]*$'),
        ],
        asyncValidators: [UserValidators.usernameExists(this.authService)],
      },
    ],
    email: [
      '',
      {
        validators: [
          Validators.required,
          Validators.email,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
        ],
        asyncValidators: [UserValidators.emailExists(this.authService)],
      },
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        // Validators.pattern(
        //   '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'
        // ),
      ],
    ],
  });

  onSubmit() {
    if (this.form.valid) {
      this.errors = [];
      this.authService.register(this.form.getRawValue()).subscribe({
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.errors = ['Email đã được sử dụng'];
          } else if (error.error?.message) {
            this.errors = [error.error.message];
          } else {
            this.errors = ['Đã có lỗi xảy ra khi đăng ký'];
          }
        },
      });
    }
  }
}
