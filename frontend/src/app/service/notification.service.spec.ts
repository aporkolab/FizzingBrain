import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { provideTestDefaults } from 'src/testing/test-providers';
import { NotificationService } from './notification.service';
import { ToastService } from './toast.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let toast: Record<'success' | 'error' | 'info' | 'warning', ReturnType<typeof vi.fn>>;

  beforeEach(() => {
    toast = { success: vi.fn(), error: vi.fn(), info: vi.fn(), warning: vi.fn() };
    TestBed.configureTestingModule({
      providers: [provideTestDefaults(), { provide: ToastService, useValue: toast }],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', { GREETING: 'Hello', TITLE: 'FizzingBrain' });
    translate.use('en');
    service = TestBed.inject(NotificationService);
  });

  it('translates message and title before showing the toast', () => {
    service.showSuccess('GREETING', 'TITLE');
    expect(toast.success).toHaveBeenCalledWith('Hello', 'FizzingBrain');
  });

  it('shows untranslatable text as it is', () => {
    service.showError('The correct answer is: 42', 'TITLE');
    expect(toast.error).toHaveBeenCalledWith('The correct answer is: 42', 'FizzingBrain');
  });

  it('routes every level to the matching toast', () => {
    service.showInfo('GREETING', 'TITLE');
    service.showWarning('GREETING', 'TITLE');
    expect(toast.info).toHaveBeenCalledTimes(1);
    expect(toast.warning).toHaveBeenCalledTimes(1);
  });
});
