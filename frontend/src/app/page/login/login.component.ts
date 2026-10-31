import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService, ILoginData } from 'src/app/service/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule, TranslatePipe],
})
export class LoginComponent implements OnInit {
  loginData: ILoginData = { email: '', password: '' };

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.logout();
  }

  onLogin(): void {
    if (this.loginData.email && this.loginData.password) {
      this.auth.login(this.loginData);
    }
  }
}
