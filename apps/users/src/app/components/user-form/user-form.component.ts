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
import { UserValidators } from '../../validators/user.validator';

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
    private userService: UserService
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
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      // password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: [''],
      email: ['', [Validators.required, Validators.email]],
      role: [IUserRole.USER, [Validators.required]],
      profilePicture: [''],
      status: ['active'],
      phoneNumber: ['', [Validators.pattern(/^\+?[0-9\s]*$/)]],
    });
  }

  loadUser(id: string): void {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue(user);
        this.originalUsername = user.username;
        this.originalEmail = user.email;

        this.userForm
          .get('username')
          ?.setAsyncValidators(
            UserValidators.usernameExists(
              this.userService,
              this.originalUsername
            )
          );

        this.userForm
          .get('email')
          ?.setAsyncValidators(
            UserValidators.emailExists(this.userService, this.originalEmail)
          );

        this.userForm.updateValueAndValidity();
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
