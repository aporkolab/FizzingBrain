import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { jwtInterceptor } from './jwt.interceptor';

describe('jwtInterceptor', () => {
  let client: HttpClient;
  let http: HttpTestingController;
  const accessToken = new BehaviorSubject<string | null>('test-token');
  const logout = vi.fn();

  beforeEach(() => {
    accessToken.next('test-token');
    logout.mockReset();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: { access_token$: accessToken, logout } },
      ],
    });
    client = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('adds the bearer token when the user is authenticated', () => {
    client.get('/data').subscribe();
    const request = http.expectOne('/data');
    expect(request.request.headers.get('Authorization')).toBe(
      'Bearer test-token',
    );
    request.flush({});
  });

  it('does not add the header without a token', () => {
    accessToken.next(null);
    client.get('/data').subscribe();
    const request = http.expectOne('/data');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });

  it('logs out and redirects to the login page when the token is rejected', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    let status = 0;
    client.get('/data').subscribe({ error: (err) => (status = err.status) });
    http.expectOne('/data').flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(status).toBe(401);
    expect(logout).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/', 'login']);
  });

  it('keeps the session on other errors', () => {
    client.get('/data').subscribe({ error: () => undefined });
    http.expectOne('/data').flush({}, { status: 500, statusText: 'Server Error' });
    expect(logout).not.toHaveBeenCalled();
  });
});
