import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public readonly STORAGE_KEY = 'auth_session';
  private profileSubject = new BehaviorSubject<any>(null);

  profile$ = this.profileSubject.asObservable();

  constructor() {
    // Khởi tạo profile từ session storage
    const session = this.getSession();
    if (session?.user) {
      this.profileSubject.next(session.user);
    }
  }

  setSession(session: any): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    this.profileSubject.next(session.user);
  }

  getSession(): any {
    const session = localStorage.getItem(this.STORAGE_KEY);
    const parsedSession = session ? JSON.parse(session) : null;
    if (parsedSession?.user && !this.profileSubject.value) {
      this.profileSubject.next(parsedSession.user);
    }
    return parsedSession;
  }

  clearSession(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.profileSubject.next(null);
  }
}
