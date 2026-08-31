import { WedgeDefinition, BonusEnvelope, TokenItem } from '../types';

export const WILD_CARD_TOKEN: TokenItem = {
  id: 'wild_card',
  name: 'Wild Card',
  type: 'WILD_CARD',
  description: 'Can be used for an extra consonant call or 4th consonant in the Bonus Round.',
};

export const GIFT_TAG_TOKEN: TokenItem = {
  id: 'gift_tag',
  name: 'Gift Tag $1,000',
  type: 'GIFT_TAG',
  value: 1000,
  description: 'Adds $1,000 to permanent total bank if round is won.',
};

export const MILLION_DOLLAR_TOKEN: TokenItem = {
  id: 'million_dollar',
  name: 'Million Dollar Wedge',
  type: 'MILLION_DOLLAR',
  description: 'Replaces $100K top prize with $1,000,000 in the Bonus Round!',
};

export const FREE_PLAY_TOKEN: TokenItem = {
  id: 'free_play',
  name: 'Free Play',
  type: 'FREE_PLAY',
  description: 'Allows guessing a consonant for $500, buying a free vowel, or solving without risk of losing turn.',
};

export const ROUND_1_WHEEL: WedgeDefinition[] = [
  { id: 0, type: 'CASH', value: 2500, label: '$2500', color: '#e11d48', textColor: '#ffffff' }, // Top dollar R1
  { id: 1, type: 'CASH', value: 600, label: '$600', color: '#f59e0b', textColor: '#ffffff' },
  { id: 2, type: 'CASH', value: 700, label: '$700', color: '#0284c7', textColor: '#ffffff' },
  { id: 3, type: 'WILD_CARD', value: 500, label: 'WILD CARD', color: '#7c3aed', textColor: '#ffffff', tokenOverlay: WILD_CARD_TOKEN },
  { id: 4, type: 'BANKRUPT', value: 0, label: 'BANKRUPT', color: '#000000', textColor: '#ffffff' },
  { id: 5, type: 'CASH', value: 650, label: '$650', color: '#16a34a', textColor: '#ffffff' },
  { id: 6, type: 'GIFT_TAG', value: 500, label: '$1000 GIFT', color: '#db2777', textColor: '#ffffff', tokenOverlay: GIFT_TAG_TOKEN },
  { id: 7, type: 'CASH', value: 800, label: '$800', color: '#9333ea', textColor: '#ffffff' },
  { id: 8, type: 'LOSE_A_TURN', value: 0, label: 'LOSE A TURN', color: '#ffffff', textColor: '#000000' },
  { id: 9, type: 'CASH', value: 700, label: '$700', color: '#eab308', textColor: '#ffffff' },
  { id: 10, type: 'MILLION_DOLLAR', value: 500, label: 'ONE MILLION', color: '#047857', textColor: '#ffffff', tokenOverlay: MILLION_DOLLAR_TOKEN },
  { id: 11, type: 'CASH', value: 650, label: '$650', color: '#f43f5e', textColor: '#ffffff' },
  { id: 12, type: 'FREE_PLAY', value: 500, label: 'FREE PLAY', color: '#059669', textColor: '#ffffff', tokenOverlay: FREE_PLAY_TOKEN },
  { id: 13, type: 'CASH', value: 900, label: '$900', color: '#ea580c', textColor: '#ffffff' },
  { id: 14, type: 'BANKRUPT', value: 0, label: 'BANKRUPT', color: '#000000', textColor: '#ffffff' },
  { id: 15, type: 'CASH', value: 500, label: '$500', color: '#10b981', textColor: '#ffffff' },
  { id: 16, type: 'CASH', value: 600, label: '$600', color: '#c026d3', textColor: '#ffffff' },
  { id: 17, type: 'CASH', value: 700, label: '$700', color: '#0284c7', textColor: '#ffffff' },
  { id: 18, type: 'CASH', value: 550, label: '$550', color: '#ca8a04', textColor: '#ffffff' },
  { id: 19, type: 'CASH', value: 800, label: '$800', color: '#8b5cf6', textColor: '#ffffff' },
  { id: 20, type: 'CASH', value: 500, label: '$500', color: '#f97316', textColor: '#ffffff' },
  { id: 21, type: 'CASH', value: 650, label: '$650', color: '#15803d', textColor: '#ffffff' },
  { id: 22, type: 'CASH', value: 500, label: '$500', color: '#be123c', textColor: '#ffffff' },
  { id: 23, type: 'CASH', value: 900, label: '$900', color: '#0891b2', textColor: '#ffffff' },
];

export const ROUND_2_WHEEL: WedgeDefinition[] = ROUND_1_WHEEL.map((w, idx) => {
  if (idx === 0) return { ...w, value: 3500, label: '$3500', color: '#e11d48' };
  return { ...w };
});

export const ROUND_3_WHEEL: WedgeDefinition[] = ROUND_1_WHEEL.map((w, idx) => {
  if (idx === 0) return { ...w, value: 5000, label: '$5000', color: '#7c3aed' };
  return { ...w };
});

export const BONUS_ENVELOPES: BonusEnvelope[] = [
  { id: 0, label: '★ 1 ★', prizeName: '$40,000 Cash', cashAmount: 40000 },
  { id: 1, label: '★ 2 ★', prizeName: 'Luxury SUV ($52,000)', cashAmount: 52000 },
  { id: 2, label: '★ 3 ★', prizeName: '$45,000 Cash', cashAmount: 45000 },
  { id: 3, label: '★ 4 ★', prizeName: '$50,000 Cash', cashAmount: 50000 },
  { id: 4, label: '★ 5 ★', prizeName: '$40,000 Cash', cashAmount: 40000 },
  { id: 5, label: '★ 6 ★', prizeName: 'Sports Roadster ($68,000)', cashAmount: 68000 },
  { id: 6, label: '★ 7 ★', prizeName: '$45,000 Cash', cashAmount: 45000 },
  { id: 7, label: '★ 8 ★', prizeName: '$100,000 Cash', cashAmount: 100000 },
  { id: 8, label: '★ 9 ★', prizeName: '$40,000 Cash', cashAmount: 40000 },
  { id: 9, label: '★ 10 ★', prizeName: '$50,000 Cash', cashAmount: 50000 },
  { id: 10, label: '★ 11 ★', prizeName: 'Luxury SUV ($52,000)', cashAmount: 52000 },
  { id: 11, label: '★ 12 ★', prizeName: '$45,000 Cash', cashAmount: 45000 },
  { id: 12, label: '★ 13 ★', prizeName: '$40,000 Cash', cashAmount: 40000 },
  { id: 13, label: '★ 14 ★', prizeName: '$100,000 Cash', cashAmount: 100000 },
  { id: 14, label: '★ 15 ★', prizeName: '$45,000 Cash', cashAmount: 45000 },
  { id: 15, label: '★ 16 ★', prizeName: '$50,000 Cash', cashAmount: 50000 },
  { id: 16, label: '★ 17 ★', prizeName: '$40,000 Cash', cashAmount: 40000 },
  { id: 17, label: '★ 18 ★', prizeName: 'European Vacation ($48,000)', cashAmount: 48000 },
  { id: 18, label: '★ 19 ★', prizeName: '$45,000 Cash', cashAmount: 45000 },
  { id: 19, label: '★ 20 ★', prizeName: '$50,000 Cash', cashAmount: 50000 },
  { id: 20, label: '★ 21 ★', prizeName: '$40,000 Cash', cashAmount: 40000 },
  { id: 21, label: '★ 22 ★', prizeName: 'Sports Roadster ($68,000)', cashAmount: 68000 },
  { id: 22, label: '★ 23 ★', prizeName: '$45,000 Cash', cashAmount: 45000 },
  { id: 23, label: '★ 24 ★', prizeName: '$1,000,000 GRAND PRIZE', cashAmount: 1000000 }, // MDW prize slot
];
