export interface TableColumn<T> {
  key: string;
  header: string;
  cell?: (item: T) => string;
  template?: boolean;
  sortable?: boolean;
  width?: string;
  onClick?: (item: T) => void; // Thêm onClick handler
  clickable?: boolean; // Flag để đánh dấu cell có thể click
}

export interface TableConfig<T> {
  columns: TableColumn<T>[];
  showPagination?: boolean;
  pageSizeOptions?: number[];
  showActions?: boolean;
}

export interface TableAction {
  label: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  onClick: (item: any) => void;
}

export interface TablePaginationEvent {
  pageIndex: number;
  pageSize: number;
}
