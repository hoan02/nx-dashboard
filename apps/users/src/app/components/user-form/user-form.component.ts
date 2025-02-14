import { AuthService } from '@nx-dashboard/auth/data-access';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { IUser, IUserRole } from '@nx-dashboard/core/api-types';
import { UserService } from '../../services/user.service';
import { UserValidators } from '@nx-dashboard/auth/data-access';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  userId = '';
  userRoles = Object.values(IUserRole);
  originalUsername = '';
  originalEmail = '';
  isEditMode = false;
  private destroy$ = new Subject<void>();

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
    this.initRouteParams();
    this.setupFormValidation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      username: [
        '',
        {
          validators: [Validators.required, Validators.minLength(6)],
          asyncValidators: [],
          updateOn: 'blur',
        },
      ],
      fullName: [''],
      email: [
        '',
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: [],
          updateOn: 'blur',
        },
      ],
      role: [IUserRole.USER, [Validators.required]],
      profilePicture: [''],
      status: ['active'],
      phone: ['', [Validators.pattern(/^\+?[0-9\s]*$/)]],
    });
  }

  private initRouteParams(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this.userId = id;
          this.isEditMode = true;
          this.loadUser(id);
        }
      },
      error: (err) => {
        console.error('Lỗi khi đọc tham số route:', err);
        this.toastr.error('Không thể tải thông tin người dùng');
      },
    });
  }

  private setupFormValidation(): void {
    // Username validation
    this.userForm
      .get('username')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const usernameControl = this.userForm.get('username');
        if (!usernameControl) return;

        if (this.isEditMode && value === this.originalUsername) {
          usernameControl.setAsyncValidators(null);
        } else {
          usernameControl.setAsyncValidators(
            UserValidators.usernameExists(this.authService)
          );
        }
        usernameControl.updateValueAndValidity({ emitEvent: false });
      });

    // Email validation
    this.userForm
      .get('email')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const emailControl = this.userForm.get('email');
        if (!emailControl) return;

        if (this.isEditMode && value === this.originalEmail) {
          emailControl.setAsyncValidators(null);
        } else {
          emailControl.setAsyncValidators(
            UserValidators.emailExists(this.authService)
          );
        }
        emailControl.updateValueAndValidity({ emitEvent: false });
      });
  }

  private loadUser(id: string): void {
    this.userService
      .getUserById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.originalUsername = user.username;
          this.originalEmail = user.email;
          this.userForm.patchValue(user);
        },
        error: (err) => {
          console.error('Lỗi khi tải thông tin người dùng:', err);
          this.toastr.error('Không thể tải thông tin người dùng');
          this.router.navigate(['/users']);
        },
      });
  }

  onSubmit(): void {
    if (this.userForm.invalid || this.userForm.pending) {
      this.userForm.markAllAsTouched();
      return;
    }

    const userData: IUser = this.userForm.value;
    const operation = this.isEditMode
      ? this.userService.updateUser(this.userId, userData)
      : this.userService.createUser(userData);

    operation.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        const message = this.isEditMode
          ? 'Cập nhật người dùng thành công!'
          : 'Tạo người dùng thành công!';
        this.toastr.success(message);
        this.router.navigate(['/users']);
      },
      error: (err) => {
        console.error('Lỗi khi lưu thông tin người dùng:', err);
        const message = this.isEditMode
          ? 'Lỗi khi cập nhật người dùng'
          : 'Lỗi khi tạo người dùng';
        this.toastr.error(message);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
