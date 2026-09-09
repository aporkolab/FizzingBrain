import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { jwtInterceptor } from './jwt.interceptor';

describe('jwtInterceptor', () => {
  let client: HttpClient;
  let http: HttpTestingController;
  const accessToken = new BehaviorSubject<string | null>('test-token');

  beforeEach(() => {
    accessToken.next('test-token');
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { access_token$: accessToken } },
      ],
    });
    client = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('adds the bearer token when the user is authenticated', () => {
    client.get('/data').subscribe();
    const request = http.expectOne('/data');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');
    request.flush({});
  });

  it('does not add the header without a token', () => {
    accessToken.next(null);
    client.get('/data').subscribe();
    const request = http.expectOne('/data');
    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({});
  });
});
