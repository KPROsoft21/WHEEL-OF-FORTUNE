import { BoardCell, SlotState } from '../types';

export const ROW_CAPACITIES = [12, 14, 14, 12] as const;
export const TOTAL_SLOTS = 52;

/**
 * Formats a solution string into the 52-space matrix (12, 14, 14, 12)
 * centering words both horizontally and vertically across the rows.
 */
export function formatPuzzleToBoard(
  solution: string,
  revealedLetters: Set<string>
): BoardCell[][] {
  const upper = solution.toUpperCase().trim();
  const words = upper.split(/\s+/).filter(Boolean);

  // Initialize empty board matrix with 'Inactive' slots
  const board: BoardCell[][] = ROW_CAPACITIES.map((cap, rowIdx) =>
    Array.from({ length: cap }, (_, colIdx) => ({
      row: rowIdx,
      col: colIdx,
      char: ' ',
      state: 'Inactive' as SlotState,
    }))
  );

  if (words.length === 0) {
    return board;
  }

  // Attempt to wrap words across 1 to 4 rows
  const lineAllocations = wrapWordsIntoRows(words);

  // Center vertically: if lines < 4, offset start row
  const totalLines = lineAllocations.length;
  let startRow = 0;
  if (totalLines === 1) startRow = 1; // Put single line on row 1 or 2 (capacity 14)
  else if (totalLines === 2) startRow = 1; // Put 2 lines on row 1 & 2 (14, 14)
  else if (totalLines === 3) startRow = 0; // Put 3 lines on row 0, 1, 2
  else startRow = 0;

  lineAllocations.forEach((lineWords, lineIdx) => {
    const rowIdx = startRow + lineIdx;
    if (rowIdx >= ROW_CAPACITIES.length) return;

    const rowCapacity = ROW_CAPACITIES[rowIdx];
    const lineText = lineWords.join(' ');
    const lineLength = lineText.length;

    // Center horizontally on this row
    const startCol = Math.max(0, Math.floor((rowCapacity - lineLength) / 2));

    let currentCol = startCol;
    lineWords.forEach((word, wIdx) => {
      // Place word letters
      for (let i = 0; i < word.length; i++) {
        if (currentCol < rowCapacity) {
          const char = word[i];
          const isAlpha = /[A-Z]/.test(char);
          const isRevealed = !isAlpha || revealedLetters.has(char);

          board[rowIdx][currentCol] = {
            row: rowIdx,
            col: currentCol,
            char: char,
            state: isRevealed ? 'Revealed' : 'Covered',
          };
          currentCol++;
        }
      }

      // If not the last word on the line, leave space slot as 'Inactive'
      if (wIdx < lineWords.length - 1 && currentCol < rowCapacity) {
        board[rowIdx][currentCol] = {
          row: rowIdx,
          col: currentCol,
          char: ' ',
          state: 'Inactive',
        };
        currentCol++;
      }
    });
  });

  return board;
}

/**
 * Greedy/optimal line breaker for the 4-row layout with capacities [12, 14, 14, 12]
 */
function wrapWordsIntoRows(words: string[]): string[][] {
  // If words can fit in 1 line on row of 14:
  const totalLength = words.join(' ').length;
  if (totalLength <= 14) {
    return [words];
  }

  // Try 2 rows (14, 14)
  const twoRowTry = tryFitRows(words, [14, 14]);
  if (twoRowTry) return twoRowTry;

  // Try 3 rows (12, 14, 14) or (14, 14, 12)
  const threeRowTryA = tryFitRows(words, [12, 14, 14]);
  if (threeRowTryA) return threeRowTryA;

  const threeRowTryB = tryFitRows(words, [14, 14, 12]);
  if (threeRowTryB) return threeRowTryB;

  // Try 4 rows (12, 14, 14, 12)
  const fourRowTry = tryFitRows(words, [12, 14, 14, 12]);
  if (fourRowTry) return fourRowTry;

  // Fallback: force fit word by word
  const result: string[][] = [];
  let curLine: string[] = [];
  let curLen = 0;
  const caps = [12, 14, 14, 12];

  for (const word of words) {
    const rowIdx = Math.min(result.length, caps.length - 1);
    const maxCap = caps[rowIdx];
    const needed = curLine.length === 0 ? word.length : curLen + 1 + word.length;

    if (needed <= maxCap) {
      curLine.push(word);
      curLen = needed;
    } else {
      if (curLine.length > 0) {
        result.push(curLine);
      }
      curLine = [word];
      curLen = word.length;
    }
  }
  if (curLine.length > 0) {
    result.push(curLine);
  }

  return result.slice(0, 4);
}

function tryFitRows(words: string[], capacities: number[]): string[][] | null {
  const lines: string[][] = [];
  let wordIdx = 0;

  for (let r = 0; r < capacities.length; r++) {
    const cap = capacities[r];
    const currentLine: string[] = [];
    let currentLen = 0;

    while (wordIdx < words.length) {
      const nextWord = words[wordIdx];
      const spaceNeeded = currentLine.length === 0 ? nextWord.length : currentLen + 1 + nextWord.length;

      if (spaceNeeded <= cap) {
        currentLine.push(nextWord);
        currentLen = spaceNeeded;
        wordIdx++;
      } else {
        break;
      }
    }

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    if (wordIdx >= words.length) {
      return lines;
    }
  }

  return null;
}
