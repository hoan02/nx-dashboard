import { Component, Input, Output, EventEmitter, OnInit, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableAction, TableConfig } from './table.interface';

@Component({
  selector: 'lib-table',
  templateUrl: './table.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
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

  protected readonly Math = Math;

  ngOnInit() {
    if (!this.config) {
      throw new Error('TableConfig is required');
    }
  }

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
