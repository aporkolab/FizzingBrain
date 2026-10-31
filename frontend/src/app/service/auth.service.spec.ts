import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { provideTestDefaults } from 'src/testing/test-providers';
import { AuthService, IAuthModel, SESSION_KEY } from './auth.service';

describe('AuthService', () => {
  const session: IAuthModel = {
    success: true,
    accessToken: 'token-123',
    user: { id: 1, email: 'admin@example.com', firstName: 'Ada', lastName: 'Admin', password: '' },
  };

  const create = () => {
    TestBed.configureTestingModule({ providers: provideTestDefaults() });
    return TestBed.inject(AuthService);
  };

  beforeEach(() => sessionStorage.clear());
  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('starts logged out without a stored session', () => {
    const service = create();
    expect(service.user$.getValue()).toBeNull();
    expect(service.access_token$.getValue()).toBe('');
  });

  it('restores a stored session without navigating away', () => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    const navigate = vi.spyOn(Router.prototype, 'navigate');
    const service = create();
    expect(service.user$.getValue()?.email).toBe('admin@example.com');
    expect(service.access_token$.getValue()).toBe('token-123');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('discards a corrupted session entry', () => {
    sessionStorage.setItem(SESSION_KEY, '{not json');
    const service = create();
    expect(service.user$.getValue()).toBeNull();
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it('stores the session and goes home after a successful login', () => {
    const service = create();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const http = TestBed.inject(HttpTestingController);

    service.login({ email: 'admin@example.com', password: 'secret' });
    const request = http.expectOne(`${environment.apiUrl}/login`);
    expect(request.request.method).toBe('POST');
    request.flush(session);

    expect(service.access_token$.getValue()).toBe('token-123');
    expect(JSON.parse(sessionStorage.getItem(SESSION_KEY)!).accessToken).toBe('token-123');
    expect(navigate).toHaveBeenCalledWith(['/']);
    http.verify();
  });

  it('reports a rejected login and stays logged out', () => {
    const service = create();
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const http = TestBed.inject(HttpTestingController);

    service.login({ email: 'admin@example.com', password: 'wrong' });
    http
      .expectOne(`${environment.apiUrl}/login`)
      .flush({ error: [{ msg: 'Invalid credentials' }] }, { status: 401, statusText: 'Unauthorized' });

    expect(service.user$.getValue()).toBeNull();
    expect(alert).toHaveBeenCalledWith('Login failed: 401: Invalid credentials');
  });

  it('clears the session on logout', () => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    const service = create();
    service.logout();
    expect(service.user$.getValue()).toBeNull();
    expect(service.access_token$.getValue()).toBe('');
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
  });
});
