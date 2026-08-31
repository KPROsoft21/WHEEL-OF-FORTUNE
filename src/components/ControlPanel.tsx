import React, { useState, useEffect } from 'react';
import { GamePhase, PlayerState } from '../types';
import { Sparkles, DollarSign, KeyRound, CheckCircle2, XCircle } from 'lucide-react';
import { sounds } from '../engine/soundEngine';

interface ControlPanelProps {
  phase: GamePhase;
  activePlayer: PlayerState;
  currentSpinValue: number;
  calledLetters: Set<string>;
  onSpinClick: () => void;
  onBuyVowelClick: () => void;
  onSolveClick: () => void;
  onSelectLetter: (letter: string) => void;
  onSubmitSolveGuess: (guess: string) => void;
  onCancelSolveGuess: () => void;
  freePlayActive?: boolean;
}

const CONSONANTS = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
const VOWELS = ['A', 'E', 'I', 'O', 'U'];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  phase,
  activePlayer,
  currentSpinValue,
  calledLetters,
  onSpinClick,
  onBuyVowelClick,
  onSolveClick,
  onSelectLetter,
  onSubmitSolveGuess,
  onCancelSolveGuess,
  freePlayActive = false,
}) => {
  const [solveInputText, setSolveInputText] = useState('');
  const canBuyVowel = activePlayer.round_score >= 250 || freePlayActive;

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If modal or solve input is active, do not hijack single letter keys
      if (phase === 'SOLVING') return;

      const key = e.key.toUpperCase();
      if (key.length === 1 && /[A-Z]/.test(key)) {
        if (phase === 'CONSONANT_SELECTION' && CONSONANTS.includes(key) && !calledLetters.has(key)) {
          onSelectLetter(key);
        } else if (phase === 'VOWEL_SELECTION' && VOWELS.includes(key) && !calledLetters.has(key)) {
          onSelectLetter(key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, calledLetters, onSelectLetter]);

  const handleSolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solveInputText.trim()) return;
    onSubmitSolveGuess(solveInputText);
    setSolveInputText('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-3 md:p-4 shadow-xl backdrop-blur-sm">
      
      {/* ======================================================== */}
      {/* PHASE A: TURN INITIATION (SPIN, BUY VOWEL, SOLVE)         */}
      {/* ======================================================== */}
      {phase === 'TURN_INITIATION' && (
        <div className="flex flex-col items-center gap-3">
          <div className="text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Active Call for{' '}
              <strong className="text-amber-400">{activePlayer.name}</strong>
            </span>
            <h3 className="text-lg md:text-xl font-extrabold text-white font-['Rowdies']">
              CHOOSE SYSTEM ACTION
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
            {/* 1. SPIN() */}
            <button
              id="btn-action-spin"
              onClick={onSpinClick}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-lg md:text-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer font-['Rowdies']"
            >
              <Sparkles className="w-5 h-5 text-slate-950 animate-spin" />
              <span>SPIN()</span>
            </button>

            {/* 2. BUY VOWEL() ($250) */}
            <button
              id="btn-action-buy-vowel"
              onClick={() => {
                if (canBuyVowel) onBuyVowelClick();
              }}
              disabled={!canBuyVowel}
              className={`px-5 py-3 rounded-xl border font-black text-base md:text-lg shadow-md transition-all flex flex-col items-center justify-center gap-0.5 font-['Rowdies'] ${
                canBuyVowel
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                <span>BUY VOWEL</span>
              </div>
              <span className="text-[10px] font-mono opacity-90 font-normal">
                {freePlayActive ? 'FREE PLAY ACTIVE' : 'COSTS $250'}
              </span>
            </button>

            {/* 3. SOLVE() */}
            <button
              id="btn-action-solve"
              onClick={onSolveClick}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-lg md:text-xl shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer font-['Rowdies']"
            >
              <KeyRound className="w-5 h-5 text-sky-200" />
              <span>SOLVE()</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PHASE B & C: SPINNING & CONSONANT SELECTION               */}
      {/* ======================================================== */}
      {phase === 'SPINNING' && (
        <div className="text-center py-3 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-amber-300 font-extrabold font-['Rowdies'] text-lg animate-pulse">
            WHEEL IN MOTION — DECELERATING...
          </p>
        </div>
      )}

      {phase === 'CONSONANT_SELECTION' && (
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-mono font-bold">
              SPIN VALUE: ${currentSpinValue.toLocaleString()}
            </span>
            <h4 className="text-base md:text-lg font-bold text-white font-['Rowdies']">
              SELECT A CONSONANT
            </h4>
          </div>

          {/* Consonants Virtual Keyboard */}
          <div className="flex flex-wrap justify-center gap-1.5 max-w-2xl">
            {CONSONANTS.map((letter) => {
              const isCalled = calledLetters.has(letter);
              return (
                <button
                  key={letter}
                  id={`btn-letter-${letter}`}
                  onClick={() => onSelectLetter(letter)}
                  disabled={isCalled}
                  className={`w-9 h-10 md:w-11 md:h-12 rounded-lg font-black text-base md:text-lg transition-all flex items-center justify-center font-['Libre_Franklin',sans-serif] ${
                    isCalled
                      ? 'bg-slate-950/80 text-slate-600 border border-slate-800 line-through cursor-not-allowed opacity-40'
                      : 'bg-gradient-to-b from-slate-100 to-slate-300 hover:from-white hover:to-amber-100 text-slate-950 border-2 border-slate-400 shadow-md hover:scale-105 active:scale-95 cursor-pointer'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PHASE D: VOWEL SELECTION ($250 DEDUCTED)                  */}
      {/* ======================================================== */}
      {phase === 'VOWEL_SELECTION' && (
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-mono font-bold">
              -$250 VOWEL PURCHASE
            </span>
            <h4 className="text-base md:text-lg font-bold text-white font-['Rowdies']">
              SELECT A VOWEL (A, E, I, O, U)
            </h4>
          </div>

          <div className="flex justify-center gap-2.5 max-w-md">
            {VOWELS.map((vowel) => {
              const isCalled = calledLetters.has(vowel);
              return (
                <button
                  key={vowel}
                  id={`btn-vowel-${vowel}`}
                  onClick={() => onSelectLetter(vowel)}
                  disabled={isCalled}
                  className={`w-12 h-13 md:w-14 md:h-15 rounded-xl font-black text-xl md:text-2xl transition-all flex items-center justify-center font-['Libre_Franklin',sans-serif] ${
                    isCalled
                      ? 'bg-slate-950/80 text-slate-600 border border-slate-800 line-through cursor-not-allowed opacity-40'
                      : 'bg-gradient-to-b from-amber-300 to-amber-500 hover:from-amber-200 hover:to-amber-400 text-slate-950 border-2 border-amber-200 shadow-lg hover:scale-110 active:scale-95 cursor-pointer'
                  }`}
                >
                  {vowel}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PHASE E: SOLVE PUZZLE INPUT MODAL / DRAWER                */}
      {/* ======================================================== */}
      {phase === 'SOLVING' && (
        <form onSubmit={handleSolveSubmit} className="flex flex-col items-center gap-3 py-1">
          <div className="text-center">
            <h4 className="text-base md:text-lg font-extrabold text-amber-400 font-['Rowdies']">
              INPUT FULL SOLUTION GUESS
            </h4>
            <p className="text-xs text-slate-400 font-mono">
              Exact spelling required. Mismatch forfeits turn.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-xl">
            <input
              type="text"
              id="input-solve-guess"
              value={solveInputText}
              onChange={(e) => setSolveInputText(e.target.value.toUpperCase())}
              placeholder="TYPE FULL PUZZLE GUESS HERE..."
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-amber-400 text-white font-['Libre_Franklin'] font-bold text-base md:text-lg tracking-wider placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-amber-500/30 uppercase"
            />

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="submit"
                id="btn-submit-solve"
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm md:text-base font-['Rowdies'] flex items-center justify-center gap-1.5 shadow-lg cursor-pointer whitespace-nowrap"
              >
                <CheckCircle2 className="w-4 h-4" />
                SUBMIT
              </button>

              <button
                type="button"
                id="btn-cancel-solve"
                onClick={onCancelSolveGuess}
                className="px-3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Used / Called Letters Registry Readout */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 px-1">
        <span>CALLED LETTERS:</span>
        <div className="flex gap-1 flex-wrap font-bold text-amber-300">
          {Array.from(calledLetters).length === 0 ? (
            <span className="text-slate-600 font-normal">None called yet</span>
          ) : (
            Array.from(calledLetters).sort().map((l) => (
              <span key={l} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                {l}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
