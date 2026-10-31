import { provideTestDefaults } from 'src/testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsEditorComponent } from './questions-editor.component';

describe('QuestionsEditorComponent', () => {
  let component: QuestionsEditorComponent;
  let fixture: ComponentFixture<QuestionsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionsEditorComponent],
      providers: provideTestDefaults()
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
