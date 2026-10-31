import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { FizzingbrainService } from 'src/app/service/fizzingbrain.service';

@Component({
  standalone: true,
  selector: 'app-headbar',
  templateUrl: './headbar.component.html',
  styleUrls: ['./headbar.component.scss'],
  imports: [
    CommonModule, // ngIf, ngFor
    RouterModule, // routerLink
    TranslatePipe, // | translate
  ],
})
export class HeadbarComponent implements OnInit {
  translate = inject(TranslateService);
  protected data = inject(FizzingbrainService);
  private auth = inject(AuthService);

  user$ = this.auth.user$;
  gameHasEnded!: boolean;
  gameHasEndedSubscription!: Subscription;
  gameHasStarted!: boolean;
  gameHasStartedSubscription!: Subscription;

  constructor() {
    this.translate.addLangs(['hu', 'en']);
  }

  ngOnInit(): void {
    this.gameHasStartedSubscription =
      this.data.currentGameStartingState.subscribe((current) => {
        this.gameHasStarted = current;
      });
    this.gameHasEndedSubscription = this.data.currentGameEndingState.subscribe(
      (current) => {
        this.gameHasEnded = current;
      },
    );
  }

  logout() {
    this.auth.logout();
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }
}
