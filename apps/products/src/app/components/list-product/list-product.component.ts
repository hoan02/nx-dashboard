import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '@nx-dashboard/core/api-types';
import { TableComponent, TableConfig, TableAction, DialogConfirmComponent } from '@nx-dashboard/ui';
import { ProductService } from '../../services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent],
  templateUrl: './list-product.component.html',
})
export class ListProductComponent implements OnInit {
  products: IProduct[] = [];
  isLoading = false;
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;

  tableConfig: TableConfig<IProduct> = {
    columns: [
      {
        key: 'name',
        header: 'Name',
        cell: (item: IProduct) => item.name,
        clickable: true,
        onClick: (item: IProduct) => this.onViewProduct(item._id),
      },
      {
        key: 'description',
        header: 'Description',
        cell: (item: IProduct) => item.description || '-',
      },
      {
        key: 'price',
        header: 'Price',
        cell: (item: IProduct) => `$${item.price.toFixed(2)}`,
      },
      {
        key: 'category',
        header: 'Category',
        cell: (item: IProduct) => item.category?.name || '-',
      },
    ],
    showActions: true,
    showPagination: true,
  };

  tableActions: TableAction[] = [
    {
      label: 'Edit',
      icon: 'edit',
      onClick: (item: IProduct) => this.onViewProduct(item._id),
    },
    {
      label: 'Delete',
      icon: 'delete',
      onClick: (item: IProduct) => this.onDeleteProduct(item._id),
    },
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private productService: ProductService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(page: number = this.currentPage + 1): void {
    this.isLoading = true;
    this.productService.getProducts(page, this.pageSize).subscribe({
      next: (data) => {
        this.products = data.data;
        this.totalItems = data.total;
        this.currentPage = page - 1;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.isLoading = false;
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.loadProducts(event.pageIndex + 1);
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
    if (!id) return;

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        message: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
        labelButton: 'Xóa',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.deleteProduct(id);
      }
    });
  }

  private deleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.toastr.success('Xóa sản phẩm thành công!');
        this.loadProducts();
      },
      error: (err) => {
        this.toastr.error('Lỗi khi xóa sản phẩm!', err.message);
      },
    });
  }
}
