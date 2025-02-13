import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-input-errors',
  templateUrl: './input-errors.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class InputErrorsComponent {
  @Input() control!: AbstractControl | FormControl | null;

  get errorMessages(): string[] {
    if (!this.control || !this.control.errors || !this.control.touched) {
      return [];
    }

    const errors = this.control.errors;
    const messages: string[] = [];

    if (errors['required']) {
      messages.push('Trường này là bắt buộc');
    }
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      messages.push(`Tối thiểu ${requiredLength} ký tự`);
    }
    if (errors['email'] || (errors['pattern'] && this.control.hasValidator(Validators.email))) {
      messages.push('Email không hợp lệ');
    } else if (errors['pattern']) {
      messages.push('Giá trị không hợp lệ');
    }
    if (errors['passwordStrength']) {
      messages.push('Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt');
    }
    if (errors['usernameExists']) {
      messages.push('Tên người dùng đã tồn tại');
    }
    if (errors['emailExists']) {
      messages.push('Email đã tồn tại');
    }

    return messages;
  }
}
