import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Question } from 'src/app/model/question';
import { FizzingbrainService } from 'src/app/service/fizzingbrain.service';
import { NotificationService } from 'src/app/service/notification.service';
import { QuestionService } from 'src/app/service/question.service';
import { provideTestDefaults } from 'src/testing/test-providers';
import { FizzingbrainComponent } from './fizzingbrain.component';

function question(id: number, answer: number): Question {
  return Object.assign(new Question(), {
    id,
    englishQuestion: `Question ${id}?`,
    hungarianQuestion: `Kérdés ${id}?`,
    englishAnswer: String(answer),
    hungarianAnswer: String(answer),
  });
}

describe('FizzingbrainComponent', () => {
  let component: FizzingbrainComponent;
  let fixture: ComponentFixture<FizzingbrainComponent>;
  let notifications: Record<'showInfo' | 'showError' | 'showWarning' | 'showSuccess', ReturnType<typeof vi.fn>>;
  let questions: Question[];

  async function setup(): Promise<void> {
    notifications = {
      showInfo: vi.fn(),
      showError: vi.fn(),
      showWarning: vi.fn(),
      showSuccess: vi.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [FizzingbrainComponent],
      providers: [
        provideTestDefaults(),
        { provide: QuestionService, useValue: { getRandomQuestions: () => of(questions) } },
        { provide: NotificationService, useValue: notifications },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FizzingbrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(() => {
    vi.useFakeTimers();
    questions = [1, 2, 3, 4, 5, 6].map((id) => question(id, id * 100));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('loads the questions and limits the game to six rounds', async () => {
    questions = [...questions, question(7, 700)];
    await setup();
    expect(component.questions.length).toBe(7);
    expect(component.maxRound).toBe(6);
  });

  it('does not play more rounds than questions are available', async () => {
    questions = questions.slice(0, 3);
    await setup();
    expect(component.maxRound).toBe(3);
  });

  it('refuses to start without questions', async () => {
    questions = [];
    await setup();
    component.startGame();
    expect(notifications.showError).toHaveBeenCalledWith('FIZZINGBRAIN.NOQUESTIONS', 'FIZZINGBRAIN.FIZZINGBRAIN_TITLE');
    expect(component.gameHasStarted).toBe(false);
  });

  it('applies the selected difficulty when the game starts', async () => {
    await setup();
    component.setDifficulty('hard');
    component.startGame();
    expect(component.gameHasStarted).toBe(true);
    expect(component.timeLeft).toBe(10);
    expect(component.errorMargin).toBe(10);
  });

  it('awards the round to the player with an exact guess and reveals the answer', async () => {
    await setup();
    component.setDifficulty('easy');
    component.startGame();
    component.computerGuess = 70;
    component.playerGuess = 100;
    component.nextQuestion();

    expect(component.playerPoint).toBe(5);
    expect(component.computerPoint).toBe(0);
    expect(component.isRevealAnswer).toBe(true);
    expect(component.counter).toBe(0);

    vi.advanceTimersByTime(3000);
    expect(component.counter).toBe(1);
  });

  it('ends the game after the last round and declares the winner', async () => {
    questions = questions.slice(0, 1);
    await setup();
    component.startGame();
    component.computerGuess = 70;
    component.playerGuess = 100;
    component.nextQuestion();
    vi.advanceTimersByTime(3000);

    expect(component.gameHasEnded).toBe(true);
    expect(component.winner).toBe('FIZZINGBRAIN.WINNER_PLAYER');
    expect(notifications.showSuccess).toHaveBeenCalledWith('FIZZINGBRAIN.PLAYERWINS', 'FIZZINGBRAIN.FIZZINGBRAIN_TITLE');
  });

  it('shows the end screen again after a restarted game', async () => {
    questions = questions.slice(0, 1);
    await setup();
    for (let game = 0; game < 2; game++) {
      component.restartGame();
      expect(component.gameHasEnded).toBe(false);
      component.computerGuess = 100;
      component.playerGuess = 1;
      component.nextQuestion();
      vi.advanceTimersByTime(3000);
      expect(component.gameHasEnded).toBe(true);
      expect(component.winner).toBe('FIZZINGBRAIN.WINNER_COMPUTER');
    }
  });

  it('stops every timer and resets the shared state when the page is left', async () => {
    await setup();
    const shared = TestBed.inject(FizzingbrainService);
    component.startGame();
    component.playerGuess = 100;
    component.nextQuestion();

    fixture.destroy();
    vi.advanceTimersByTime(60_000);

    expect(component.counter).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
    let started = true;
    shared.currentGameStartingState.subscribe((value) => (started = value));
    expect(started).toBe(false);
  });
});
