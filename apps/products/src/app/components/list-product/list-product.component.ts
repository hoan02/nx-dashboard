import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '@nx-dashboard/core/api-types';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-list-product',
  imports: [FormsModule, CommonModule],
  templateUrl: './list-product.component.html',
})
export class ListProductComponent implements OnInit {
  products: IProduct[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log(data);
        this.products = data;
      },
      error: (err) => console.error('Error loading products', err),
    });
  }

  onAddProduct(): void {
    this.router.navigate(['add'], { relativeTo: this.activatedRoute });
  }

  onViewProduct(id?: string): void {
    if (id) {
      this.router.navigate([id], { relativeTo: this.activatedRoute });
    }
  }

  onDeleteProduct(id?: string): void {
    if (id && confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.toastr.success('Product deleted successfully!');
          this.loadProducts();
        },
        error: (err) => {
          this.toastr.error('Error deleting product!', err.message);
        },
      });
    }
  }
}
