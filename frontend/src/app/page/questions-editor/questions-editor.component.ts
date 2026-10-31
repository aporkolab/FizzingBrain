import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Question } from 'src/app/model/question';
import { NotificationService } from 'src/app/service/notification.service';
import { QuestionService } from 'src/app/service/question.service';

@Component({
  standalone: true,
  selector: 'app-questions-editor',
  templateUrl: './questions-editor.component.html',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, RouterModule],
})
export class QuestionsEditorComponent implements OnInit {
  question$!: Observable<Question>;
  questionForm!: FormGroup;
  entity = 'Question';
  actionText!: string;

  constructor(
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router,
    private notifyService: NotificationService,
    private translate: TranslateService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe({
      next: (param) => {
        if (param['id'] === '0') {
          this.questionForm.reset(new Question());
          this.actionText = this.translate.instant('createquestion');
        } else {
          this.question$ = this.questionService.getOne(param['id']);
          this.question$.subscribe({
            next: (question) => {
              this.questionForm.patchValue(
                question ? question : new Question(),
              );
              this.actionText = this.translate.instant('updatequestion');
            },
          });
        }
      },
    });
  }

  initForm() {
    this.questionForm = this.fb.group({
      id: [null],
      hungarianQuestion: ['', [Validators.required, Validators.minLength(3)]],
      englishQuestion: ['', [Validators.required, Validators.minLength(3)]],
      hungarianAnswer: ['', [Validators.required, Validators.minLength(2)]],
      englishAnswer: ['', [Validators.required, Validators.minLength(2)]],
      descriptionHungarian: ['', [Validators.minLength(3)]],
      descriptionEnglish: ['', [Validators.minLength(3)]],
    });
  }

  onUpdate() {
    if (this.questionForm.invalid) {
      return;
    }
    this.questionService.update(this.questionForm.value).subscribe({
      next: () => this.router.navigate(['/', 'question']),
      error: (err) => this.showError(err),
      complete: () => this.showSuccessEdit(),
    });
  }

  onCreate() {
    if (this.questionForm.invalid) {
      return;
    }
    this.questionService.create(this.questionForm.value).subscribe({
      next: () => this.router.navigate(['/', 'question']),
      error: (err) => this.showError(err),
      complete: () => this.showSuccessCreate(),
    });
  }

  showSuccessEdit() {
    this.notifyService.showSuccess(
      this.translate.instant('editquestion') +
        ' ' +
        this.translate.instant('successfully'),
      this.translate.instant('FIZZINGBRAIN.FIZZINGBRAIN_TITLE'),
    );
  }

  showSuccessCreate() {
    this.notifyService.showSuccess(
      this.translate.instant('createquestion') +
        ' ' +
        this.translate.instant('successfully'),
      this.translate.instant('FIZZINGBRAIN.FIZZINGBRAIN_TITLE'),
    );
  }

  showError(err: String) {
    this.notifyService.showError(
      this.translate.instant('somethingWentWrong') +
        ' ' +
        this.translate.instant('details') +
        ': ' +
        err,
      this.translate.instant('FIZZINGBRAIN.FIZZINGBRAIN_TITLE'),
    );
  }
}
