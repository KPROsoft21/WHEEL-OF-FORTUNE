export type SlotState = 'Inactive' | 'Covered' | 'Revealed';

export interface BoardCell {
  row: number;
  col: number;
  char: string; // uppercase letter, or ' ' if space, or punctuation
  state: SlotState;
  isFlashingGold?: boolean;
  isFlipping?: boolean;
}

export type PlayerId = 0 | 1 | 2;

export interface TokenItem {
  id: string;
  name: string;
  type: 'WILD_CARD' | 'GIFT_TAG' | 'MILLION_DOLLAR' | 'FREE_PLAY';
  value?: number;
  description: string;
}

export interface PlayerState {
  player_id: PlayerId;
  name: string;
  color: 'red' | 'yellow' | 'blue';
  round_score: number;
  total_bank: number;
  inventory: TokenItem[];
  isBankrupting?: boolean;
}

export type WedgeType = 
  | 'CASH' 
  | 'BANKRUPT' 
  | 'LOSE_A_TURN' 
  | 'FREE_PLAY' 
  | 'MILLION_DOLLAR' 
  | 'GIFT_TAG' 
  | 'WILD_CARD';

export interface WedgeDefinition {
  id: number;
  type: WedgeType;
  value: number; // 0 for bankrupt / lose a turn
  label: string;
  color: string;
  textColor: string;
  secondaryText?: string;
  tokenOverlay?: TokenItem | null;
}

export interface Puzzle {
  id: string;
  category: string;
  solution: string;
  clue?: string;
}

export type GamePhase = 
  | 'TURN_INITIATION'
  | 'SPINNING'
  | 'CONSONANT_SELECTION'
  | 'VOWEL_SELECTION'
  | 'SOLVING'
  | 'ROUND_WIN'
  | 'BANKRUPT_ANIMATION'
  | 'BONUS_ROUND_INTRO'
  | 'BONUS_ROUND_SPIN'
  | 'BONUS_ROUND_RSTLN'
  | 'BONUS_ROUND_SELECTION'
  | 'BONUS_ROUND_COUNTDOWN'
  | 'BONUS_ROUND_SOLVED'
  | 'BONUS_ROUND_FAILED';

export interface BonusEnvelope {
  id: number;
  label: string;
  prizeName: string;
  cashAmount: number;
}

export interface LetterEvaluationResult {
  letter: string;
  count: number;
  valuePerLetter: number;
  totalEarned: number;
  isVowel: boolean;
  status: 'EVALUATING' | 'MATCH' | 'MISS' | 'NONE';
  tokenClaimed?: string;
  freePlayProtected?: boolean;
}
