import { TestBed } from '@angular/core/testing';

import { BaseService } from './base.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfigService } from './config.service';

type Entity = { id: number; name: string };

describe('BaseService', () => {
  let service: BaseService<Entity>;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfigService, useValue: {} },
      ],
    });
    service = TestBed.inject(BaseService<Entity>);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loads all entities from the configured endpoint', () => {
    service.entity = 'questions';
    service.getAll().subscribe((items) => expect(items).toEqual([{ id: 1, name: 'one' }]));
    const request = http.expectOne(`${service.apiUrl}/questions`);
    expect(request.request.method).toBe('GET');
    request.flush([{ id: 1, name: 'one' }]);
  });
});
