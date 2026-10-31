import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Lets authenticated users through and sends everybody else to the login page. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.user$.getValue() ? true : inject(Router).createUrlTree(['/login']);
};
