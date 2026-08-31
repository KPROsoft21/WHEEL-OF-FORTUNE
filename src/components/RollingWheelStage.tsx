import React, { useState, useEffect, useRef } from 'react';
import { WedgeDefinition } from '../types';
import { WheelCanvas } from './WheelCanvas';
import { sounds } from '../engine/soundEngine';
import { Sparkles, AlertTriangle, XCircle, CheckCircle2, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RollingWheelStageProps {
  isOpen: boolean;
  wedges: WedgeDefinition[];
  playerName: string;
  onSpinComplete: (landedWedge: WedgeDefinition) => void;
  onExitComplete: () => void;
}

export type StagePhase = 'ROLLING_IN' | 'SPINNING' | 'LANDED' | 'ROLLING_OUT';

export const RollingWheelStage: React.FC<RollingWheelStageProps> = ({
  isOpen,
  wedges,
  playerName,
  onSpinComplete,
  onExitComplete,
}) => {
  const [stagePhase, setStagePhase] = useState<StagePhase>('ROLLING_IN');
  const [isWheelCanvasSpinning, setIsWheelCanvasSpinning] = useState(false);
  const [landedWedge, setLandedWedge] = useState<WedgeDefinition | null>(null);
  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      // 1. Start Rolling in
      setStagePhase('ROLLING_IN');
      setLandedWedge(null);
      setIsWheelCanvasSpinning(false);
      sounds.playSwoosh('in');

      // 2. After rolling in onto center stage (650ms), start the spin!
      const spinStartTimer = setTimeout(() => {
        setStagePhase('SPINNING');
        setIsWheelCanvasSpinning(true);
      }, 700);

      return () => {
        clearTimeout(spinStartTimer);
        if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      };
    }
  }, [isOpen]);

  const handleCanvasSpinDone = (terminalWedge: WedgeDefinition) => {
    setIsWheelCanvasSpinning(false);
    setLandedWedge(terminalWedge);
    setStagePhase('LANDED');

    // Notify parent immediately of game logic consequences
    onSpinComplete(terminalWedge);

    // Timing before rolling back out
    const displayDuration = terminalWedge.type === 'BANKRUPT' ? 1800 : terminalWedge.type === 'LOSE_A_TURN' ? 1400 : 1500;

    exitTimerRef.current = setTimeout(() => {
      setStagePhase('ROLLING_OUT');
      sounds.playSwoosh('out');

      // After rollout animation completes (650ms), trigger onExitComplete
      setTimeout(() => {
        onExitComplete();
      }, 650);
    }, displayDuration);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md overflow-hidden select-none p-4"
      >
        {/* Spotlight and Ambient Studio Beam */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full bg-radial from-amber-500/20 via-sky-500/10 to-transparent blur-3xl animate-pulse" />
          <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-sky-500/10 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Top TV Broadcast Banner */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-3 px-6 py-2 rounded-full bg-slate-900/90 border-2 border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center gap-3 text-center"
        >
          <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
          <span className="font-['Rowdies'] text-lg md:text-xl font-bold tracking-wide text-white">
            {playerName.toUpperCase()} IS SPINNING THE WHEEL!
          </span>
          <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
        </motion.div>

        {/* Dynamic Rolling Wheel Stage */}
        <div className="relative flex items-center justify-center w-full max-w-lg min-h-[460px]">
          <motion.div
            key="rolling-wheel"
            initial={{ x: '100vw', rotate: 720 }}
            animate={
              stagePhase === 'ROLLING_IN'
                ? { x: 0, rotate: 0 }
                : stagePhase === 'ROLLING_OUT'
                ? { x: '-100vw', rotate: -720 }
                : { x: 0, rotate: 0 }
            }
            transition={{
              type: 'spring',
              stiffness: 85,
              damping: 15,
              duration: 0.65,
            }}
            className="flex items-center justify-center"
          >
            <WheelCanvas
              wedges={wedges}
              isSpinning={isWheelCanvasSpinning}
              onSpinComplete={handleCanvasSpinDone}
            />
          </motion.div>

          {/* Dramatic Result Overlay when Landed */}
          <AnimatePresence>
            {stagePhase === 'LANDED' && landedWedge && (
              <motion.div
                initial={{ scale: 0.4, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap"
              >
                {landedWedge.type === 'BANKRUPT' ? (
                  <div className="px-8 py-3 rounded-2xl bg-red-600 border-4 border-white text-white font-['Rowdies'] text-2xl md:text-3xl font-black shadow-[0_0_50px_rgba(239,68,68,0.8)] flex items-center gap-3 animate-bounce">
                    <AlertTriangle className="w-8 h-8 text-yellow-300" />
                    <span>BANKRUPT!</span>
                  </div>
                ) : landedWedge.type === 'LOSE_A_TURN' ? (
                  <div className="px-8 py-3 rounded-2xl bg-slate-100 border-4 border-slate-900 text-slate-950 font-['Rowdies'] text-2xl md:text-3xl font-black shadow-[0_0_40px_rgba(255,255,255,0.6)] flex items-center gap-3 animate-pulse">
                    <XCircle className="w-8 h-8 text-red-600" />
                    <span>LOSE A TURN!</span>
                  </div>
                ) : (
                  <div className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-4 border-white text-slate-950 font-['Rowdies'] text-2xl md:text-3xl font-black shadow-[0_0_50px_rgba(251,191,36,0.9)] flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-slate-950" />
                    <span>
                      {landedWedge.label.includes('$') ? landedWedge.label : `${landedWedge.label} ($${landedWedge.value})`}
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status Prompt Underneath */}
        <div className="mt-4 text-center">
          <p className="text-sm font-mono text-slate-300">
            {stagePhase === 'ROLLING_IN' && 'Wheel rolling in to center stage...'}
            {stagePhase === 'SPINNING' && 'Decelerating flapper peg physics active...'}
            {stagePhase === 'LANDED' && 'Outcome locked in! Returning to the puzzle board...'}
            {stagePhase === 'ROLLING_OUT' && 'Wheel rolling back out...'}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
