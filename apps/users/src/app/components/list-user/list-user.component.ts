import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IUser, IUserRole, IUserTable } from '@nx-dashboard/core/api-types';
import {
  TableComponent,
  TableConfig,
  TableAction,
  DialogConfirmComponent,
  TableSelectAction,
} from '@nx-dashboard/ui';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { catchError, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent],
  templateUrl: './list-user.component.html',
})
export class ListUserComponent implements OnInit {
  @ViewChild(TableComponent) table!: TableComponent;

  users: IUser[] = [];
  isLoading = false;
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;

  tableConfig: TableConfig<IUser> = {
    columns: [
      {
        key: 'no',
        header: '#',
        cell: (item: IUser) => item.position?.toString() || '-',
      },
      {
        key: 'username',
        header: 'Username',
        cell: (item: IUser) => item.username,
        clickable: true,
        onClick: (item: IUser) => this.onViewUser(item._id),
      },
      {
        key: 'email',
        header: 'Email',
        cell: (item: IUser) => item.email,
      },
      {
        key: 'fullName',
        header: 'Full Name',
        cell: (item: IUser) => item.fullName || '-',
      },
      {
        key: 'role',
        header: 'Role',
        cell: (item: IUser) => item.role,
      },
    ],
    showActions: true,
    showPagination: true,
    selectable: true,
    selectActions: [
      {
        label: 'Delete Selected',
        icon: 'delete',
        color: 'error',
        onClick: (items: IUser[]) => this.onDeleteUsers(items)
      }
    ]
  };

  tableActions: TableAction[] = [
    {
      label: 'Edit',
      icon: 'edit',
      onClick: (item: IUser) => this.onViewUser(item._id),
    },
    {
      label: 'Delete',
      icon: 'delete',
      color: 'error',
      onClick: (item: IUser) => this.onDeleteUser(item._id),
    },
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page: number = this.currentPage + 1): void {
    this.isLoading = true;
    this.userService.getUsers(page, this.pageSize).subscribe({
      next: (data: IUserTable) => {
        this.users = data.data;
        this.totalItems = data.total;
        this.currentPage = page - 1;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.isLoading = false;
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.loadUsers(event.pageIndex + 1);
  }

  onAddUser(): void {
    this.router.navigate(['add'], { relativeTo: this.activatedRoute });
  }

  onViewUser(id?: string): void {
    if (id) {
      this.router.navigate([id], { relativeTo: this.activatedRoute });
    }
  }

  onDeleteUser(id?: string): void {
    if (!id) return;

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        message: 'Bạn có chắc chắn muốn xóa người dùng này?',
        labelButton: 'Xóa',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.deleteUser(id);
      }
    });
  }

  onDeleteUsers(users: IUser[]): void {
    if (!users.length) return;

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        message: `Bạn có chắc chắn muốn xóa ${users.length} người dùng đã chọn?`,
        labelButton: 'Xóa',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.deleteUsers(users.map(user => user._id));
      }
    });
  }

  private deleteUser(id: string): void {
    this.userService
      .deleteUser(id)
      .pipe(
        tap(() => {
          this.toastr.success('Xóa người dùng thành công!');
          this.table.resetSelection();
        }),
        switchMap(() => {
          return this.userService.getUsers(this.currentPage + 1, this.pageSize);
        }),
        catchError((err) => {
          this.toastr.error('Lỗi khi xóa người dùng!', err.message);
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.users = data.data;
          this.totalItems = data.total;
        }
      });
  }

  private deleteUsers(ids: string[]): void {
    this.userService
      .deleteUsers(ids)
      .pipe(
        tap(() => {
          this.toastr.success('Xóa người dùng thành công!');
          this.table.resetSelection();
        }),
        switchMap(() => {
          return this.userService.getUsers(this.currentPage + 1, this.pageSize);
        }),
        catchError((err) => {
          this.toastr.error('Lỗi khi xóa người dùng!', err.message);
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.users = data.data;
          this.totalItems = data.total;
        }
      });
  }
}
