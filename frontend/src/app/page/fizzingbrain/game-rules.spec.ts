import {
  computerGuess,
  decideWinner,
  DIFFICULTY_SETTINGS,
  guessRange,
  isDifficulty,
  scoreRound,
} from './game-rules';

describe('game rules', () => {
  describe('guessRange', () => {
    it('spreads the range by the error margin around the solution', () => {
      expect(guessRange(100, 30)).toEqual({ min: 70, max: 130 });
      expect(guessRange(1953, 5)).toEqual({ min: 1856, max: 2050 });
    });

    it('keeps min below max for negative solutions', () => {
      expect(guessRange(-100, 10)).toEqual({ min: -110, max: -90 });
    });
  });

  describe('computerGuess', () => {
    it('stays within the range for the extremes of the random source', () => {
      expect(computerGuess(100, 30, () => 0)).toBe(70);
      expect(computerGuess(100, 30, () => 0.9999)).toBe(130);
    });

    it('falls back to the rounded solution when the range holds no integer', () => {
      expect(computerGuess(0.4, 5, () => 0.5)).toBe(0);
    });

    it('guesses the exact solution for zero', () => {
      expect(computerGuess(0, 30, () => 0.7)).toBe(0);
    });
  });

  describe('scoreRound', () => {
    it('gives the point to both players on a double exact hit', () => {
      expect(scoreRound(42, 42, 42)).toBe('both');
    });

    it('gives the point to the closer guess', () => {
      expect(scoreRound(100, 90, 120)).toBe('computer');
      expect(scoreRound(100, 80, 101)).toBe('player');
    });

    it('lets the player win an equally distant round', () => {
      expect(scoreRound(100, 90, 110)).toBe('player');
    });
  });

  describe('decideWinner', () => {
    it('declares a draw on equal points', () => {
      expect(decideWinner(10, 10)).toBe('draw');
    });

    it('declares the player with more points the winner', () => {
      expect(decideWinner(15, 10)).toBe('computer');
      expect(decideWinner(5, 10)).toBe('player');
    });
  });

  it('makes harder levels faster and more precise', () => {
    const levels = ['easy', 'medium', 'hard', 'impossible'] as const;
    for (let i = 1; i < levels.length; i++) {
      expect(DIFFICULTY_SETTINGS[levels[i]].timeStandard).toBeLessThan(DIFFICULTY_SETTINGS[levels[i - 1]].timeStandard);
      expect(DIFFICULTY_SETTINGS[levels[i]].errorMargin).toBeLessThan(DIFFICULTY_SETTINGS[levels[i - 1]].errorMargin);
    }
  });

  it('recognises valid difficulty names only', () => {
    expect(isDifficulty('hard')).toBe(true);
    expect(isDifficulty('random')).toBe(false);
  });
});
