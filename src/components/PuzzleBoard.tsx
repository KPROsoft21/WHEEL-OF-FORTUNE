import React, { useEffect, useState } from 'react';
import { BoardCell, LetterEvaluationResult } from '../types';
import { Sparkles, CheckCircle2, XCircle, DollarSign, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PuzzleBoardProps {
  board: BoardCell[][];
  category: string;
  revealingCells: Set<string>; // 'row-col' key for cells undergoing gold flash
  flippingCells: Set<string>; // 'row-col' key for cells rotating 180deg
  evaluationResult?: LetterEvaluationResult | null;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  board,
  category,
  revealingCells,
  flippingCells,
  evaluationResult = null,
}) => {
  // Chasing light sequence: 30 steps per minute = 1 step every 2000ms (or continuous CSS animation loop)
  const [chaseStep, setChaseStep] = useState(0);

  useEffect(() => {
    // 30 steps per minute = 2000ms interval
    const interval = setInterval(() => {
      setChaseStep((prev) => (prev + 1) % 60);
    }, 100); // smooth tick for chasing lights
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center relative">
      {/* Category Banner */}
      <div className="mb-2.5 px-6 py-1.5 rounded-md bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 text-slate-950 font-extrabold uppercase tracking-widest text-sm md:text-base shadow-lg border border-amber-300 flex items-center gap-2">
        <span className="text-amber-900 text-xs">★ CATEGORY ★</span>
        <span className="font-['Rowdies'] tracking-wider">{category}</span>
        <span className="text-amber-900 text-xs">★</span>
      </div>

      {/* TENSION / EVALUATION BANNER DIRECTLY ABOVE BOARD */}
      <AnimatePresence>
        {evaluationResult && evaluationResult.status !== 'NONE' && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="mb-2.5 w-full max-w-2xl px-4 py-2.5 rounded-xl shadow-2xl flex items-center justify-between z-20"
            style={{
              background:
                evaluationResult.status === 'EVALUATING'
                  ? 'linear-gradient(90deg, #1e293b, #0f172a, #1e293b)'
                  : evaluationResult.status === 'MATCH'
                  ? 'linear-gradient(90deg, #065f46, #047857, #065f46)'
                  : 'linear-gradient(90deg, #991b1b, #b91c1c, #991b1b)',
              border:
                evaluationResult.status === 'EVALUATING'
                  ? '2px solid #38bdf8'
                  : evaluationResult.status === 'MATCH'
                  ? '2px solid #34d399'
                  : '2px solid #f87171',
            }}
          >
            {evaluationResult.status === 'EVALUATING' && (
              <div className="flex items-center gap-3 w-full justify-center">
                <Search className="w-5 h-5 text-sky-400 animate-spin" />
                <span className="text-white font-['Rowdies'] font-bold text-base md:text-lg tracking-wide animate-pulse">
                  SEARCHING BOARD FOR LETTER '{evaluationResult.letter}'...
                </span>
              </div>
            )}

            {evaluationResult.status === 'MATCH' && (
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-300 animate-bounce" />
                  <span className="font-['Rowdies'] text-emerald-100 font-extrabold text-base md:text-lg">
                    {evaluationResult.count} '{evaluationResult.letter}'{evaluationResult.count > 1 ? 'S' : ''} FOUND!
                  </span>
                </div>

                {!evaluationResult.isVowel && evaluationResult.totalEarned > 0 && (
                  <div className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-['Rowdies'] font-black text-sm md:text-base flex items-center gap-1 shadow-lg">
                    <DollarSign className="w-4 h-4" />
                    <span>+${evaluationResult.totalEarned.toLocaleString()}</span>
                  </div>
                )}

                {evaluationResult.tokenClaimed && (
                  <span className="px-2.5 py-0.5 rounded bg-purple-900 text-purple-200 border border-purple-400 font-bold text-xs">
                    🎁 {evaluationResult.tokenClaimed}
                  </span>
                )}
              </div>
            )}

            {evaluationResult.status === 'MISS' && (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-red-300 animate-pulse" />
                  <span className="font-['Rowdies'] text-red-100 font-extrabold text-base md:text-lg">
                    NO '{evaluationResult.letter}'S IN THE PUZZLE!
                  </span>
                </div>
                <span className="text-xs font-mono text-red-200">
                  {evaluationResult.freePlayProtected ? '🛡️ Free Play Protected Turn' : 'Turn Passes'}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Electronic Puzzle Board Chassis with Chasing Light Border */}
      <div className="relative p-3 md:p-4 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-4 border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] w-full overflow-hidden">
        
        {/* Outer Architectural Chasing Border (Alternating Gold & Neon Blue) */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl p-1">
          <div className="w-full h-full rounded-xl border-2 border-transparent relative overflow-hidden">
            {/* Chasing lights around perimeter */}
            <div 
              className="absolute inset-0 opacity-80"
              style={{
                backgroundImage: `radial-gradient(circle at 10px 10px, #fbbf24 3px, transparent 4px), radial-gradient(circle at 30px 10px, #00f0ff 3px, transparent 4px)`,
                backgroundSize: '40px 20px',
                animation: 'chaseLights 2s linear infinite'
              }}
            />
          </div>
        </div>

        {/* Board Surface Frame */}
        <div className="relative z-10 bg-[#062412] p-2 md:p-3.5 rounded-xl border-2 border-[#12532b] shadow-inner flex flex-col gap-1.5 md:gap-2 items-center">
          {board.map((rowCells, rowIdx) => {
            const is12SlotRow = rowCells.length === 12;

            return (
              <div
                key={`row-${rowIdx}`}
                className={`flex gap-1 md:gap-1.5 justify-center items-center ${
                  is12SlotRow ? 'px-4 md:px-7' : 'px-0'
                }`}
              >
                {rowCells.map((cell) => {
                  const cellKey = `${cell.row}-${cell.col}`;
                  const isFlashing = revealingCells.has(cellKey);
                  const isFlipping = flippingCells.has(cellKey);

                  if (cell.state === 'Inactive') {
                    return (
                      <div
                        key={cellKey}
                        id={`cell-${cellKey}`}
                        className="w-6 h-8 sm:w-8 sm:h-11 md:w-11 md:h-15 lg:w-13 lg:h-17 rounded-[3px] bg-[#0c4722] border border-[#083017] shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] flex items-center justify-center"
                      >
                        <div className="w-full h-full bg-[#0e5127]/60 rounded-[2px]" />
                      </div>
                    );
                  }

                  // Active playable slots (Covered or Revealed)
                  return (
                    <div
                      key={cellKey}
                      id={`cell-${cellKey}`}
                      className="w-6 h-8 sm:w-8 sm:h-11 md:w-11 md:h-15 lg:w-13 lg:h-17 perspective-1000"
                    >
                      <div
                        className={`relative w-full h-full rounded-[3px] transition-transform duration-500 transform-style-3d ${
                          isFlipping ? 'rotate-y-180' : ''
                        } ${
                          isFlashing
                            ? 'ring-4 ring-amber-400 shadow-[0_0_20px_#fbbf24] animate-pulse'
                            : ''
                        }`}
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: cell.state === 'Revealed' ? 'rotateY(0deg)' : 'rotateY(0deg)',
                        }}
                      >
                        {/* Front side: Blank Covered slot (Solid White with thin black border) or Revealed Letter */}
                        {cell.state === 'Covered' ? (
                          <div className="absolute inset-0 bg-white border-[1.5px] border-slate-900 rounded-[2px] shadow-[0_2px_4px_rgba(0,0,0,0.25)] flex items-center justify-center">
                            {/* Lit solid white covered space */}
                            <div className="w-full h-full bg-slate-50 border border-slate-200" />
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-white border-[1.5px] border-slate-900 rounded-[2px] shadow-[0_2px_4px_rgba(0,0,0,0.25)] flex items-center justify-center select-none">
                            {/* Revealed Franklin Gothic font letter */}
                            <span className="font-['Libre_Franklin',sans-serif] font-black text-black text-base sm:text-2xl md:text-3xl lg:text-4xl tracking-tight leading-none">
                              {cell.char}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Decorative TV Show Studio Grille Underneath */}
        <div className="mt-2 flex justify-between items-center px-4 text-xs font-mono text-emerald-400/70">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>52-SPACE MATRIX ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-semibold">ROW FORMAT: 12-14-14-12</span>
          </div>
        </div>
      </div>
    </div>
  );
};
