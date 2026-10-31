import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const accessToken = auth.access_token$.getValue();

  if (!accessToken) {
    return next(req);
  }

  const authorized = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return next(authorized).pipe(
    catchError((error: unknown) => {
      // An expired or revoked token: drop the stale session and ask for a new login.
      if (error instanceof HttpErrorResponse && error.status === 401) {
        auth.logout();
        router.navigate(['/', 'login']);
      }
      return throwError(() => error);
    }),
  );
};
