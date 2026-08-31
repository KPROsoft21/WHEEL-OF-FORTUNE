import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  PlayerState,
  PlayerId,
  GamePhase,
  WedgeDefinition,
  Puzzle,
  BonusEnvelope,
  TokenItem,
  LetterEvaluationResult,
} from './types';
import { formatPuzzleToBoard } from './engine/wordWrapping';
import {
  ROUND_1_WHEEL,
  ROUND_2_WHEEL,
  ROUND_3_WHEEL,
  BONUS_ENVELOPES,
} from './engine/wheelData';
import { getRandomMainPuzzle, getRandomBonusPuzzle } from './engine/puzzles';
import { sounds } from './engine/soundEngine';
import { PuzzleBoard } from './components/PuzzleBoard';
import { RollingWheelStage } from './components/RollingWheelStage';
import { ScorePodium } from './components/ScorePodium';
import { ControlPanel } from './components/ControlPanel';
import { BonusRoundView } from './components/BonusRoundView';
import { GameHostBar } from './components/GameHostBar';
import { SpecsModal } from './components/SpecsModal';
import confetti from 'canvas-confetti';
import { ArrowRight, Trophy, Sparkles, Disc3 } from 'lucide-react';

const INITIAL_PLAYERS: PlayerState[] = [
  {
    player_id: 0,
    name: 'Player 1 (Red)',
    color: 'red',
    round_score: 0,
    total_bank: 0,
    inventory: [],
  },
  {
    player_id: 1,
    name: 'Player 2 (Yellow)',
    color: 'yellow',
    round_score: 0,
    total_bank: 0,
    inventory: [],
  },
  {
    player_id: 2,
    name: 'Player 3 (Blue)',
    color: 'blue',
    round_score: 0,
    total_bank: 0,
    inventory: [],
  },
];

export default function App() {
  // Game Setup & Round Tracking
  const [currentRound, setCurrentRound] = useState<number>(1);
  const maxRounds = 3;
  const [players, setPlayers] = useState<PlayerState[]>(INITIAL_PLAYERS);
  const [activePlayerIndex, setActivePlayerIndex] = useState<PlayerId>(0);
  const [bankruptingPlayerId, setBankruptingPlayerId] = useState<PlayerId | null>(null);

  // Wheel configuration for current round
  const currentWheelWedges = useMemo<WedgeDefinition[]>(() => {
    if (currentRound === 1) return ROUND_1_WHEEL;
    if (currentRound === 2) return ROUND_2_WHEEL;
    return ROUND_3_WHEEL;
  }, [currentRound]);

  const [dynamicWedges, setDynamicWedges] = useState<WedgeDefinition[]>(ROUND_1_WHEEL);

  useEffect(() => {
    setDynamicWedges(currentWheelWedges);
  }, [currentWheelWedges]);

  // Dynamic Random Puzzle State
  const [usedSolutions, setUsedSolutions] = useState<string[]>([]);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(() => getRandomMainPuzzle());
  const [currentBonusPuzzle, setCurrentBonusPuzzle] = useState<Puzzle>(() => getRandomBonusPuzzle());

  const [revealedLetters, setRevealedLetters] = useState<Set<string>>(new Set());
  const [calledLetters, setCalledLetters] = useState<Set<string>>(new Set());
  const [revealingCells, setRevealingCells] = useState<Set<string>>(new Set());
  const [flippingCells, setFlippingCells] = useState<Set<string>>(new Set());

  // Game Loop Phase & Turn Parameters
  const [phase, setPhase] = useState<GamePhase>('TURN_INITIATION');
  const [isRollingWheelOpen, setIsRollingWheelOpen] = useState<boolean>(false);
  const [currentSpinValue, setCurrentSpinValue] = useState<number>(0);
  const [currentLandedWedge, setCurrentLandedWedge] = useState<WedgeDefinition | null>(null);
  const [freePlayActive, setFreePlayActive] = useState<boolean>(false);
  const [pendingTurnPassReason, setPendingTurnPassReason] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<LetterEvaluationResult | null>(null);

  // Broadcast Host Bar Ticker & Sound state
  const [hostMessage, setHostMessage] = useState<string>(
    'Welcome to Wheel of Fortune! Player 1, choose Spin(), Buy Vowel(), or Solve().'
  );
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState<boolean>(false);

  // Bonus Round Specific State
  const [bonusEnvelope, setBonusEnvelope] = useState<BonusEnvelope>(BONUS_ENVELOPES[0]);
  const [bonusPhase, setBonusPhase] = useState<
    'INTRO' | 'SPIN_ENVELOPE' | 'RSTLNE_REVEAL' | 'PICK_LETTERS' | 'COUNTDOWN' | 'SOLVED' | 'FAILED'
  >('INTRO');

  const activePlayer = players[activePlayerIndex];

  // Active puzzle string based on whether in Bonus Round
  const isBonusRound = phase.startsWith('BONUS_ROUND');
  const activePuzzle = isBonusRound ? currentBonusPuzzle : currentPuzzle;

  // Board matrix representation
  const board = useMemo(() => {
    return formatPuzzleToBoard(activePuzzle.solution, revealedLetters);
  }, [activePuzzle.solution, revealedLetters]);

  // Quick Randomize Phrase Handler
  const handleRandomizePuzzle = () => {
    if (isBonusRound) {
      const nextBonus = getRandomBonusPuzzle([...usedSolutions, currentBonusPuzzle.solution]);
      setCurrentBonusPuzzle(nextBonus);
      setUsedSolutions((prev) => [...prev, nextBonus.solution]);
      setRevealedLetters(new Set());
      setCalledLetters(new Set(['R', 'S', 'T', 'L', 'N', 'E']));
      setHostMessage(`Randomized Bonus Phrase: Category "${nextBonus.category}"!`);
    } else {
      const nextMain = getRandomMainPuzzle([...usedSolutions, currentPuzzle.solution]);
      setCurrentPuzzle(nextMain);
      setUsedSolutions((prev) => [...prev, nextMain.solution]);
      setRevealedLetters(new Set());
      setCalledLetters(new Set());
      setPhase('TURN_INITIATION');
      setCurrentSpinValue(0);
      setEvaluationResult(null);
      setHostMessage(`Fresh random phrase generated: Category "${nextMain.category}"!`);
    }
  };

  // =========================================================================
  // PASS TURN EXECUTION (active_player = (active_player + 1) % 3)
  // =========================================================================
  const passTurn = useCallback(
    (reason?: string) => {
      const nextIndex = ((activePlayerIndex + 1) % 3) as PlayerId;
      setActivePlayerIndex(nextIndex);
      setPhase('TURN_INITIATION');
      setCurrentSpinValue(0);
      setFreePlayActive(false);
      setPendingTurnPassReason(null);
      setEvaluationResult(null);
      const nextPlayer = players[nextIndex];
      setHostMessage(
        `${reason ? `${reason} ` : ''}Turn passes to ${nextPlayer.name}. Choose Spin, Buy Vowel, or Solve.`
      );
    },
    [activePlayerIndex, players]
  );

  // =========================================================================
  // PHASE A: TURN INITIATION HANDLERS
  // =========================================================================
  const handleSpinClick = () => {
    if (phase !== 'TURN_INITIATION') return;
    setPhase('SPINNING');
    setIsRollingWheelOpen(true);
    setPendingTurnPassReason(null);
    setHostMessage(`${activePlayer.name} is spinning the wheel!`);
  };

  const handleBuyVowelClick = () => {
    if (phase !== 'TURN_INITIATION') return;
    if (activePlayer.round_score < 250 && !freePlayActive) {
      setHostMessage('Not enough liquid cash! Buying a vowel costs $250.');
      sounds.playBuzzer();
      return;
    }

    // Deduct $250 instantly from round_score (unless Free Play active)
    if (!freePlayActive) {
      setPlayers((prev) =>
        prev.map((p) =>
          p.player_id === activePlayerIndex
            ? { ...p, round_score: Math.max(0, p.round_score - 250) }
            : p
        )
      );
      sounds.playVowelBuy();
    }

    setPhase('VOWEL_SELECTION');
    setHostMessage(`${activePlayer.name} is buying a vowel for $250. Choose A, E, I, O, or U.`);
  };

  const handleSolveClick = () => {
    if (phase !== 'TURN_INITIATION') return;
    setPhase('SOLVING');
    setHostMessage(`${activePlayer.name} has called to SOLVE the puzzle!`);
  };

  // =========================================================================
  // PHASE B: SPIN RESOLUTION & WHEEL EXIT
  // =========================================================================
  const handleSpinComplete = (landedWedge: WedgeDefinition) => {
    setCurrentLandedWedge(landedWedge);

    if (landedWedge.type === 'BANKRUPT') {
      sounds.playBankruptSlideWhistle();
      setBankruptingPlayerId(activePlayerIndex);

      setPlayers((prev) =>
        prev.map((p) =>
          p.player_id === activePlayerIndex
            ? { ...p, round_score: 0, inventory: [] }
            : p
        )
      );

      setHostMessage(`BANKRUPT! ${activePlayer.name} lost their round score and temporary inventory.`);
      setPendingTurnPassReason('Bankrupt!');
      return;
    }

    if (landedWedge.type === 'LOSE_A_TURN') {
      sounds.playBuzzer();
      setHostMessage(`LOSE A TURN! ${activePlayer.name} forfeits their turn.`);
      setPendingTurnPassReason('Landed on Lose a Turn.');
      return;
    }

    if (landedWedge.type === 'FREE_PLAY') {
      setFreePlayActive(true);
      setCurrentSpinValue(500);
      setPendingTurnPassReason(null);
      setHostMessage(
        `FREE PLAY! ${activePlayer.name} can guess a consonant for $500, buy a free vowel, or solve with zero risk!`
      );
      return;
    }

    // Cash wedge
    setCurrentSpinValue(landedWedge.value);
    setPendingTurnPassReason(null);
    setHostMessage(
      `${activePlayer.name} landed on ${landedWedge.label}! Choose a consonant to multiply.`
    );
  };

  const handleRollingWheelExitComplete = () => {
    setIsRollingWheelOpen(false);
    setBankruptingPlayerId(null);

    if (pendingTurnPassReason) {
      const reason = pendingTurnPassReason;
      setPendingTurnPassReason(null);
      passTurn(reason);
    } else {
      setPhase('CONSONANT_SELECTION');
    }
  };

  // =========================================================================
  // TWO-STAGE BOARD REVEAL ANIMATION SEQUENCE
  // Stage 1: Gold border flash for 400ms
  // Stage 2: 180° Y-axis rotation over 500ms duration
  // =========================================================================
  const triggerLetterRevealAnimation = (letter: string, onDone?: () => void) => {
    const solutionUpper = activePuzzle.solution.toUpperCase();
    const cellsToFlash: string[] = [];

    // Find all matching cell coordinates
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell.char === letter) {
          cellsToFlash.push(`${cell.row}-${cell.col}`);
        }
      });
    });

    if (cellsToFlash.length === 0) {
      if (onDone) onDone();
      return;
    }

    // Stage 1: Gold Flash (400ms)
    sounds.playLetterFlash();
    setRevealingCells(new Set(cellsToFlash));

    setTimeout(() => {
      // Stage 2: 180° Y-axis rotation (500ms)
      sounds.playLetterReveal();
      setRevealingCells(new Set());
      setFlippingCells(new Set(cellsToFlash));

      // Mark letter revealed in state
      setRevealedLetters((prev) => new Set([...prev, letter]));

      setTimeout(() => {
        setFlippingCells(new Set());
        if (onDone) onDone();
      }, 500);
    }, 400);
  };

  // =========================================================================
  // PHASE C & D: LETTER GUESS (CONSONANT OR VOWEL) WITH SUSPENSE EVALUATION
  // =========================================================================
  const handleSelectLetter = (letter: string) => {
    const isVowelPhase = phase === 'VOWEL_SELECTION';
    const solution = activePuzzle.solution.toUpperCase();
    const count = (solution.match(new RegExp(letter, 'g')) || []).length;

    setCalledLetters((prev) => new Set([...prev, letter]));

    // 1. Enter Suspense Scan State on Puzzle Board
    setEvaluationResult({
      letter,
      count,
      valuePerLetter: isVowelPhase ? 0 : currentSpinValue,
      totalEarned: isVowelPhase ? 0 : currentSpinValue * count,
      isVowel: isVowelPhase,
      status: 'EVALUATING',
    });
    sounds.playScannerPing();

    // 2. Suspense delay for realistic game show broadcast reveal (450ms)
    setTimeout(() => {
      if (isVowelPhase) {
        // Vowel evaluation
        if (count === 0) {
          sounds.playBuzzer();
          setEvaluationResult({
            letter,
            count: 0,
            valuePerLetter: 0,
            totalEarned: 0,
            isVowel: true,
            status: 'MISS',
            freePlayProtected: freePlayActive,
          });

          setTimeout(() => {
            setEvaluationResult(null);
            if (freePlayActive) {
              setPhase('TURN_INITIATION');
              setHostMessage(`No ${letter}'s, but Free Play protected ${activePlayer.name}'s turn!`);
            } else {
              passTurn(`There are no ${letter}'s in the puzzle.`);
            }
          }, 1500);
        } else {
          setEvaluationResult({
            letter,
            count,
            valuePerLetter: 0,
            totalEarned: 0,
            isVowel: true,
            status: 'MATCH',
          });

          triggerLetterRevealAnimation(letter, () => {
            setTimeout(() => {
              setEvaluationResult(null);
              setPhase('TURN_INITIATION');
              setHostMessage(
                `There ${count === 1 ? 'is' : 'are'} ${count} ${letter}'s! ${activePlayer.name} retains their turn.`
              );
              checkIfBoardFullyRevealed(new Set([...revealedLetters, letter]));
            }, 1400);
          });
        }
        return;
      }

      // Consonant evaluation
      if (count === 0) {
        sounds.playBuzzer();
        setEvaluationResult({
          letter,
          count: 0,
          valuePerLetter: currentSpinValue,
          totalEarned: 0,
          isVowel: false,
          status: 'MISS',
          freePlayProtected: freePlayActive,
        });

        setTimeout(() => {
          setEvaluationResult(null);
          if (freePlayActive) {
            setPhase('TURN_INITIATION');
            setHostMessage(`No ${letter}'s, but Free Play saved ${activePlayer.name}'s turn!`);
          } else {
            passTurn(`There are no ${letter}'s in the puzzle.`);
          }
        }, 1500);
      } else {
        // Match: award score = current_spin_value * count
        const cashEarned = currentSpinValue * count;
        let tokenClaimedName: string | undefined = undefined;

        if (currentLandedWedge && currentLandedWedge.tokenOverlay) {
          const token = currentLandedWedge.tokenOverlay;
          tokenClaimedName = token.name;

          // Strip token from dynamic wheel and convert wedge into standard $500 cash
          setDynamicWedges((prev) =>
            prev.map((w) =>
              w.id === currentLandedWedge.id
                ? { ...w, type: 'CASH', label: '$500', value: 500, color: '#0284c7', tokenOverlay: null }
                : w
            )
          );

          // Add to player's inventory
          setPlayers((prev) =>
            prev.map((p) =>
              p.player_id === activePlayerIndex
                ? { ...p, inventory: [...p.inventory, token] }
                : p
            )
          );
        }

        setEvaluationResult({
          letter,
          count,
          valuePerLetter: currentSpinValue,
          totalEarned: cashEarned,
          isVowel: false,
          status: 'MATCH',
          tokenClaimed: tokenClaimedName,
        });

        sounds.playCashEarned();

        setPlayers((prev) =>
          prev.map((p) =>
            p.player_id === activePlayerIndex
              ? { ...p, round_score: p.round_score + cashEarned }
              : p
          )
        );

        triggerLetterRevealAnimation(letter, () => {
          setTimeout(() => {
            setEvaluationResult(null);
            setPhase('TURN_INITIATION');
            setHostMessage(
              `There ${count === 1 ? 'is' : 'are'} ${count} ${letter}'s! ${activePlayer.name} wins $${cashEarned.toLocaleString()}${tokenClaimedName ? ` and claimed the ${tokenClaimedName}!` : ''}`
            );
            checkIfBoardFullyRevealed(new Set([...revealedLetters, letter]));
          }, 1500);
        });
      }
    }, 450);
  };

  const checkIfBoardFullyRevealed = (updatedRevealed: Set<string>) => {
    const lettersInPuzzle = new Set<string>(
      activePuzzle.solution
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
        .split('')
    );

    let allRevealed = true;
    lettersInPuzzle.forEach((l: string) => {
      if (!updatedRevealed.has(l)) allRevealed = false;
    });

    if (allRevealed) {
      handlePuzzleSolvedSuccess();
    }
  };

  // =========================================================================
  // PHASE E: SOLVE PUZZLE EVALUATION
  // =========================================================================
  const handleSubmitSolveGuess = (guess: string) => {
    const cleanGuess = guess.trim().toUpperCase().replace(/\s+/g, ' ');
    const cleanSolution = activePuzzle.solution.trim().toUpperCase().replace(/\s+/g, ' ');

    if (cleanGuess === cleanSolution) {
      handlePuzzleSolvedSuccess();
    } else {
      sounds.playBuzzer();
      if (freePlayActive) {
        setPhase('TURN_INITIATION');
        setHostMessage(`Incorrect solve guess "${cleanGuess}", but Free Play kept turn active!`);
      } else {
        passTurn(`Incorrect solve guess "${cleanGuess}".`);
      }
    }
  };

  // Puzzle Solved Handler
  const handlePuzzleSolvedSuccess = () => {
    sounds.playFanfare();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Reveal all letters on board
    const allChars = new Set(activePuzzle.solution.toUpperCase().split(''));
    setRevealedLetters(allChars);

    // Calculate winnings and House minimum $1,000 floor
    const winningScore = activePlayer.round_score;
    const finalAddition = Math.max(winningScore, 1000); // House absolute minimum base value ($1,000)

    // Check if player had Gift Tag ($1,000 extra)
    const hasGiftTag = activePlayer.inventory.some((i) => i.type === 'GIFT_TAG');
    const giftBonus = hasGiftTag ? 1000 : 0;

    setPlayers((prev) =>
      prev.map((p) => {
        if (p.player_id === activePlayerIndex) {
          return {
            ...p,
            total_bank: p.total_bank + finalAddition + giftBonus,
            round_score: 0,
          };
        }
        return {
          ...p,
          round_score: 0,
        };
      })
    );

    setPhase('ROUND_WIN');
    setHostMessage(
      `🎉 ${activePlayer.name} SOLVED THE PUZZLE! Secured $${(finalAddition + giftBonus).toLocaleString()} to their permanent total bank!`
    );
  };

  // =========================================================================
  // ROUND ADVANCEMENT OR TRANSITION TO BONUS ROUND
  // =========================================================================
  const handleNextRound = () => {
    if (currentRound < maxRounds) {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      const nextPuzzle = getRandomMainPuzzle([...usedSolutions, currentPuzzle.solution]);
      setCurrentPuzzle(nextPuzzle);
      setUsedSolutions((prev) => [...prev, nextPuzzle.solution]);
      setRevealedLetters(new Set());
      setCalledLetters(new Set());
      setPhase('TURN_INITIATION');
      setActivePlayerIndex(((currentRound) % 3) as PlayerId); // Rotate starter each round
      setCurrentSpinValue(0);
      setEvaluationResult(null);
      setHostMessage(`Starting Round ${nextRound} of ${maxRounds}! Category: "${nextPuzzle.category}"`);
    } else {
      // Transition to Bonus Round
      startBonusRound();
    }
  };

  // =========================================================================
  // BONUS ROUND ENGINE INITIALIZATION & LIFECYCLE
  // =========================================================================
  const startBonusRound = () => {
    // 1. Isolate player with highest total_bank
    const highestPlayer = [...players].sort((a, b) => b.total_bank - a.total_bank)[0];
    setActivePlayerIndex(highestPlayer.player_id);

    // 2. Select random mystery envelope from 24-wedge pool
    const randomEnv = BONUS_ENVELOPES[Math.floor(Math.random() * BONUS_ENVELOPES.length)];
    setBonusEnvelope(randomEnv);

    // 3. Draw fresh random Bonus Puzzle
    const nextBonus = getRandomBonusPuzzle(usedSolutions);
    setCurrentBonusPuzzle(nextBonus);
    setUsedSolutions((prev) => [...prev, nextBonus.solution]);

    // 4. Reset board for Bonus Puzzle
    setRevealedLetters(new Set());
    setCalledLetters(new Set(['R', 'S', 'T', 'L', 'N', 'E']));

    setPhase('BONUS_ROUND_INTRO');
    setBonusPhase('SPIN_ENVELOPE');
    setHostMessage(
      `★ THE BONUS ROUND! ${highestPlayer.name} has advanced as the grand finalist! Category: "${nextBonus.category}". Spin the mini wheel for your envelope.`
    );
  };

  // Automated R-S-T-L-N-E Evaluation
  const handleSpinBonusEnvelopeComplete = () => {
    setBonusPhase('RSTLNE_REVEAL');
    setHostMessage('Evaluating automated broadcast letter array: R, S, T, L, N, E...');

    // Automatically reveal R, S, T, L, N, E in puzzle
    const rstlneSet = new Set(['R', 'S', 'T', 'L', 'N', 'E']);
    setRevealedLetters(rstlneSet);

    sounds.playLetterReveal();

    setTimeout(() => {
      setBonusPhase('PICK_LETTERS');
      setHostMessage(
        `Choose your 3 Consonants and 1 Vowel (or 4 Consonants if Wild Card held).`
      );
    }, 1200);
  };

  // Player picks 3 Consonants + 1 Vowel
  const handleBonusLettersChosen = (consonants: string[], vowel: string) => {
    const chosen = [...consonants, vowel];
    setRevealedLetters((prev) => new Set([...prev, ...chosen]));
    setBonusPhase('COUNTDOWN');
    setHostMessage(`10.00-SECOND TIMER ACTIVATED! Type and submit your solve attempts!`);
  };

  // Real-time Bonus Solve Attempt
  const handleBonusSolveAttempt = (guess: string): boolean => {
    const cleanGuess = guess.trim().toUpperCase().replace(/\s+/g, ' ');
    const cleanSolution = currentBonusPuzzle.solution.trim().toUpperCase().replace(/\s+/g, ' ');

    if (cleanGuess === cleanSolution) {
      setBonusPhase('SOLVED');
      setRevealedLetters(new Set(currentBonusPuzzle.solution.toUpperCase().split('')));

      // Calculate prize
      const hasMDW = activePlayer.inventory.some((i) => i.type === 'MILLION_DOLLAR');
      const wonAmount = hasMDW && bonusEnvelope.id === 23 ? 1000000 : bonusEnvelope.cashAmount;

      setPlayers((prev) =>
        prev.map((p) =>
          p.player_id === activePlayerIndex
            ? { ...p, total_bank: p.total_bank + wonAmount }
            : p
        )
      );

      setHostMessage(`🏆 GRAND VICTORY! ${activePlayer.name} won ${bonusEnvelope.prizeName}!`);
      return true;
    } else {
      sounds.playBuzzer();
      return false;
    }
  };

  const handleBonusTimeExpired = () => {
    setBonusPhase('FAILED');
    setRevealedLetters(new Set(currentBonusPuzzle.solution.toUpperCase().split('')));
    setHostMessage(`Time expired! The solution was "${currentBonusPuzzle.solution}".`);
  };

  const handleResetGame = () => {
    setCurrentRound(1);
    setPlayers(INITIAL_PLAYERS);
    setActivePlayerIndex(0);
    const freshMain = getRandomMainPuzzle();
    const freshBonus = getRandomBonusPuzzle([freshMain.solution]);
    setCurrentPuzzle(freshMain);
    setCurrentBonusPuzzle(freshBonus);
    setUsedSolutions([freshMain.solution, freshBonus.solution]);
    setRevealedLetters(new Set());
    setCalledLetters(new Set());
    setPhase('TURN_INITIATION');
    setBonusPhase('INTRO');
    setCurrentSpinValue(0);
    setFreePlayActive(false);
    setEvaluationResult(null);
    setHostMessage(`Game reset with fresh random phrase! Category: "${freshMain.category}". Player 1, choose Spin(), Buy Vowel(), or Solve().`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-2 sm:p-4 md:p-6 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 0. STANDALONE WHEEL OF FORTUNE BRAND HEADER */}
      <header className="w-full max-w-7xl mx-auto mb-2 flex items-center justify-center">
        <h1 className="font-['Rowdies'] font-black text-2xl sm:text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 tracking-wider text-center drop-shadow-[0_2px_12px_rgba(245,158,11,0.4)]">
          WHEEL OF FORTUNE
        </h1>
      </header>

      {/* 1. BROADCAST HOST TICKER & TOP STATUS BAR */}
      <GameHostBar
        currentRound={currentRound}
        maxRounds={maxRounds}
        hostMessage={hostMessage}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        onResetGame={handleResetGame}
        onRandomizePuzzle={handleRandomizePuzzle}
        onOpenSpecsModal={() => setIsSpecsModalOpen(true)}
        isBonusRound={isBonusRound}
      />

      {/* 2. MAIN GAME ARENA (BOARD & CONTROLS ON LEFT, CONTESTANT SCORES ON RIGHT) */}
      <main className="my-2 w-full max-w-7xl mx-auto flex-1 flex flex-col lg:flex-row items-start justify-center gap-5">
        
        {/* LEFT / CENTER COLUMN: PUZZLE BOARD & INTERACTION CONTROLS */}
        <div className="flex-1 w-full min-w-0 flex flex-col items-center gap-3">
          <PuzzleBoard
            board={board}
            category={activePuzzle.category}
            revealingCells={revealingCells}
            flippingCells={flippingCells}
            evaluationResult={evaluationResult}
          />

          {/* Dynamic Rolling Wheel Stage (rolls in from side on Spin, spins, lands, and rolls out) */}
          <RollingWheelStage
            isOpen={isRollingWheelOpen}
            wedges={dynamicWedges}
            playerName={activePlayer.name}
            onSpinComplete={handleSpinComplete}
            onExitComplete={handleRollingWheelExitComplete}
          />

          {/* ========================================================= */}
          {/* MAIN GAME WORKSPACE (CONTROLS & PUZZLE ACTIONS)           */}
          {/* ========================================================= */}
          {!isBonusRound ? (
            <div className="w-full max-w-4xl mx-auto">
              {phase === 'ROUND_WIN' ? (
                <div className="bg-slate-900 border-2 border-emerald-500 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center">
                  <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
                  <div>
                    <h3 className="text-2xl font-black text-white font-['Rowdies']">
                      ROUND {currentRound} COMPLETED!
                    </h3>
                    <p className="text-emerald-400 font-mono text-sm mt-1">
                      {activePlayer.name} secured the round bank!
                    </p>
                  </div>

                  <button
                    id="btn-advance-round"
                    onClick={handleNextRound}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-lg font-['Rowdies'] shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
                  >
                    <span>{currentRound < maxRounds ? `START ROUND ${currentRound + 1}` : 'ADVANCE TO BONUS ROUND'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <ControlPanel
                  phase={phase}
                  activePlayer={activePlayer}
                  currentSpinValue={currentSpinValue}
                  calledLetters={calledLetters}
                  onSpinClick={handleSpinClick}
                  onBuyVowelClick={handleBuyVowelClick}
                  onSolveClick={handleSolveClick}
                  onSelectLetter={handleSelectLetter}
                  onSubmitSolveGuess={handleSubmitSolveGuess}
                  onCancelSolveGuess={() => setPhase('TURN_INITIATION')}
                  freePlayActive={freePlayActive}
                />
              )}
            </div>
          ) : (
            /* BONUS ROUND COMPONENT */
            <div className="w-full max-w-4xl mx-auto">
              <BonusRoundView
                bonusPlayer={activePlayer}
                puzzle={currentBonusPuzzle}
                envelope={bonusEnvelope}
                bonusPhase={bonusPhase}
                onSpinEnvelopeComplete={handleSpinBonusEnvelopeComplete}
                onLettersChosen={handleBonusLettersChosen}
                onSolveAttempt={handleBonusSolveAttempt}
                onTimeExpired={handleBonusTimeExpired}
                onRestartGame={handleResetGame}
              />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CONTESTANT SCORES & PODIUMS */}
        <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 flex flex-col gap-2.5">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="font-['Rowdies'] font-bold text-sm tracking-wide text-white uppercase">
                Contestants & Scores
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full font-bold">
              ROUND {currentRound}
            </span>
          </div>

          <ScorePodium
            players={players}
            activePlayerId={activePlayerIndex}
            bankruptingPlayerId={bankruptingPlayerId}
            isBonusRound={isBonusRound}
            layout="auto"
          />
        </aside>
      </main>

      {/* 4. SPECIFICATION MODAL */}
      <SpecsModal
        isOpen={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
      />
    </div>
  );
}
