import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { ICategory } from '@nx-dashboard/core/api-types';

@Component({
  selector: 'app-category-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
})
export class CategoryFormComponent implements OnInit {
  categoryForm!: FormGroup;
  categoryId = '';
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private categoryService: CategoryService,
    private location: Location
  ) {}
  // private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this.categoryId = id;
          this.isEditMode = true;
          this.loadCategory(id);
        }
      },
      error: (err) => {
        console.error('Error reading route params:', err);
      },
    });
  }

  private initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      description: ['', [Validators.maxLength(200)]],
    });
  }

  loadCategory(id: string): void {
    this.categoryService.getCategoryById(id).subscribe({
      next: (category) => {
        this.categoryForm.patchValue(category);
      },
      error: (err) => {
        console.error('Error loading category:', err);
      },
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.categoryForm.disable();
    this.isSubmitting = true;
    const categoryData: ICategory = this.categoryForm.value;

    if (this.isEditMode) {
      this.categoryService
        .updateCategory(this.categoryId, categoryData)
        .pipe(
          finalize(() => {
            this.categoryForm.enable();
            this.isSubmitting = false;
          })
        )
        .subscribe({
          next: () => {
            this.toastr.success('Category updated successfully!');
            this.goBack();
          },
          error: (err) => {
            console.log('Error updating category: ' + err.message);
            this.toastr.error('Error updating category!');
          },
        });
    } else {
      this.categoryService
        .createCategory(categoryData)
        .pipe(
          finalize(() => {
            this.categoryForm.enable();
            this.isSubmitting = false;
          })
        )
        .subscribe({
          next: () => {
            this.toastr.success('Category created successfully!');
            this.goBack();
          },
          error: (err) => {
            console.error('Error creating category:', err.message);
            this.toastr.error('Error creating category!');
          },
        });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
