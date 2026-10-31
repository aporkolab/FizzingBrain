export type Difficulty = 'easy' | 'medium' | 'hard' | 'impossible';
export type RoundWinner = 'both' | 'computer' | 'player';
export type GameWinner = 'draw' | 'computer' | 'player';

export interface DifficultySettings {
  /** Seconds the player has for a single question. */
  timeStandard: number;
  /** Maximum deviation of the computer's guess from the solution, in percent. */
  errorMargin: number;
}

export const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard', 'impossible'];

export const DIFFICULTY_SETTINGS: Readonly<Record<Difficulty, DifficultySettings>> = {
  easy: { timeStandard: 20, errorMargin: 30 },
  medium: { timeStandard: 15, errorMargin: 20 },
  hard: { timeStandard: 10, errorMargin: 10 },
  impossible: { timeStandard: 5, errorMargin: 5 },
};

export const POINTS_PER_ROUND = 5;
export const ROUNDS_PER_GAME = 6;

export function isDifficulty(value: string): value is Difficulty {
  return (DIFFICULTIES as readonly string[]).includes(value);
}

/** Inclusive range the computer may guess from; works for negative solutions as well. */
export function guessRange(solution: number, errorMargin: number): { min: number; max: number } {
  const low = solution * ((100 - errorMargin) / 100);
  const high = solution * ((100 + errorMargin) / 100);
  return { min: Math.ceil(Math.min(low, high)), max: Math.floor(Math.max(low, high)) };
}

export function computerGuess(
  solution: number,
  errorMargin: number,
  random: () => number = Math.random,
): number {
  const { min, max } = guessRange(solution, errorMargin);
  if (max < min) {
    // The range contains no integer (e.g. a small fractional solution): fall back to the nearest one.
    return Math.round(solution);
  }
  return Math.floor(random() * (max - min + 1)) + min;
}

/** The closer guess wins the round; an exact hit by both players scores for both. */
export function scoreRound(solution: number, computer: number, player: number): RoundWinner {
  const diffComputer = Math.abs(solution - computer);
  const diffPlayer = Math.abs(solution - player);
  if (diffComputer === 0 && diffPlayer === 0) {
    return 'both';
  }
  if (diffComputer < diffPlayer || diffComputer === 0) {
    return 'computer';
  }
  return 'player';
}

export function decideWinner(computerPoints: number, playerPoints: number): GameWinner {
  if (computerPoints === playerPoints) {
    return 'draw';
  }
  return computerPoints > playerPoints ? 'computer' : 'player';
}
