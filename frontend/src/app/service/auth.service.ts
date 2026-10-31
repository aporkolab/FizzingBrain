import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';

export interface IAuthModel {
  success: boolean;
  accessToken: string;
  user: User;
}

export interface ILoginData {
  email: string;
  password: string;
}

export const SESSION_KEY = 'login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly apiUrl: string = environment.apiUrl;
  readonly loginUrl: string = `${this.apiUrl}/login`;
  readonly user$ = new BehaviorSubject<User | null>(null);
  readonly access_token$ = new BehaviorSubject<string>('');

  constructor() {
    const session = this.readSession();
    if (session) {
      this.access_token$.next(session.accessToken);
      this.user$.next(session.user);
    }
  }

  login(loginData: ILoginData): void {
    this.http
      .post<IAuthModel>(this.loginUrl, loginData)
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.access_token$.next(response.accessToken);
            this.user$.next(response.user);
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(response));
            this.router.navigate(['/']);
          } else {
            this.handleLoginError('Login failed: Invalid credentials.');
          }
        },
        error: (err: Error) => this.handleLoginError('Login failed: ' + err.message),
      });
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    this.access_token$.next('');
    this.user$.next(null);
  }

  handleLoginError(message: string): void {
    console.error(message);
    alert(message);
    this.router.navigate(['/', 'login']);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Hiba: ${error.error.message}`;
    } else {
      const backendMessage = error.error?.message ?? error.error?.error?.[0]?.msg;
      errorMessage = `${error.status}: ${backendMessage || error.statusText}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  /** A corrupted or foreign session entry must not break the application start. */
  private readSession(): IAuthModel | null {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }
    try {
      const session = JSON.parse(raw) as Partial<IAuthModel>;
      if (typeof session.accessToken === 'string' && session.user) {
        return session as IAuthModel;
      }
    } catch {
      // fall through to the cleanup below
    }
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}
