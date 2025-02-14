import { AuthService } from '@nx-dashboard/auth/data-access';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IUser, IUserRole } from '@nx-dashboard/core/api-types';
import { UserService } from '../../services/user.service';
import { UserValidators } from '@nx-dashboard/auth/data-access';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  userId = '';
  userRoles = Object.values(IUserRole);
  originalUsername = '';
  originalEmail = '';
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this.userId = id;
          this.isEditMode = true;
          this.loadUser(id);
        }
      },
      error: (err) => {
        console.error('Error reading route params:', err);
      },
    });

    // Subscribe to value changes
    this.userForm.get('username')?.valueChanges.subscribe((value) => {
      if (this.isEditMode && value === this.originalUsername) {
        this.userForm.get('username')?.clearAsyncValidators();
      } else {
        this.userForm
          .get('username')
          ?.setAsyncValidators(UserValidators.usernameExists(this.authService));
      }
      this.userForm
        .get('username')
        ?.updateValueAndValidity({ emitEvent: false });
    });

    this.userForm.get('email')?.valueChanges.subscribe((value) => {
      if (this.isEditMode && value === this.originalEmail) {
        this.userForm.get('email')?.clearAsyncValidators();
      } else {
        this.userForm
          .get('email')
          ?.setAsyncValidators(UserValidators.emailExists(this.authService));
      }
      this.userForm.get('email')?.updateValueAndValidity({ emitEvent: false });
    });
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.minLength(6)],
        UserValidators.usernameExists(this.authService),
      ],
      // password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: [''],
      email: [
        '',
        [Validators.required, Validators.email],
        UserValidators.emailExists(this.authService),
      ],
      role: [IUserRole.USER, [Validators.required]],
      profilePicture: [''],
      status: ['active'],
      phoneNumber: ['', [Validators.pattern(/^\+?[0-9\s]*$/)]],
    });
  }

  loadUser(id: string): void {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.originalUsername = user.username;
        this.originalEmail = user.email;
        this.userForm.patchValue(user);
      },
      error: (err) => {
        console.error('Error loading user:', err);
      },
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.userForm.disable();
    this.isSubmitting = true;
    const userData: IUser = this.userForm.value;

    if (this.isEditMode) {
      this.userService
        .updateUser(this.userId, userData)
        .pipe(
          finalize(() => {
            this.userForm.enable();
            this.isSubmitting = false;
          })
        )
        .subscribe({
          next: () => {
            console.log('ok');

            this.toastr.success('User updated successfully!');
            this.router.navigate(['/users']);
          },
          error: (err) => {
            console.log('Error updating user: ' + err.message);
            this.toastr.error('Error updating user!');
          },
        });
    } else {
      this.userService
        .createUser(userData)
        .pipe(
          finalize(() => {
            this.userForm.enable();
            this.isSubmitting = false;
          })
        )
        .subscribe({
          next: () => {
            this.toastr.success('User created successfully!');
            this.router.navigate(['/users']);
          },
          error: (err) => {
            console.error('Error creating user:', err.message);
            this.toastr.error('Error creating user!');
          },
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
