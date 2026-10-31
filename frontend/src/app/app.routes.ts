import { Routes } from '@angular/router';
import { ContactComponent } from './page/contact/contact.component';
import { FizzingbrainComponent } from './page/fizzingbrain/fizzingbrain.component';
import { ForbiddenComponent } from './page/forbidden/forbidden.component';
import { HomeComponent } from './page/home/home.component';
import { LoginComponent } from './page/login/login.component';
import { QuestionsEditorComponent } from './page/questions-editor/questions-editor.component';
import { QuestionsComponent } from './page/questions/questions.component';
import { RulesComponent } from './page/rules/rules.component';
import { UsersEditorComponent } from './page/users-editor/users-editor.component';
import { UsersComponent } from './page/users/users.component';
import { authGuard } from './service/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'fizzingbrain', component: FizzingbrainComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'user', component: UsersComponent, canActivate: [authGuard] },
  { path: 'user/edit/:id', component: UsersEditorComponent, canActivate: [authGuard] },
  { path: 'question', component: QuestionsComponent, canActivate: [authGuard] },
  { path: 'question/edit/:id', component: QuestionsEditorComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
