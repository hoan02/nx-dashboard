import { AbstractControl } from '@angular/forms';
import { debounceTime, map, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from './user.service';

export class UserValidators {
  static usernameExists(userService: UserService) {
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null);
      }

      return of(control.value).pipe(
        debounceTime(500),
        switchMap((username) => userService.checkUsername(username)),
        take(1),
        map((exists) => (exists ? { usernameExists: true } : null))
      );
    };
  }

  static emailExists(userService: UserService) {
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null);
      }

      return of(control.value).pipe(
        debounceTime(500),
        switchMap((email) => userService.checkEmail(email)),
        take(1),
        map((exists) => (exists ? { emailExists: true } : null))
      );
    };
  }
}
