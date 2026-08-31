import React, { useRef, useEffect, useState, useCallback } from 'react';
import { WedgeDefinition } from '../types';
import { sounds } from '../engine/soundEngine';

interface WheelCanvasProps {
  wedges: WedgeDefinition[];
  isSpinning: boolean;
  onSpinComplete: (landedWedge: WedgeDefinition) => void;
  targetWedgeIndex?: number | null;
  disabled?: boolean;
}

export const WheelCanvas: React.FC<WheelCanvasProps> = ({
  wedges,
  isSpinning,
  onSpinComplete,
  targetWedgeIndex = null,
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentAngleRef = useRef<number>(0);
  const angularVelocityRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastPegIndexRef = useRef<number>(-1);
  const flapperDeflectionRef = useRef<number>(0);
  const [currentLandedWedge, setCurrentLandedWedge] = useState<WedgeDefinition | null>(null);

  // Wedge angle = 360 / 24 = 15 degrees = (Math.PI * 2) / 24
  const numWedges = wedges.length || 24;
  const wedgeArc = (Math.PI * 2) / numWedges;

  // The pointer is at the TOP (angle = -Math.PI / 2, or 270 degrees)
  // Calculate which wedge is currently under the top flapper
  const getWedgeAtPointer = useCallback((wheelAngle: number): WedgeDefinition => {
    // Normalize wheel angle to [0, 2PI)
    let normalized = (wheelAngle % (Math.PI * 2));
    if (normalized < 0) normalized += Math.PI * 2;

    // Pointer is at -PI/2 (top). Wedge index that aligns with pointer:
    // angle of wedge i is from (i * wedgeArc + wheelAngle) to ((i + 1) * wedgeArc + wheelAngle)
    // Top pointer is at 3 * Math.PI / 2 (or -Math.PI / 2)
    const pointerAngle = (3 * Math.PI / 2);
    let relativeAngle = (pointerAngle - normalized) % (Math.PI * 2);
    if (relativeAngle < 0) relativeAngle += Math.PI * 2;

    const index = Math.floor(relativeAngle / wedgeArc) % numWedges;
    return wedges[index] || wedges[0];
  }, [wedges, wedgeArc, numWedges]);

  // Render Wheel to Canvas
  const drawWheel = useCallback((angle: number, velocity: number, flapperAngle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 24;

    ctx.clearRect(0, 0, size, size);

    // Save context for entire wheel rotation
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(angle);

    // Dynamic blur based on angular velocity
    const blurAmount = Math.min(velocity * 18, 5);
    if (blurAmount > 0.4) {
      ctx.filter = `blur(${blurAmount.toFixed(1)}px)`;
    } else {
      ctx.filter = 'none';
    }

    // Outer wheel rim base (metallic gold / chrome)
    ctx.beginPath();
    ctx.arc(0, 0, radius + 12, 0, Math.PI * 2);
    const rimGrad = ctx.createRadialGradient(0, 0, radius, 0, 0, radius + 12);
    rimGrad.addColorStop(0, '#d97706');
    rimGrad.addColorStop(0.5, '#fde68a');
    rimGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = rimGrad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#451a03';
    ctx.stroke();

    // Draw all 24 wedges
    wedges.forEach((wedge, i) => {
      const startAngle = i * wedgeArc;
      const endAngle = startAngle + wedgeArc;
      const midAngle = startAngle + wedgeArc / 2;

      // Base wedge shape
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      // Million Dollar Wedge 3-part custom background
      if (wedge.type === 'MILLION_DOLLAR') {
        // Draw the full wedge background
        ctx.fillStyle = '#047857';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#0f172a';
        ctx.stroke();

        // Left 22% mini-bankrupt sub-arc
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, startAngle + wedgeArc * 0.22);
        ctx.closePath();
        ctx.fillStyle = '#000000';
        ctx.fill();

        // Right 22% mini-bankrupt sub-arc
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle + wedgeArc * 0.78, endAngle);
        ctx.closePath();
        ctx.fillStyle = '#000000';
        ctx.fill();

        // Center 56% emerald sparkle sub-arc with gold border lines
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle + wedgeArc * 0.22, startAngle + wedgeArc * 0.78);
        ctx.closePath();
        ctx.fillStyle = '#059669';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#fbbf24';
        ctx.stroke();
      } else {
        // Standard base wedge fill
        ctx.fillStyle = wedge.color;
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#0f172a';
        ctx.stroke();
      }

      // Draw wedge contents
      ctx.save();
      ctx.rotate(midAngle);

      if (wedge.type === 'BANKRUPT') {
        // BANKRUPT: High-contrast white letters on jet black
        // Spelled B-A-N-K-R-U-P-T from outer rim (B) down to inner hub (T)
        // Each letter rotated upright so it reads top-to-bottom
        const letters = ['B', 'A', 'N', 'K', 'R', 'U', 'P', 'T'];
        ctx.font = '900 13px "Rowdies", "Chakra Petch", Impact, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const outerR = radius - 20;
        const innerR = 54;
        const step = (outerR - innerR) / (letters.length - 1);

        letters.forEach((char, idx) => {
          const r = outerR - idx * step;
          ctx.save();
          ctx.translate(r, 0);
          ctx.rotate(Math.PI / 2);

          ctx.lineWidth = 3;
          ctx.strokeStyle = '#000000';
          ctx.strokeText(char, 0, 0);

          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 3;
          ctx.fillText(char, 0, 0);
          ctx.restore();
        });
      } else if (wedge.type === 'LOSE_A_TURN') {
        // LOSE A TURN: Crisp white wedge with bold black lettering along the spoke
        ctx.font = '900 13px "Rowdies", "Chakra Petch", Impact, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#0f172a';
        ctx.fillText('LOSE A', radius - 20, -7);
        ctx.fillText('TURN', radius - 26, 7);
      } else if (wedge.type === 'FREE_PLAY') {
        // FREE PLAY: Full vibrant special section written along the spoke
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        // Line 1: FREE PLAY
        ctx.font = '900 13px "Rowdies", "Chakra Petch", Impact, sans-serif';
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#000000';
        ctx.strokeText('FREE PLAY', radius - 18, -7);
        ctx.fillStyle = '#fde047';
        ctx.fillText('FREE PLAY', radius - 18, -7);

        // Line 2: $500
        ctx.font = '900 17px "Rowdies", "Chakra Petch", Impact, sans-serif';
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#000000';
        ctx.strokeText('$500', radius - 25, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('$500', radius - 25, 8);
      } else if (wedge.type === 'MILLION_DOLLAR') {
        // MILLION DOLLAR WEDGE: 3-part section along the spoke
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        // Line 1: ONE MILLION
        ctx.font = '900 12px "Rowdies", "Chakra Petch", Impact, sans-serif';
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#000000';
        ctx.strokeText('ONE MILLION', radius - 18, -7);
        ctx.fillStyle = '#fef08a';
        ctx.fillText('ONE MILLION', radius - 18, -7);

        // Line 2: $500
        ctx.font = '900 17px "Rowdies", "Chakra Petch", Impact, sans-serif';
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#000000';
        ctx.strokeText('$500', radius - 25, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('$500', radius - 25, 8);
      } else if (wedge.type === 'WILD_CARD') {
        // WILD CARD: Full special section along the spoke
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        // Line 1: WILD CARD
        ctx.font = '900 13px "Rowdies", "Chakra Petch", Impact, sans-serif';
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#000000';
        ctx.strokeText('WILD CARD', radius - 18, -7);
        ctx.fillStyle = '#fde047';
        ctx.fillText('WILD CARD', radius - 18, -7);

        // Line 2: $500
        ctx.font = '900 17px "Rowdies", "Chakra Petch", Impact, sans-serif';
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#000000';
        ctx.strokeText('$500', radius - 25, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('$500', radius - 25, 8);
      } else if (wedge.type === 'GIFT_TAG') {
        // GIFT TAG: Full special section along the spoke
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        // Line 1: $1000 GIFT
        ctx.font = '900 13px "Rowdies", "Chakra Petch", Impact, sans-serif';
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#000000';
        ctx.strokeText('$1000 GIFT', radius - 18, -7);
        ctx.fillStyle = '#fef08a';
        ctx.fillText('$1000 GIFT', radius - 18, -7);

        // Line 2: $500
        ctx.font = '900 17px "Rowdies", "Chakra Petch", Impact, sans-serif';
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#000000';
        ctx.strokeText('$500', radius - 25, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('$500', radius - 25, 8);
      } else {
        // Standard Cash Wedge ($500 - $5,000)
        // Oriented radially along the wedge spoke from edge to inside
        const isTopDollar = wedge.value >= 2500;
        ctx.font = isTopDollar
          ? '900 23px "Rowdies", "Chakra Petch", Impact, sans-serif'
          : '900 21px "Rowdies", "Chakra Petch", Impact, sans-serif';

        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        // Sharp black outline stroke
        ctx.lineWidth = 4.5;
        ctx.strokeStyle = '#000000';
        ctx.lineJoin = 'round';
        ctx.strokeText(wedge.label, radius - 20, 0);

        // Radiant white or metallic gold fill
        ctx.fillStyle = isTopDollar ? '#fef08a' : (wedge.textColor || '#ffffff');
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 4;
        ctx.fillText(wedge.label, radius - 20, 0);
      }

      ctx.restore();
    });

    // Reset filter for metallic pegs
    ctx.filter = 'none';

    // Draw 24 Metallic Pegs at each 15° wedge boundary
    for (let i = 0; i < numWedges; i++) {
      const pegAngle = i * wedgeArc;
      const px = Math.cos(pegAngle) * (radius - 2);
      const py = Math.sin(pegAngle) * (radius - 2);

      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      const pegGrad = ctx.createRadialGradient(px - 1, py - 1, 1, px, py, 4.5);
      pegGrad.addColorStop(0, '#ffffff');
      pegGrad.addColorStop(0.5, '#e2e8f0');
      pegGrad.addColorStop(1, '#475569');
      ctx.fillStyle = pegGrad;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#1e293b';
      ctx.stroke();
    }

    // Wheel Center Hub
    ctx.beginPath();
    ctx.arc(0, 0, 42, 0, Math.PI * 2);
    const hubGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 42);
    hubGrad.addColorStop(0, '#fef08a');
    hubGrad.addColorStop(0.4, '#eab308');
    hubGrad.addColorStop(0.8, '#a16207');
    hubGrad.addColorStop(1, '#451a03');
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fde047';
    ctx.stroke();

    // Center Star / Emblem
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('WHEEL', 0, -6);
    ctx.fillText('OF FORTUNE', 0, 8);

    ctx.restore(); // Restore wheel rotation

    // ==========================================
    // DRAW THE FLAPPER / POINTER (AT TOP CENTER)
    // ==========================================
    ctx.save();
    ctx.translate(center, 22); // Top center anchor
    ctx.rotate(flapperAngle); // Flex backward up to 30°

    // Flapper body (flexible red / chrome triangle pointer)
    ctx.beginPath();
    ctx.moveTo(-7, -12);
    ctx.lineTo(7, -12);
    ctx.lineTo(0, 24); // points down into wheel pegs
    ctx.closePath();

    const flapperGrad = ctx.createLinearGradient(-7, 0, 7, 0);
    flapperGrad.addColorStop(0, '#ef4444');
    flapperGrad.addColorStop(0.5, '#fca5a5');
    flapperGrad.addColorStop(1, '#b91c1c');
    ctx.fillStyle = flapperGrad;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#7f1d1d';
    ctx.stroke();

    // Flapper base mounting pin
    ctx.beginPath();
    ctx.arc(0, -10, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#e2e8f0';
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    ctx.restore();
  }, [wedges, wedgeArc, numWedges]);

  // Handle spin physics loop
  useEffect(() => {
    if (!isSpinning) return;

    // Apply random torque generating non-linear quadratic ease-out deceleration curve
    // Base speed: 0.35 to 0.55 rad/frame, deceleration 0.987 to 0.992
    const initialVelocity = 0.38 + Math.random() * 0.18;
    const deceleration = 0.9885 + Math.random() * 0.003; // Quadratic decay
    const minVelocity = 0.0008;

    angularVelocityRef.current = initialVelocity;
    lastPegIndexRef.current = -1;

    let vel = initialVelocity;
    let angle = currentAngleRef.current;
    let flapperFlex = 0;

    const tick = () => {
      // Advance angle
      angle += vel;
      // Quadratic ease out
      vel *= deceleration;

      // Track peg crossing for flapper deflection & audio pop
      // Normalized angle relative to pegs
      const pegPosition = (angle / wedgeArc);
      const currentPegIdx = Math.floor(pegPosition);

      if (currentPegIdx !== lastPegIndexRef.current) {
        lastPegIndexRef.current = currentPegIdx;
        
        // Flapper flexes backward ~30° (0.52 rad) against peg direction
        flapperFlex = -0.52 * Math.min(vel * 4, 1.0);

        // Sound effect: audio pop on every single peg collision
        sounds.playPegClick(vel * 3);
      } else {
        // Flapper snaps forward sharply into place
        flapperFlex += (0 - flapperFlex) * 0.35;
      }

      flapperDeflectionRef.current = flapperFlex;
      currentAngleRef.current = angle;
      angularVelocityRef.current = vel;

      // Realtime landed wedge preview
      const activeWedge = getWedgeAtPointer(angle);
      setCurrentLandedWedge(activeWedge);

      // Render
      drawWheel(angle, vel, flapperFlex);

      if (vel > minVelocity) {
        animationFrameRef.current = requestAnimationFrame(tick);
      } else {
        // Spin Complete: Pointer snaps into terminal wedge
        angularVelocityRef.current = 0;
        flapperDeflectionRef.current = 0;
        
        // Exact terminal alignment
        const terminalWedge = getWedgeAtPointer(angle);
        setCurrentLandedWedge(terminalWedge);
        drawWheel(angle, 0, 0);

        // Notify parent
        onSpinComplete(terminalWedge);
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSpinning, wedgeArc, drawWheel, getWedgeAtPointer, onSpinComplete]);

  // Initial draw & redraw when wedges change
  useEffect(() => {
    drawWheel(currentAngleRef.current, 0, 0);
    setCurrentLandedWedge(getWedgeAtPointer(currentAngleRef.current));
  }, [wedges, drawWheel, getWedgeAtPointer]);

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      {/* Studio Lighting Spotlight Ring */}
      <div className="relative p-2 rounded-full bg-gradient-to-b from-amber-500/20 via-sky-500/10 to-purple-500/20 backdrop-blur-xs shadow-[0_0_50px_rgba(251,191,36,0.15)]">
        
        {/* Physical Canvas */}
        <canvas
          ref={canvasRef}
          width={420}
          height={420}
          className="w-[290px] h-[290px] sm:w-[350px] sm:h-[350px] md:w-[410px] md:h-[410px] rounded-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] cursor-pointer"
          title="Wheel of Fortune Physical Roulette Wheel"
        />

        {/* Outer Wheel Indicator Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-amber-400/40 pointer-events-none" />
      </div>

      {/* Current Pointer Readout Status */}
      <div className="mt-2.5 px-4 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-mono flex items-center gap-2 shadow-md">
        <span className="text-slate-400">FLAPPER ON:</span>
        <span
          className={`font-black text-sm px-2 py-0.5 rounded ${
            currentLandedWedge?.type === 'BANKRUPT'
              ? 'bg-red-950 text-red-400 border border-red-800'
              : currentLandedWedge?.type === 'LOSE_A_TURN'
              ? 'bg-slate-200 text-slate-900'
              : 'text-amber-300 font-extrabold'
          }`}
        >
          {currentLandedWedge?.label || 'READY'}
        </span>
      </div>
    </div>
  );
};
