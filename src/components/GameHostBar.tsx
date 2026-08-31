import React from 'react';
import { Volume2, VolumeX, Info, RotateCcw, Shuffle } from 'lucide-react';
import { sounds } from '../engine/soundEngine';

interface GameHostBarProps {
  currentRound: number;
  maxRounds: number;
  hostMessage: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetGame: () => void;
  onRandomizePuzzle?: () => void;
  onOpenSpecsModal: () => void;
  isBonusRound?: boolean;
}

export const GameHostBar: React.FC<GameHostBarProps> = ({
  currentRound,
  maxRounds,
  hostMessage,
  isMuted,
  onToggleMute,
  onResetGame,
  onRandomizePuzzle,
  onOpenSpecsModal,
  isBonusRound = false,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 shadow-lg backdrop-blur-md flex flex-wrap items-center justify-between gap-3 select-none">
      
      {/* Round / Status Indicator Badge */}
      <div className="flex items-center gap-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider ${
            isBonusRound
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md animate-pulse'
              : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
          }`}
        >
          {isBonusRound ? '★ BONUS ROUND ★' : `ROUND ${currentRound} / ${maxRounds}`}
        </span>
      </div>

      {/* Host Announcer Ticker Message */}
      <div className="flex-1 min-w-[240px] max-w-2xl mx-2 bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2 overflow-hidden shadow-inner">
        <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider shrink-0">
          HOST:
        </span>
        <div className="text-xs md:text-sm text-slate-200 font-semibold truncate animate-fadeIn">
          {hostMessage}
        </div>
      </div>

      {/* Utilities (Randomize phrase, Specs modal, Mute toggle, New Game) */}
      <div className="flex items-center gap-2">
        {onRandomizePuzzle && (
          <button
            id="btn-randomize-puzzle"
            onClick={onRandomizePuzzle}
            title="Generate New Random Phrase"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-bold font-mono transition-colors cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RANDOM PHRASE</span>
          </button>
        )}

        <button
          id="btn-open-specs-modal"
          onClick={onOpenSpecsModal}
          title="System Architecture Specification"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
        >
          <Info className="w-4 h-4" />
        </button>

        <button
          id="btn-toggle-sound"
          onClick={() => {
            sounds.setMuted(!isMuted);
            onToggleMute();
          }}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isMuted ? 'bg-red-950/80 text-red-400 border border-red-800' : 'bg-slate-800 hover:bg-slate-700 text-amber-400'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          id="btn-reset-game"
          onClick={onResetGame}
          title="Restart Game"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

