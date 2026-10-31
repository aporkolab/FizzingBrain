import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { provideTestDefaults } from 'src/testing/test-providers';
import { Question } from '../model/question';
import { QuestionService } from './question.service';

describe('QuestionService', () => {
  let service: QuestionService;
  let http: HttpTestingController;
  const base = `${environment.apiUrl}/question`;
  const sample = Object.assign(new Question(), { id: 7, englishQuestion: 'How many?', englishAnswer: '42' });

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideTestDefaults() });
    service = TestBed.inject(QuestionService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads a random pack of questions', () => {
    service.getRandomQuestions().subscribe();
    expect(http.expectOne(`${base}/rand`).request.method).toBe('GET');
  });

  it('creates a question without sending a client side id', () => {
    service.create(sample).subscribe();
    const request = http.expectOne(base);
    expect(request.request.method).toBe('POST');
    expect(request.request.body.id).toBeNull();
    expect(request.request.body.englishQuestion).toBe('How many?');
  });

  it('updates and deletes by id', () => {
    service.update(sample).subscribe();
    expect(http.expectOne(`${base}/7`).request.method).toBe('PATCH');
    service.delete(sample).subscribe();
    expect(http.expectOne(`${base}/7`).request.method).toBe('DELETE');
  });

  it('loads one question by id', () => {
    service.getOne(7).subscribe((q) => expect(q.id).toBe(7));
    http.expectOne(`${base}/7`).flush(sample);
  });
});
