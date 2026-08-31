import React, { useEffect, useState, useRef } from 'react';
import { PlayerState, PlayerId } from '../types';
import { sounds } from '../engine/soundEngine';

interface ScorePodiumProps {
  players: PlayerState[];
  activePlayerId: PlayerId;
  bankruptingPlayerId: PlayerId | null;
  isBonusRound?: boolean;
  layout?: 'auto' | 'vertical' | 'horizontal';
  className?: string;
}

/**
 * Fast-rolling odometer numeric score counter over a 300ms window
 */
const OdometerCounter: React.FC<{ targetValue: number; prefix?: string }> = ({
  targetValue,
  prefix = '$',
}) => {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const startValRef = useRef(targetValue);
  const startTimeRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (targetValue === displayValue) return;

    const startVal = displayValue;
    const diff = targetValue - startVal;
    const duration = 300; // 300ms window specified
    const startTime = performance.now();
    startValRef.current = startVal;
    startTimeRef.current = startTime;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Fast rolling calculation
      const current = Math.round(startVal + diff * progress);
      setDisplayValue(current);
      
      if (Math.random() > 0.4) {
        sounds.playOdometerTick();
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetValue]);

  return (
    <span className="font-['Chakra_Petch',monospace] tracking-wider">
      {prefix}
      {displayValue.toLocaleString()}
    </span>
  );
};

export const ScorePodium: React.FC<ScorePodiumProps> = ({
  players,
  activePlayerId,
  bankruptingPlayerId,
  isBonusRound = false,
  layout = 'auto',
  className = '',
}) => {
  const themeColors = {
    red: {
      bg: 'from-red-950/90 via-red-900/80 to-slate-950',
      border: 'border-red-500',
      glow: 'shadow-[0_0_25px_rgba(239,68,68,0.45)]',
      badge: 'bg-red-600 text-white',
      accent: 'text-red-400',
      stationTitle: 'PLAYER 1',
    },
    yellow: {
      bg: 'from-amber-950/90 via-amber-900/80 to-slate-950',
      border: 'border-yellow-400',
      glow: 'shadow-[0_0_25px_rgba(250,204,21,0.45)]',
      badge: 'bg-yellow-400 text-slate-950',
      accent: 'text-yellow-300',
      stationTitle: 'PLAYER 2',
    },
    blue: {
      bg: 'from-blue-950/90 via-blue-900/80 to-slate-950',
      border: 'border-cyan-400',
      glow: 'shadow-[0_0_25px_rgba(34,211,238,0.45)]',
      badge: 'bg-cyan-500 text-white',
      accent: 'text-cyan-300',
      stationTitle: 'PLAYER 3',
    },
  };

  const containerClasses =
    layout === 'vertical'
      ? `flex flex-col gap-3 w-full select-none ${className}`
      : layout === 'horizontal'
      ? `grid grid-cols-1 sm:grid-cols-3 gap-3 w-full select-none ${className}`
      : `grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 w-full select-none ${className}`;

  return (
    <div className={containerClasses}>
      {players.map((player) => {
        const theme = themeColors[player.color];
        const isActive = player.player_id === activePlayerId;
        const isBankrupting = bankruptingPlayerId === player.player_id;
        const isDisabled = isBonusRound && !isActive;

        return (
          <div
            key={player.player_id}
            id={`player-podium-${player.player_id}`}
            className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 p-3 bg-gradient-to-b ${
              theme.bg
            } ${
              isActive
                ? `${theme.border} ${theme.glow} scale-[1.01] ring-2 ring-white/20`
                : 'border-slate-800 opacity-80 hover:opacity-100'
            } ${isDisabled ? 'opacity-30 grayscale pointer-events-none' : ''}`}
          >
            {/* Bankrupt Curtains-Wipe Downward Overlay Animation */}
            {isBankrupting && (
              <div 
                className="absolute inset-0 z-30 bg-black/95 flex flex-col items-center justify-center animate-curtainWipe"
                style={{
                  animation: 'curtainWipe 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards'
                }}
              >
                <div className="text-red-500 font-black text-2xl tracking-widest uppercase animate-bounce font-['Rowdies']">
                  BANKRUPT!
                </div>
                <div className="text-white text-xs font-mono mt-1">ROUND SCORE WIPED TO $0</div>
              </div>
            )}

            {/* Active Turn Pulsing Indicator Arrow */}
            {isActive && !isDisabled && (
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                ACTIVE TURN
              </div>
            )}

            {/* Station Header */}
            <div className="flex items-center gap-2 mb-2 pr-24">
              <span className={`px-2 py-0.5 rounded text-xs font-black tracking-wide ${theme.badge}`}>
                {theme.stationTitle}
              </span>
              <span className="text-slate-200 font-bold text-sm tracking-tight truncate">
                {player.name}
              </span>
            </div>

            {/* Round Liquid Cash Display (Odometer 300ms) */}
            <div className="mb-2 bg-slate-950/85 rounded-lg p-2 border border-slate-800/90 flex flex-col justify-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex justify-between items-center">
                <span>Round Score</span>
                <span className="text-[9px] text-emerald-400 font-bold">CURRENT</span>
              </div>
              <div className="text-xl md:text-2xl font-black text-emerald-400 mt-0.5">
                <OdometerCounter targetValue={player.round_score} />
              </div>
            </div>

            {/* Permanent Total Bank Secured Display */}
            <div className="flex justify-between items-center px-1 text-xs">
              <span className="text-slate-400 font-mono">Total Bank:</span>
              <span className="font-mono font-bold text-amber-300">
                <OdometerCounter targetValue={player.total_bank} />
              </span>
            </div>

            {/* Held Item Inventory (Wild Card, Gift Tag, Million Dollar Wedge, Free Play) */}
            <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex flex-wrap gap-1 min-h-[22px] items-center">
              {player.inventory.length === 0 ? (
                <span className="text-[10px] text-slate-500 italic">No tokens held</span>
              ) : (
                player.inventory.map((item, idx) => (
                  <span
                    key={`${item.id}-${idx}`}
                    title={item.description}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40"
                  >
                    ★ {item.name}
                  </span>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
