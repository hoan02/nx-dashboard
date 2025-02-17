export interface TableColumn<T> {
  key: string;
  header: string;
  cell?: (item: T) => string;
  template?: boolean;
  sortable?: boolean;
  width?: string;
  onClick?: (item: T) => void;
  clickable?: boolean;
}

export interface TableConfig<T> {
  columns: TableColumn<T>[];
  showPagination?: boolean;
  pageSizeOptions?: number[];
  showActions?: boolean;
  selectable?: boolean; // Flag để enable tính năng select rows
  selectActions?: TableSelectAction[]; // Các action cho selected rows
}

export interface TableAction {
  label: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  onClick: (item: any) => void;
}

export interface TableSelectAction {
  label: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  onClick: (selectedItems: any[]) => void;
}

export interface TablePaginationEvent {
  pageIndex: number;
  pageSize: number;
}
