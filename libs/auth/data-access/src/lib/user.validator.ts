import { AbstractControl } from '@angular/forms';
import { debounceTime, map, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

export class UserValidators {
  static usernameExists(authService: AuthService) {
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null);
      }

      return of(control.value).pipe(
        debounceTime(500),
        switchMap((username) => authService.checkUsername(username)),
        take(1),
        map((exists) => (exists ? { usernameExists: true } : null))
      );
    };
  }

  static emailExists(authService: AuthService) {  
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null);
      }

      return of(control.value).pipe(
        debounceTime(500),
        switchMap((email) => authService.checkEmail(email)),
        take(1),
        map((exists) => (exists ? { emailExists: true } : null))
      );
    };
  }
}
