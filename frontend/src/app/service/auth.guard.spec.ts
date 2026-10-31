import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/user';
import { provideTestDefaults } from 'src/testing/test-providers';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  const user$ = new BehaviorSubject<User | null>(null);

  beforeEach(() => {
    user$.next(null);
    TestBed.configureTestingModule({
      providers: [provideTestDefaults(), { provide: AuthService, useValue: { user$ } }],
    });
  });

  const run = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  it('redirects anonymous visitors to the login page', () => {
    const result = run();
    expect(result instanceof UrlTree).toBe(true);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/login');
  });

  it('lets a logged in user through', () => {
    user$.next(Object.assign(new User(), { email: 'admin@example.com' }));
    expect(run()).toBe(true);
  });
});
