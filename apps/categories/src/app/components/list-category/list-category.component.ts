import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ICategory } from '@nx-dashboard/core/api-types';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-list-category',
  imports: [CommonModule],
  templateUrl: './list-category.component.html',
})
export class ListCategoryComponent implements OnInit {
  categories: ICategory[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Error loading categories', err),
    });
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
    if (id && confirm('Are you sure you want to delete this category?')) {
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
}
