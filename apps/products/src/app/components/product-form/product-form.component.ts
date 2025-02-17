import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  @Input() productId = '';

  productForm!: FormGroup;
  categories: ICategory[] = [];
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.initForm();
    if (this.productId != '') {
      this.isEditMode = true;
      this.loadProduct(this.productId);
    }
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
      category: this.fb.group({
        _id: ['', Validators.required],
        name: [''],
      }),
    });
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        console.log('data', product);
      },
      error: (err) => {
        console.error('Error fetching product details', err);
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data.data;
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
            this.goBack();
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
            this.goBack();
          },
          error: (err) => {
            console.error('Error creating product', err.message);
            this.toastr.error('Failed to create product!');
          },
        });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
