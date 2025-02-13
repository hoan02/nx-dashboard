import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface ErrorState {
  code: number;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorState = new BehaviorSubject<ErrorState | null>(null);
  errorState$ = this.errorState.asObservable();

  constructor(private router: Router) {}

  handleError(error: any) {
    let errorState: ErrorState;

    if (error?.status === 404) {
      errorState = {
        code: 404,
        message: 'Không tìm thấy trang yêu cầu',
      };
    } else if (error?.status === 403) {
      errorState = {
        code: 403,
        message: 'Bạn không có quyền truy cập trang này',
      };
    } else if (error?.status === 500) {
      errorState = {
        code: 500,
        message: 'Đã có lỗi xảy ra từ phía server',
      };
    } else if (!error?.status) {
      errorState = {
        code: 0,
        message:
          'Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.',
      };
    } else {
      errorState = {
        code: 500,
        message: 'Đã có lỗi xảy ra',
      };
    }

    this.errorState.next(errorState);
    this.router.navigate(['/error']);
  }

  clearError() {
    this.errorState.next(null);
  }
}
