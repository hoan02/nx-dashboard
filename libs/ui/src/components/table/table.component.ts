import { Component, Input, Output, EventEmitter, OnInit, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TableAction, TableConfig } from './table.interface';

@Component({
  selector: 'lib-table',
  templateUrl: './table.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule
  ]
})
export class TableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() config!: TableConfig<any>;
  @Input() actions: TableAction[] = [];
  @Input() isLoading = false;
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 0;
  @Input() noDataMessage = 'Không có dữ liệu';

  @ContentChild('cellTemplate') cellTemplate!: TemplateRef<any>;

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() selectionChange = new EventEmitter<any[]>();

  protected readonly Math = Math;

  // State cho selection
  selectedItems: any[] = [];
  selectAll = false;

  ngOnInit() {
    if (!this.config) {
      throw new Error('TableConfig is required');
    }
  }

  // Xử lý selection
  onSelectAll(checked: boolean) {
    this.selectAll = checked;
    this.selectedItems = checked ? [...this.data] : [];
    this.selectionChange.emit(this.selectedItems);
  }

  onSelectItem(item: any, checked: boolean) {
    if (checked) {
      this.selectedItems.push(item);
    } else {
      const index = this.selectedItems.findIndex(i => i === item);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      }
    }

    this.selectAll = this.selectedItems.length === this.data.length;
    this.selectionChange.emit(this.selectedItems);
  }

  isSelected(item: any): boolean {
    return this.selectedItems.includes(item);
  }

  resetSelection(): void {
    this.selectedItems = [];
    this.selectAll = false;
    this.selectionChange.emit(this.selectedItems);
  }

  // Xử lý pagination
  onPageEvent(event: PageEvent) {
    this.pageChange.emit(event);
  }

  onPageChange(newPage: number) {
    const event: PageEvent = {
      pageIndex: newPage,
      pageSize: this.pageSize,
      length: this.totalItems,
    };
    this.pageChange.emit(event);
  }
}
