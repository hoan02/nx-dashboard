import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize, take } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { ICategory, IProduct } from '@nx-dashboard/core/api-types';
import { CategoryService } from 'categories/CategoryService';

@Component({
  selector: 'app-product-form',
  standalone: true,
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
    this.initForm();
    this.loadCategories();
    if (this.productId && this.productId !== 'add') {
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

  private loadProduct(id: string): void {
    this.productService
      .getProductById(id)
      .pipe(take(1))
      .subscribe({
        next: (product) => {
          this.productForm.patchValue(product);
        },
        error: (err) => {
          console.error('Lỗi khi tải thông tin sản phẩm:', err);
          this.toastr.error('Không thể tải thông tin sản phẩm');
          this.goBack();
        },
      });
  }

  private loadCategories(): void {
    this.categoryService
      .getCategories()
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          this.categories = data.data;
        },
        error: (err) => {
          console.error('Lỗi khi tải danh mục:', err);
          this.toastr.error('Không thể tải danh mục sản phẩm');
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

    const operation = this.isEditMode
      ? this.productService.updateProduct(this.productId, productData)
      : this.productService.createProduct(productData);

    operation
      .pipe(
        take(1),
        finalize(() => {
          this.productForm.enable();
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: () => {
          const message = this.isEditMode
            ? 'Cập nhật sản phẩm thành công!'
            : 'Tạo sản phẩm thành công!';
          this.toastr.success(message);
          this.goBack();
        },
        error: (err) => {
          console.error('Lỗi khi lưu thông tin sản phẩm:', err);
          const message = this.isEditMode
            ? 'Lỗi khi cập nhật sản phẩm'
            : 'Lỗi khi tạo sản phẩm';
          this.toastr.error(message);
        },
      });
  }

  goBack(): void {
    this.location.back();
  }
}
