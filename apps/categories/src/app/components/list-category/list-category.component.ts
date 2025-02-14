import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ICategory } from '@nx-dashboard/core/api-types';
import { TableComponent, TableConfig, TableAction, DialogConfirmComponent } from '@nx-dashboard/ui';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-list-category',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './list-category.component.html',
})
export class ListCategoryComponent implements OnInit {
  categories: ICategory[] = [];
  isLoading = false;
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;

  tableConfig: TableConfig<ICategory> = {
    columns: [
      {
        key: 'name',
        header: 'Name',
        cell: (item: ICategory) => item.name || 'No description',
        clickable: true,
        onClick: (item: ICategory) => this.onViewCategory(item._id),
      },
      {
        key: 'description',
        header: 'Description',
        cell: (item: ICategory) => item.description || 'No description',
      },
    ],
    showActions: true,
    showPagination: true,
  };

  tableActions: TableAction[] = [
    {
      label: 'Edit',
      icon: 'edit',
      // color: 'primary',
      onClick: (item: ICategory) => this.onViewCategory(item._id),
    },
    {
      label: 'Delete',
      icon: 'delete',
      // color: 'error',
      onClick: (item: ICategory) => this.onDeleteCategory(item._id),
    },
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(page: number = this.currentPage + 1): void {
    this.isLoading = true;
    this.categoryService.getCategories(page, this.pageSize).subscribe({
      next: (data) => {
        this.categories = data.data;
        this.totalItems = data.total;
        this.currentPage = page - 1;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.isLoading = false;
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.loadCategories(event.pageIndex + 1);
  }

  onAddCategory(): void {
    this.router.navigate(['add'], { relativeTo: this.activatedRoute });
  }

  onViewCategory(id?: string): void {
    if (id) {
      this.router.navigate([id], { relativeTo: this.activatedRoute });
    }
  }

  onDeleteCategory(id?: string): void {
    if (!id) return;

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        message: 'Are you sure you want to delete this category?',
        labelButton: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.deleteCategory(id);
      }
    });
  }

  private deleteCategory(id: string): void {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.toastr.success('Category deleted successfully!');
        this.loadCategories();
      },
      error: (err) => {
        this.toastr.error('Error deleting category!', err.message);
      },
    });
  }
}
