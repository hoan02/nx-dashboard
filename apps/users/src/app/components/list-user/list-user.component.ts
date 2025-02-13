import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { UserService } from '../../services/user.service';
import { catchError, map, of, startWith, switchMap, tap } from 'rxjs';
import { IUser, IUserRole, IUserTable } from '@nx-dashboard/core/api-types';
import { DialogConfirmComponent } from '@nx-dashboard/ui';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  templateUrl: './list-user.component.html',
})
export class ListUserComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'position',
    'username',
    'email',
    'fullName',
    'role',
    'actions',
  ];
  roles: string[] = Object.values(IUserRole);
  usersTable!: IUserTable;
  totalData!: number;
  usersData!: IUser[];

  dataSource = new MatTableDataSource<IUser>([]);
  selectedRole = '';
  isLoading = false;

  pageSizeOptions = [5, 10, 25, 50];

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

    this.paginator.page
      .pipe(
        startWith({}),
        tap(() => setTimeout(() => (this.isLoading = true))),
        switchMap(() =>
          this.userService
            .getUsers(this.paginator.pageIndex + 1, this.paginator.pageSize)
            .pipe(catchError(() => of(null)))
        ),
        tap(() => setTimeout(() => (this.isLoading = false))),
        map((data) => {
          if (data == null) return [];
          this.totalData = data.total;
          return data.data;
        })
      )
      .subscribe((data) => {
        this.usersData = data;
        this.dataSource = new MatTableDataSource(this.usersData);
      });
  }

  applyFilter(): void {
    this.dataSource.filter = this.selectedRole.trim().toLowerCase();
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
        message: 'Are you sure you want to delete this user?',
        labelButton: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.deleteUser(id);
      }
    });
  }

  private deleteUser(id: string): void {
    this.userService
      .deleteUser(id)
      .pipe(
        tap(() => this.toastr.success('User deleted successfully!')),
        switchMap(() => {
          return this.userService.getUsers(
            this.paginator.pageIndex + 1,
            this.paginator.pageSize
          );
        }),
        catchError((err) => {
          this.toastr.error('Error deleting user!', err.message);
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.totalData = data.total;
          this.dataSource.data = data.data;
        }
      });
  }
}
