import React from 'react';
import { X, CheckCircle2, ShieldCheck, Cpu, Play } from 'lucide-react';

interface SpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecsModal: React.FC<SpecsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl text-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-white font-['Rowdies']">
              SYSTEM ARCHITECTURE SPECIFICATION
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Breakdown */}
        <div className="space-y-5 text-sm leading-relaxed">
          {/* Section 1 */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <h3 className="text-amber-400 font-bold text-base mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              1. Core System State Architecture
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs font-mono">
              <li><strong>3-Player Concurrent State</strong>: player_id (0,1,2), round_score, total_bank, inventory.</li>
              <li><strong>52-Space Board Matrix</strong>: 4 horizontal rows [12, 14, 14, 12]. Inactive (Forest Green), Covered (Solid White w/ black border), Revealed (Franklin Gothic font).</li>
              <li><strong>24-Wedge Mechanical Roulette</strong>: 15° arc wedges with Bankrupt, Lose A Turn, Neon Cash Wedges, and Add-on Cardboard Overlays (Free Play, Gift Tag, Million Dollar Wedge, Wild Card).</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <h3 className="text-amber-400 font-bold text-base mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              2. Step-by-Step Game Loop Lifecycle (Phases A-F)
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs font-mono">
              <li><strong>Phase A (Turn Initiation)</strong>: Mutually exclusive Spin(), BuyVowel(), Solve().</li>
              <li><strong>Phase B (Spin Execution)</strong>: Non-linear quadratic ease-out deceleration, peg snapping, hazard evaluation.</li>
              <li><strong>Phase C (Consonant Selection)</strong>: Single consonant validation, score multiplier (N × current_spin_value), 2-stage reveal.</li>
              <li><strong>Phase D (Buy Vowel)</strong>: -$250 pre-deduction, reveals instances without cash, retains turn on match.</li>
              <li><strong>Phase E (Solve)</strong>: Full string evaluation. On win: round_score transferred to total_bank, house minimum $1,000 floor enforced.</li>
              <li><strong>Phase F (PassTurn)</strong>: active_player = (active_player + 1) % 3.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <h3 className="text-amber-400 font-bold text-base mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              3. Visual Implementation Layer & Animation Parameters
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs font-mono">
              <li><strong>Chasing Light Perimeter</strong>: Alternating gold and neon blue lights traversing frame at 30 steps/min.</li>
              <li><strong>Two-Stage Letter Reveal</strong>: White border flashes gold for 400ms, then 3D rotates 180° Y-axis over 500ms.</li>
              <li><strong>Rotational Blur & Peg Physics</strong>: Dynamic blur shader on wheel canvas, flapper 30° peg flex & snap with audio pop.</li>
              <li><strong>300ms Odometer Rolling Score</strong>: Fast numeric roll over 300ms window on every cash increment/decrement.</li>
              <li><strong>Bankrupt Curtains-Wipe</strong>: Downward screen wipe overlay with signature descending slide whistle sound.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <h3 className="text-amber-400 font-bold text-base mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              4. Bonus Round System Logic
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs font-mono">
              <li><strong>Leader Isolation</strong>: Players 2 & 3 disabled, isolated highest bank player.</li>
              <li><strong>Automated R-S-T-L-N-E Insertion</strong>: Instant evaluation without input.</li>
              <li><strong>Player Letter Selection</strong>: 3 Consonants + 1 Vowel (or 4 Consonants if Wild Card held).</li>
              <li><strong>Strict 10.00-Second Countdown Loop</strong>: High-precision timer with unlimited solve attempts.</li>
              <li><strong>Prize Envelope Reveal</strong>: $40K-$100K or $1,000,000 Grand Prize if MDW held.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-['Rowdies'] transition-colors cursor-pointer"
          >
            CLOSE SPECIFICATION
          </button>
        </div>
      </div>
    </div>
  );
};
