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
import { User } from 'src/app/model/user';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  standalone: true,
  selector: 'app-users-editor',
  templateUrl: './users-editor.component.html',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, RouterModule],
})
export class UsersEditorComponent implements OnInit {
  user$!: Observable<User>;
  userForm!: FormGroup;
  entity = 'User';
  actionText!: string;

  constructor(
    private userService: UserService,
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
          this.userForm.reset(new User());
          this.actionText = this.translate.instant('createUser');
          this.addPasswordValidators();
        } else {
          this.user$ = this.userService.getOne(param['id']);
          this.user$.subscribe({
            next: (user) => {
              if (user) {
                // Never echo a stored password (hash) back into the form.
                this.userForm.patchValue({ ...user, password: '' });
                this.actionText = this.translate.instant('updateUser');
                this.removePasswordValidators();
              }
            },
          });
        }
      },
    });
  }

  initForm() {
    this.userForm = this.fb.group({
      id: [null],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
    });
  }

  addPasswordValidators() {
    this.userForm
      .get('password')
      ?.setValidators([
        Validators.required,
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{7,}$'),
      ]);
    this.userForm.get('password')?.updateValueAndValidity();
  }

  removePasswordValidators() {
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.userForm.valid) {
      if (this.userForm.get('id')?.value) {
        this.onUpdate();
      } else {
        this.onCreate();
      }
    } else {
    }
  }

  onUpdate() {
    this.userService.update(this.userForm.value).subscribe({
      next: () => this.router.navigate(['/', 'user']),
      error: (err) => this.showError(err),
      complete: () => this.showSuccessEdit(),
    });
  }

  onCreate() {
    this.userService.create(this.userForm.value).subscribe({
      next: () => this.router.navigate(['/', 'user']),
      error: (err) => this.showError(err),
      complete: () => this.showSuccessCreate(),
    });
  }

  showSuccessEdit() {
    this.notifyService.showSuccess(
      this.translate.instant(`${this.entity} edited successfully!`),
      this.translate.instant('FizzingBrain v.1.0.0'),
    );
  }

  showSuccessCreate() {
    this.notifyService.showSuccess(
      this.translate.instant(`${this.entity} created successfully!`),
      this.translate.instant('FizzingBrain v.1.0.0'),
    );
  }

  showError(err: string) {
    this.notifyService.showError(
      this.translate.instant('Something went wrong. Details:') + err,
      this.translate.instant('FizzingBrain v.1.0.0'),
    );
  }
}
