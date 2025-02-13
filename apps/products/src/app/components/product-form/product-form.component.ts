import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { ICategory, IProduct } from '@nx-dashboard/core/api-types';
import { CategoryService } from 'categories/CategoryService';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  productId = '';
  categories: ICategory[] = [];
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this.productId = id;
          this.isEditMode = true;
          this.loadProduct(id);
        }
      },
      error: (err) => {
        console.error('Error parsing route parameters', err);
      },
    });

    this.loadCategories();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255),
        ],
      ],
      description: ['', [Validators.maxLength(1000)]],
      image: ['', [Validators.required, Validators.pattern('https?://.+')]],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryId: this.fb.group({
        _id: ['', Validators.required],
        name: [''],
      }),
    });
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
      },
      error: (err) => {
        console.error('Error fetching product details', err);
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (err: any) => {
        console.error('Error loading categories', err);
      },
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.productForm.disable();
    this.isSubmitting = true;
    const productData: IProduct = this.productForm.value;

    if (this.isEditMode) {
      this.productService
        .updateProduct(this.productId, productData)
        .pipe(
          finalize(() => {
            this.productForm.enable();
            this.isSubmitting = false;
          })
        )
        .subscribe({
          next: () => {
            this.toastr.success('Product updated successfully!');
            this.router.navigate(['/products']);
          },
          error: (err) => {
            console.error('Error updating product', err.message);
            this.toastr.error('Failed to update product!');
          },
        });
    } else {
      this.productService
        .createProduct(productData)
        .pipe(
          finalize(() => {
            this.productForm.enable();
            this.isSubmitting = false;
          })
        )
        .subscribe({
          next: () => {
            this.toastr.success('Product created successfully!');
            this.router.navigate(['/products']);
          },
          error: (err) => {
            console.error('Error creating product', err.message);
            this.toastr.error('Failed to create product!');
          },
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
