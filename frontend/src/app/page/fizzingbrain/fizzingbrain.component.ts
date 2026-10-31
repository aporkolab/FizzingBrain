import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IconModule } from 'src/app/common/icon/icon.module';
import { Question } from 'src/app/model/question';
import { FizzingbrainService } from 'src/app/service/fizzingbrain.service';
import { NotificationService } from 'src/app/service/notification.service';
import { QuestionService } from 'src/app/service/question.service';
import {
  computerGuess,
  decideWinner,
  DIFFICULTIES,
  DIFFICULTY_SETTINGS,
  GameWinner,
  isDifficulty,
  POINTS_PER_ROUND,
  ROUNDS_PER_GAME,
  scoreRound,
} from './game-rules';

type NotificationType = 'info' | 'error' | 'success' | 'warning';

const REVEAL_DELAY_MS = 3000;

const WINNER_KEYS: Record<GameWinner, string> = {
  draw: 'FIZZINGBRAIN.WINNER_BOTH',
  computer: 'FIZZINGBRAIN.WINNER_COMPUTER',
  player: 'FIZZINGBRAIN.WINNER_PLAYER',
};

@Component({
  standalone: true,
  selector: 'app-fizzingbrain',
  templateUrl: './fizzingbrain.component.html',
  styleUrls: ['./fizzingbrain.component.scss'],
  imports: [CommonModule, DecimalPipe, FormsModule, TranslatePipe, IconModule],
})
export class FizzingbrainComponent implements OnInit {
  private readonly questionService = inject(QuestionService);
  private readonly translate = inject(TranslateService);
  private readonly notifyService = inject(NotificationService);
  private readonly data = inject(FizzingbrainService);
  private readonly destroyRef = inject(DestroyRef);

  readonly language = computed(() => this.translate.currentLang() ?? 'en');

  questions: Question[] = [];
  counter = 0;
  showCount = 0;
  /** Translation key of the winner, empty while the game is running. */
  winner = '';
  executed = false;
  thereIsTime = true;
  gameHasStarted = false;
  gameHasEnded = false;
  isRevealAnswer = false;
  computerGuess = 0;
  playerGuess = 0;
  computerPoint = 0;
  playerPoint = 0;
  maxRound = ROUNDS_PER_GAME;
  gameDifficulty = 'easy';
  timeLeft = DIFFICULTY_SETTINGS.easy.timeStandard;
  timeStandard = DIFFICULTY_SETTINGS.easy.timeStandard;
  errorMargin = DIFFICULTY_SETTINGS.easy.errorMargin;

  private interval?: ReturnType<typeof setInterval>;
  private readonly timeouts = new Set<ReturnType<typeof setTimeout>>();

  ngOnInit(): void {
    this.questionService
      .getRandomQuestions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        if (response) {
          this.questions = response;
          this.maxRound = Math.min(this.questions.length, ROUNDS_PER_GAME);
        }
      });

    this.data.currentGameStartingState
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((current) => {
        if (!this.gameHasStarted && current) {
          this.gameHasStarted = current;
        }
      });

    this.data.currentGameEndingState
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((current) => {
        if (!this.gameHasEnded && current) {
          this.gameHasEnded = current;
          this.evaluateGame();
        }
      });

    window.addEventListener('beforeunload', this.onBeforeUnload);
    this.destroyRef.onDestroy(() => this.cleanup());
  }

  private cleanup(): void {
    this.stopTimer();
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.timeouts.clear();
    this.resetGame();
    // Leave the shared state clean for the next visit of the page.
    this.data.changeGameStartingState(false);
    this.data.changeGameEndingState(false);
    window.removeEventListener('beforeunload', this.onBeforeUnload);
  }

  private readonly onBeforeUnload = (event: BeforeUnloadEvent): void => {
    if (this.gameHasStarted && !this.gameHasEnded) {
      event.preventDefault();
    }
  };

  startGame(): void {
    if (this.questions.length === 0) {
      this.showNotification('error', 'FIZZINGBRAIN.NOQUESTIONS');
      return;
    }
    this.data.changeGameEndingState(false);
    this.data.changeGameStartingState(true);
    this.resetGame();
    this.setDifficulty(this.gameDifficulty);
    this.nextQuestion();
    this.startTimer();
  }

  private resetGame(): void {
    this.stopTimer();
    this.thereIsTime = true;
    this.winner = '';
    this.counter = 0;
    this.showCount = 0;
    this.playerPoint = 0;
    this.computerPoint = 0;
    this.playerGuess = 0;
    this.gameHasEnded = false;
    this.isRevealAnswer = false;
  }

  nextQuestion(): void {
    if (this.counter >= this.maxRound) {
      this.gettingPoint();
      this.schedule(() => {
        this.executed = false;
        this.evaluateGame();
      });
    } else {
      this.isRevealAnswer = false;
      this.computerGuesses();
      this.gettingPoint();
      this.executed = false;
    }
  }

  private startTimer(): void {
    this.stopTimer();
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.thereIsTime = false;
        if (!this.executed) {
          this.executed = true;
          this.nextQuestion();
        }
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  private schedule(callback: () => void): void {
    const timeout = setTimeout(() => {
      this.timeouts.delete(timeout);
      callback();
    }, REVEAL_DELAY_MS);
    this.timeouts.add(timeout);
  }

  private resetTimer(): void {
    this.thereIsTime = true;
    this.timeLeft = this.timeStandard;
  }

  private currentSolution(): number | null {
    const question = this.questions[this.counter];
    if (!question) {
      this.showNotification('error', 'FIZZINGBRAIN.QUESTIONERROR');
      return null;
    }
    const solution = Number(question.englishAnswer);
    if (Number.isNaN(solution)) {
      this.showNotification('error', 'FIZZINGBRAIN.INVALIDANSWER');
      return null;
    }
    return solution;
  }

  private computerGuesses(): void {
    const solution = this.currentSolution();
    if (solution !== null) {
      this.computerGuess = computerGuess(solution, this.errorMargin);
    }
  }

  private gettingPoint(): void {
    if (this.playerGuess === 0 && this.thereIsTime) return;

    const solution = this.currentSolution();
    if (solution === null) return;

    switch (scoreRound(solution, this.computerGuess, this.playerGuess)) {
      case 'both':
        this.showNotification('info', 'FIZZINGBRAIN.BOTHGETPOINT');
        this.computerPoint += POINTS_PER_ROUND;
        this.playerPoint += POINTS_PER_ROUND;
        break;
      case 'computer':
        this.showNotification('info', 'FIZZINGBRAIN.COMPUTERGETSPOINT');
        this.computerPoint += POINTS_PER_ROUND;
        break;
      case 'player':
        this.showNotification('info', 'FIZZINGBRAIN.PLAYERGETSPOINT');
        this.playerPoint += POINTS_PER_ROUND;
        break;
    }
    this.playerGuess = 0;
    this.revealAnswer();
  }

  private revealAnswer(): void {
    if (this.gameHasEnded) return;

    this.stopTimer();
    this.resetTimer();
    this.isRevealAnswer = true;
    const question = this.questions[this.counter];
    if (question) {
      const answerText = this.translate.instant('FIZZINGBRAIN.ANSWER');
      const answer = this.language() === 'hu' ? question.hungarianAnswer : question.englishAnswer;
      this.showNotification('info', `${answerText}: ${answer}`);
    }
    this.schedule(() => {
      if (this.gameHasEnded) return;
      this.counter++;
      if (this.counter < this.maxRound) {
        this.startTimer();
        this.nextQuestion();
      } else {
        this.evaluateGame();
      }
    });
  }

  private evaluateGame(): void {
    if (this.showCount >= 1 || this.gameHasEnded) return;

    this.stopTimer();
    this.data.changeGameEndingState(true);
    this.data.changeGameStartingState(false);

    const result = decideWinner(this.computerPoint, this.playerPoint);
    const messages: Record<GameWinner, [NotificationType, string]> = {
      draw: ['warning', 'FIZZINGBRAIN.DRAW'],
      computer: ['error', 'FIZZINGBRAIN.COMPUTERWINS'],
      player: ['success', 'FIZZINGBRAIN.PLAYERWINS'],
    };
    this.showNotification(...messages[result]);
    this.winner = WINNER_KEYS[result];
    this.showCount++;
  }

  setDifficulty(value: string): void {
    this.gameDifficulty = value;
    if (value === 'random') {
      this.randomizeDifficulty();
    } else {
      this.applyDifficultySettings(value);
    }
  }

  private applyDifficultySettings(value: string): void {
    const settings = DIFFICULTY_SETTINGS[isDifficulty(value) ? value : 'easy'];
    this.timeStandard = settings.timeStandard;
    this.timeLeft = settings.timeStandard;
    this.errorMargin = settings.errorMargin;
  }

  private randomizeDifficulty(): void {
    this.gameDifficulty = DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)];
    const chosen = this.translate.instant('FIZZINGBRAIN.CHOSEN_DIFFICULTY');
    const level = this.translate.instant(`FIZZINGBRAIN.${this.gameDifficulty.toUpperCase()}`);
    this.showNotification('info', `${chosen} ${level}`);
    this.applyDifficultySettings(this.gameDifficulty);
  }

  /** Accepts either a translation key or an already translated text. */
  private showNotification(type: NotificationType, message: string): void {
    const title = 'FIZZINGBRAIN.FIZZINGBRAIN_TITLE';
    switch (type) {
      case 'info':
        return this.notifyService.showInfo(message, title);
      case 'warning':
        return this.notifyService.showWarning(message, title);
      case 'error':
        return this.notifyService.showError(message, title);
      case 'success':
        return this.notifyService.showSuccess(message, title);
    }
  }

  restartGame(): void {
    this.resetGame();
    this.startGame();
  }
}
