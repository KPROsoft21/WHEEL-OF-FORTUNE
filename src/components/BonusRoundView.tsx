import React, { useState, useEffect, useRef } from 'react';
import { PlayerState, BonusEnvelope, Puzzle } from '../types';
import { sounds } from '../engine/soundEngine';
import { Trophy, Timer, Sparkles, Gift, Check, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BonusRoundViewProps {
  bonusPlayer: PlayerState;
  puzzle: Puzzle;
  envelope: BonusEnvelope;
  bonusPhase: 'INTRO' | 'SPIN_ENVELOPE' | 'RSTLNE_REVEAL' | 'PICK_LETTERS' | 'COUNTDOWN' | 'SOLVED' | 'FAILED';
  onSpinEnvelopeComplete: () => void;
  onLettersChosen: (consonants: string[], vowel: string) => void;
  onSolveAttempt: (guess: string) => boolean; // returns true if match
  onTimeExpired: () => void;
  onRestartGame: () => void;
}

const CONSONANTS = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
const VOWELS = ['A', 'E', 'I', 'O', 'U'];
const AUTOMATED_LETTERS = ['R', 'S', 'T', 'L', 'N', 'E'];

export const BonusRoundView: React.FC<BonusRoundViewProps> = ({
  bonusPlayer,
  puzzle,
  envelope,
  bonusPhase,
  onSpinEnvelopeComplete,
  onLettersChosen,
  onSolveAttempt,
  onTimeExpired,
  onRestartGame,
}) => {
  const hasWildCard = bonusPlayer.inventory.some((i) => i.type === 'WILD_CARD');
  const hasMillionDollarWedge = bonusPlayer.inventory.some((i) => i.type === 'MILLION_DOLLAR');
  const requiredConsonants = hasWildCard ? 4 : 3;

  const [selectedConsonants, setSelectedConsonants] = useState<string[]>([]);
  const [selectedVowel, setSelectedVowel] = useState<string>('');
  const [timeLeftMs, setTimeLeftMs] = useState<number>(10000); // 10.00 seconds
  const [solveGuess, setSolveGuess] = useState<string>('');
  const [solveAttempts, setSolveAttempts] = useState<{ text: string; correct: boolean }[]>([]);
  const [isSpinningEnvelope, setIsSpinningEnvelope] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  // 10.00-second strict countdown loop
  useEffect(() => {
    if (bonusPhase !== 'COUNTDOWN') return;

    setTimeLeftMs(10000);
    const startTime = performance.now();
    const duration = 10000;

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeftMs(remaining);

      // Audio tick each second
      const secondsLeft = Math.ceil(remaining / 1000);
      if (remaining > 0 && remaining % 1000 < 60) {
        sounds.playCountdownTick(secondsLeft <= 3);
      }

      if (remaining <= 0) {
        clearInterval(interval);
        sounds.playTimeExpired();
        onTimeExpired();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [bonusPhase, onTimeExpired]);

  // Victory Confetti trigger
  useEffect(() => {
    if (bonusPhase === 'SOLVED') {
      sounds.playFanfare();
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 120,
          origin: { y: 0.5 },
        });
      }, 500);
    }
  }, [bonusPhase]);

  const handleToggleConsonant = (c: string) => {
    if (AUTOMATED_LETTERS.includes(c)) return;
    if (selectedConsonants.includes(c)) {
      setSelectedConsonants(selectedConsonants.filter((item) => item !== c));
    } else {
      if (selectedConsonants.length < requiredConsonants) {
        setSelectedConsonants([...selectedConsonants, c]);
      }
    }
  };

  const handleToggleVowel = (v: string) => {
    if (AUTOMATED_LETTERS.includes(v)) return; // 'E' is in RSTLNE
    setSelectedVowel(v === selectedVowel ? '' : v);
  };

  const handleConfirmLetters = () => {
    if (selectedConsonants.length === requiredConsonants && selectedVowel) {
      onLettersChosen(selectedConsonants, selectedVowel);
    }
  };

  const handleSolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solveGuess.trim() || bonusPhase !== 'COUNTDOWN') return;

    const isMatch = onSolveAttempt(solveGuess);
    setSolveAttempts((prev) => [...prev, { text: solveGuess.toUpperCase(), correct: isMatch }]);
    setSolveGuess('');
  };

  // Envelope prize calculation (if MDW held, replace top prize with $1M)
  const finalPrizeName = hasMillionDollarWedge && envelope.id === 23
    ? '$1,000,000 GRAND PRIZE'
    : envelope.prizeName;
  const finalPrizeCash = hasMillionDollarWedge && envelope.id === 23
    ? 1000000
    : envelope.cashAmount;

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/95 border-2 border-amber-500/80 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-md flex flex-col items-center gap-4 text-center">
      
      {/* Bonus Header Banner */}
      <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 text-slate-950 font-black tracking-widest text-base shadow-lg border border-yellow-200">
        <Trophy className="w-5 h-5 text-slate-950" />
        <span className="font-['Rowdies']">★ THE BONUS ROUND ★</span>
        <Trophy className="w-5 h-5 text-slate-950" />
      </div>

      {/* Isolated Leader Player Info */}
      <div className="bg-slate-950/80 px-6 py-2.5 rounded-xl border border-slate-800 flex items-center justify-between w-full max-w-lg">
        <div className="text-left">
          <span className="text-[11px] font-mono text-slate-400 uppercase">ISOLATED FINALIST</span>
          <h3 className="text-xl font-bold text-white font-['Rowdies']">{bonusPlayer.name}</h3>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-mono text-slate-400 uppercase">BANK SECURED</span>
          <div className="text-xl font-black text-emerald-400 font-mono">
            ${bonusPlayer.total_bank.toLocaleString()}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PHASE 1: SPIN THE BONUS ENVELOPE WHEEL                        */}
      {/* ------------------------------------------------------------- */}
      {bonusPhase === 'SPIN_ENVELOPE' && (
        <div className="flex flex-col items-center gap-3 my-3">
          <p className="text-sm md:text-base text-slate-200 max-w-md">
            Spin the miniature 24-wedge Bonus Wheel to select your mystery prize envelope!
          </p>
          {hasMillionDollarWedge && (
            <div className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400 text-xs font-bold font-mono">
              ★ MILLION DOLLAR WEDGE ACTIVE IN ENVELOPE POOL ★
            </div>
          )}

          <button
            id="btn-spin-bonus-envelope"
            onClick={() => {
              setIsSpinningEnvelope(true);
              sounds.playPegClick(2.0);
              setTimeout(() => {
                setIsSpinningEnvelope(false);
                onSpinEnvelopeComplete();
              }, 2200);
            }}
            disabled={isSpinningEnvelope}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xl font-['Rowdies'] shadow-[0_0_25px_rgba(251,191,36,0.5)] transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-6 h-6 animate-spin" />
            {isSpinningEnvelope ? 'SPINNING BONUS WHEEL...' : 'SPIN FOR PRIZE ENVELOPE'}
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PHASE 2 & 3: R-S-T-L-N-E + LETTER SELECTION                   */}
      {/* ------------------------------------------------------------- */}
      {(bonusPhase === 'RSTLNE_REVEAL' || bonusPhase === 'PICK_LETTERS') && (
        <div className="w-full flex flex-col items-center gap-4">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 w-full max-w-xl">
            <div className="text-xs font-mono text-slate-400 mb-1">
              AUTOMATED LETTER ARRAY EVALUATED:
            </div>
            <div className="flex justify-center gap-2">
              {AUTOMATED_LETTERS.map((l) => (
                <span
                  key={l}
                  className="w-8 h-9 rounded bg-amber-400/20 text-amber-300 border border-amber-400/50 font-black text-lg flex items-center justify-center font-['Libre_Franklin']"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>

          <div className="text-left w-full max-w-xl">
            <div className="text-sm font-bold text-white mb-1 font-['Rowdies'] flex items-center justify-between">
              <span>
                CHOOSE {requiredConsonants} CONSONANTS ({selectedConsonants.length}/{requiredConsonants})
              </span>
              {hasWildCard && (
                <span className="text-xs text-emerald-400 font-mono">+1 CONSONANT VIA WILD CARD</span>
              )}
            </div>

            {/* Consonants list */}
            <div className="flex flex-wrap gap-1.5 justify-center mb-3">
              {CONSONANTS.filter((c) => !AUTOMATED_LETTERS.includes(c)).map((c) => {
                const isSelected = selectedConsonants.includes(c);
                return (
                  <button
                    key={c}
                    id={`btn-bonus-consonant-${c}`}
                    onClick={() => handleToggleConsonant(c)}
                    className={`w-9 h-10 rounded-lg font-black text-base transition-all font-['Libre_Franklin'] ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-2 border-amber-300 scale-105 shadow-md'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-600'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            {/* Vowels list */}
            <div className="text-sm font-bold text-white mb-1 font-['Rowdies']">
              CHOOSE 1 VOWEL ({selectedVowel ? '1/1' : '0/1'})
            </div>
            <div className="flex gap-2 justify-center mb-4">
              {VOWELS.filter((v) => !AUTOMATED_LETTERS.includes(v)).map((v) => {
                const isSelected = selectedVowel === v;
                return (
                  <button
                    key={v}
                    id={`btn-bonus-vowel-${v}`}
                    onClick={() => handleToggleVowel(v)}
                    className={`w-11 h-11 rounded-lg font-black text-lg transition-all font-['Libre_Franklin'] ${
                      isSelected
                        ? 'bg-emerald-400 text-slate-950 border-2 border-emerald-300 scale-105 shadow-md'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-600'
                    }`}
                  >
                    {v}
                  </button>
                );
              })}
            </div>

            <button
              id="btn-confirm-bonus-letters"
              onClick={handleConfirmLetters}
              disabled={selectedConsonants.length !== requiredConsonants || !selectedVowel}
              className={`w-full py-3 rounded-xl font-black text-base font-['Rowdies'] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedConsonants.length === requiredConsonants && selectedVowel
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg hover:scale-[1.02]'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-50'
              }`}
            >
              <Check className="w-5 h-5" />
              LOCK IN LETTERS & START 10-SECOND TIMER
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PHASE 4: STRICT 10.00-SECOND COUNTDOWN LOOP                   */}
      {/* ------------------------------------------------------------- */}
      {bonusPhase === 'COUNTDOWN' && (
        <div className="w-full max-w-xl flex flex-col items-center gap-3">
          {/* Live High-Precision Timer */}
          <div className="flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-slate-950 border-2 border-red-500/80 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            <Timer className="w-7 h-7 text-red-400 animate-pulse" />
            <div className="font-['Chakra_Petch'] font-black text-3xl md:text-4xl text-red-400 tracking-wider">
              {(timeLeftMs / 1000).toFixed(2)}s
            </div>
          </div>

          <form onSubmit={handleSolveSubmit} className="w-full flex flex-col gap-2">
            <p className="text-xs text-slate-300 font-mono">
              UNLIMITED GUESSES ALLOWED WITHIN THE 10.00-SECOND WINDOW!
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                id="input-bonus-solve"
                value={solveGuess}
                onChange={(e) => setSolveGuess(e.target.value.toUpperCase())}
                placeholder="TYPE GUESS AND PRESS ENTER / SUBMIT..."
                autoFocus
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border-2 border-red-400 text-white font-['Libre_Franklin'] font-bold text-lg focus:outline-none focus:ring-4 focus:ring-red-500/30 uppercase"
              />
              <button
                type="submit"
                id="btn-bonus-solve-submit"
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black font-['Rowdies'] shadow-md cursor-pointer"
              >
                SUBMIT
              </button>
            </div>
          </form>

          {/* Real-time guess attempts history */}
          {solveAttempts.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center max-w-md">
              {solveAttempts.map((att, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    att.correct ? 'bg-emerald-500 text-black' : 'bg-red-950 text-red-300 border border-red-800'
                  }`}
                >
                  {att.text} ✗
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PHASE 5: RESOLUTION — SOLVED (VICTORY)                        */}
      {/* ------------------------------------------------------------- */}
      {bonusPhase === 'SOLVED' && (
        <div className="flex flex-col items-center gap-4 animate-fadeIn">
          <div className="text-emerald-400 font-black text-2xl md:text-3xl font-['Rowdies']">
            🎉 PUZZLE SOLVED IN TIME! 🎉
          </div>
          
          {/* Opened Envelope Prize Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-900/90 via-amber-950 to-slate-950 border-2 border-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.6)] flex flex-col items-center gap-2 max-w-md w-full">
            <Gift className="w-10 h-10 text-amber-300 animate-bounce" />
            <div className="text-xs font-mono text-amber-300 uppercase tracking-widest">
              ENVELOPE PRIZE REVEALED
            </div>
            <div className="text-2xl md:text-3xl font-black text-white font-['Rowdies']">
              {finalPrizeName}
            </div>
            <div className="text-lg font-mono font-black text-emerald-400">
              +${finalPrizeCash.toLocaleString()} Added to Total Bank!
            </div>
          </div>

          <div className="text-lg font-mono text-slate-300">
            GRAND TOTAL WON: <strong className="text-amber-400 text-xl">${(bonusPlayer.total_bank + finalPrizeCash).toLocaleString()}</strong>
          </div>

          <button
            id="btn-bonus-play-again"
            onClick={onRestartGame}
            className="mt-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-lg font-['Rowdies'] shadow-xl cursor-pointer"
          >
            PLAY NEW GAME
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PHASE 6: RESOLUTION — FAILED (TIME EXPIRED)                   */}
      {/* ------------------------------------------------------------- */}
      {bonusPhase === 'FAILED' && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-red-400 font-black text-xl font-['Rowdies']">
            <AlertCircle className="w-6 h-6" />
            TIME EXPIRED — SOLUTION REVEALED
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-sm max-w-md">
            The solution was: <strong className="text-white font-bold">{puzzle.solution}</strong>
            <div className="mt-2 text-xs text-slate-400">
              Envelope contained: <span className="text-amber-400 font-bold">{finalPrizeName}</span>
            </div>
          </div>

          <button
            id="btn-bonus-restart"
            onClick={onRestartGame}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold font-['Rowdies'] cursor-pointer"
          >
            RESTART GAME
          </button>
        </div>
      )}
    </div>
  );
};
