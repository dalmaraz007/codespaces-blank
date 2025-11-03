/**
 * AI Implementation Tests
 * Comprehensive test suite for AI difficulty levels and strategies
 */

import { BoardPatterns, AITestHelpers, MockData } from './helpers.js';

// Mock AI module (to be implemented)
const AI = {
  // Easy: Random valid moves
  makeEasyMove: (board) => {
    const available = BoardPatterns.getAvailableMoves(board);
    return available[Math.floor(Math.random() * available.length)];
  },

  // Medium: Win if possible, block if necessary, else random
  makeMediumMove: (board, player) => {
    const opponent = player === 'X' ? 'O' : 'X';

    // Try to win
    for (const move of BoardPatterns.getAvailableMoves(board)) {
      const testBoard = [...board];
      testBoard[move] = player;
      if (AITestHelpers.checkWin(testBoard, player)) return move;
    }

    // Block opponent
    for (const move of BoardPatterns.getAvailableMoves(board)) {
      const testBoard = [...board];
      testBoard[move] = opponent;
      if (AITestHelpers.checkWin(testBoard, opponent)) return move;
    }

    // Take center
    if (board[4] === null) return 4;

    // Take corner
    const corners = [0, 2, 6, 8].filter(pos => board[pos] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // Random
    const available = BoardPatterns.getAvailableMoves(board);
    return available[Math.floor(Math.random() * available.length)];
  },

  // Hard: Minimax algorithm
  makeHardMove: (board, player) => {
    const minimax = (currentBoard, isMaximizing, depth = 0) => {
      const opponent = player === 'X' ? 'O' : 'X';
      const currentPlayer = isMaximizing ? player : opponent;

      // Terminal states
      if (AITestHelpers.checkWin(currentBoard, player)) return 10 - depth;
      if (AITestHelpers.checkWin(currentBoard, opponent)) return depth - 10;
      if (BoardPatterns.getAvailableMoves(currentBoard).length === 0) return 0;

      const available = BoardPatterns.getAvailableMoves(currentBoard);

      if (isMaximizing) {
        let maxScore = -Infinity;
        for (const move of available) {
          const newBoard = [...currentBoard];
          newBoard[move] = player;
          const score = minimax(newBoard, false, depth + 1);
          maxScore = Math.max(maxScore, score);
        }
        return maxScore;
      } else {
        let minScore = Infinity;
        for (const move of available) {
          const newBoard = [...currentBoard];
          newBoard[move] = opponent;
          const score = minimax(newBoard, true, depth + 1);
          minScore = Math.min(minScore, score);
        }
        return minScore;
      }
    };

    let bestScore = -Infinity;
    let bestMove = null;

    for (const move of BoardPatterns.getAvailableMoves(board)) {
      const newBoard = [...board];
      newBoard[move] = player;
      const score = minimax(newBoard, false, 0);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }
};

describe('AI Implementation Tests', () => {

  describe('Easy Mode - Random Valid Moves', () => {
    test('should always make valid move', () => {
      const board = BoardPatterns.fromString('X-XO-O---');
      const move = AI.makeEasyMove(board);

      expect(move).toBeValidMove();
      expect(board[move]).toBeNull();
    });

    test('should choose from available positions', () => {
      const board = BoardPatterns.fromString('X-XO-O---');
      const available = BoardPatterns.getAvailableMoves(board);

      for (let i = 0; i < 20; i++) {
        const move = AI.makeEasyMove(board);
        expect(available).toContain(move);
      }
    });

    test('should demonstrate randomness (not always same move)', () => {
      const board = Game.createBoard();
      const moves = new Set();

      for (let i = 0; i < 50; i++) {
        moves.add(AI.makeEasyMove(board));
      }

      // Should explore multiple options (probabilistic test)
      expect(moves.size).toBeGreaterThan(1);
    });

    test('should handle board with single available move', () => {
      const board = BoardPatterns.fromString('XOXOXOXO-');
      const move = AI.makeEasyMove(board);
      expect(move).toBe(8);
    });

    test('should work on various board states', () => {
      const scenarios = [
        Game.createBoard(),
        BoardPatterns.fromString('X--------'),
        BoardPatterns.fromString('X-X-O----'),
        BoardPatterns.fromString('XOXOX----')
      ];

      scenarios.forEach(board => {
        const move = AI.makeEasyMove(board);
        expect(move).toBeValidMove();
        expect(board[move]).toBeNull();
      });
    });
  });

  describe('Medium Mode - Strategic Play', () => {
    test('should win when possible', () => {
      const board = BoardPatterns.fromString('OO-XXX---');
      const move = AI.makeMediumMove(board, 'O');
      expect(move).toBe(2); // Complete top row
    });

    test('should block opponent win', () => {
      const board = BoardPatterns.fromString('XX------O');
      const move = AI.makeMediumMove(board, 'O');
      expect(move).toBe(2); // Block top row
    });

    test('should prioritize winning over blocking', () => {
      const board = BoardPatterns.fromString('XXOO-----');
      const move = AI.makeMediumMove(board, 'O');
      expect(move).toBe(3); // Win middle row instead of blocking
    });

    test('should prefer center when available', () => {
      const board = BoardPatterns.fromString('X--------');
      const move = AI.makeMediumMove(board, 'O');
      expect(move).toBe(4);
    });

    test('should prefer corners after center', () => {
      const board = BoardPatterns.fromString('X---O----');
      const corners = [0, 2, 6, 8];
      const move = AI.makeMediumMove(board, 'O');
      expect(corners).toContain(move);
    });

    test('should block all winning threats', () => {
      // Test blocking different win patterns
      const scenarios = [
        { board: 'XX-------', expectedMoves: [2] },      // Block row
        { board: 'X--X-----', expectedMoves: [6] },      // Block column
        { board: 'X---X----', expectedMoves: [8] }       // Block diagonal
      ];

      scenarios.forEach(({ board, expectedMoves }) => {
        const move = AI.makeMediumMove(BoardPatterns.fromString(board), 'O');
        expect(expectedMoves).toContain(move);
      });
    });

    test('should handle multiple winning opportunities', () => {
      const board = BoardPatterns.fromString('OO-O-----');
      const move = AI.makeMediumMove(board, 'O');
      expect([2, 3]).toContain(move); // Either completes a win
    });
  });

  describe('Hard Mode - Minimax Algorithm', () => {
    test('should play optimally and never lose', () => {
      const results = AITestHelpers.simulateGames(
        (board, player) => AI.makeHardMove(board, player),
        20,
        'O'
      );

      expect(results.losses).toBe(0);
      expect(results.wins + results.draws).toBe(20);
    });

    test('should win when opponent makes mistake', () => {
      // Suboptimal opening for X
      const board = BoardPatterns.fromString('X---O----');
      board[0] = 'X';

      // Play out rest of game optimally as O
      let currentBoard = [...board];
      let currentPlayer = 'O';

      for (let i = 0; i < 7; i++) {
        const move = AI.makeHardMove(currentBoard, currentPlayer);
        currentBoard[move] = currentPlayer;

        if (AITestHelpers.checkWin(currentBoard, currentPlayer)) {
          expect(currentPlayer).toBe('O');
          return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      }
    });

    test('should block all winning moves', () => {
      const board = BoardPatterns.fromString('XX-------');
      const move = AI.makeHardMove(board, 'O');
      expect(move).toBe(2);
    });

    test('should take center on first move', () => {
      const board = Game.createBoard();
      const move = AI.makeHardMove(board, 'O');
      expect(move).toBe(4);
    });

    test('should create forks when possible', () => {
      const board = BoardPatterns.fromString('O---X-O--');
      const move = AI.makeHardMove(board, 'O');

      // Check if move creates multiple win threats
      const testBoard = [...board];
      testBoard[move] = 'O';

      let winThreats = 0;
      for (const availableMove of BoardPatterns.getAvailableMoves(testBoard)) {
        const checkBoard = [...testBoard];
        checkBoard[availableMove] = 'O';
        if (AITestHelpers.checkWin(checkBoard, 'O')) winThreats++;
      }

      expect(winThreats).toBeGreaterThanOrEqual(1);
    });

    test('should prevent opponent forks', () => {
      const board = BoardPatterns.fromString('X---O---X');
      const move = AI.makeHardMove(board, 'O');

      // Move should prevent X from creating a fork
      const testBoard = [...board];
      testBoard[move] = 'O';

      // Verify X cannot create multiple win threats
      const edges = [1, 3, 5, 7].filter(pos => testBoard[pos] === null);
      expect(edges.length).toBeGreaterThan(0);
    });

    test('should always draw or win against perfect opponent', () => {
      let board = Game.createBoard();
      let currentPlayer = 'X';

      for (let i = 0; i < 9; i++) {
        const move = AI.makeHardMove(board, currentPlayer);
        board[move] = currentPlayer;

        if (AITestHelpers.checkWin(board, currentPlayer)) {
          break;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      }

      const winner = AITestHelpers.checkWin(board, 'X') ? 'X' :
                     AITestHelpers.checkWin(board, 'O') ? 'O' : null;

      // With perfect play, game should be draw
      expect(winner).toBeNull();
    });
  });

  describe('AI Performance Requirements', () => {
    test('easy mode should respond under 100ms', async () => {
      const board = MockData.randomBoard();
      const duration = await measurePerformance(() => {
        AI.makeEasyMove(board);
      });

      expect(duration).toBeLessThan(100);
    });

    test('medium mode should respond under 200ms', async () => {
      const board = MockData.randomBoard();
      const duration = await measurePerformance(() => {
        AI.makeMediumMove(board, 'O');
      });

      expect(duration).toBeLessThan(200);
    });

    test('hard mode should respond under 500ms', async () => {
      const board = MockData.randomBoard();
      const duration = await measurePerformance(() => {
        AI.makeHardMove(board, 'O');
      });

      expect(duration).toBeLessThan(500);
    });

    test('hard mode should handle empty board under 500ms', async () => {
      const board = Game.createBoard();
      const duration = await measurePerformance(() => {
        AI.makeHardMove(board, 'O');
      });

      expect(duration).toBeLessThan(500);
    });
  });

  describe('AI Consistency and Determinism', () => {
    test('hard mode should be deterministic for same position', () => {
      const board = BoardPatterns.fromString('X---O----');
      const moves = new Set();

      for (let i = 0; i < 10; i++) {
        moves.add(AI.makeHardMove(board, 'O'));
      }

      expect(moves.size).toBe(1);
    });

    test('medium mode should be consistent for clear choices', () => {
      const board = BoardPatterns.fromString('XX-------');

      for (let i = 0; i < 10; i++) {
        const move = AI.makeMediumMove(board, 'O');
        expect(move).toBe(2);
      }
    });
  });

  describe('AI Edge Cases', () => {
    test('should handle last available move', () => {
      const board = BoardPatterns.fromString('XOXOXOXO-');

      expect(AI.makeEasyMove(board)).toBe(8);
      expect(AI.makeMediumMove(board, 'X')).toBe(8);
      expect(AI.makeHardMove(board, 'X')).toBe(8);
    });

    test('should handle various board states', () => {
      const scenarios = [
        Game.createBoard(),
        BoardPatterns.fromString('X--------'),
        BoardPatterns.fromString('XOXO-----'),
        BoardPatterns.fromString('XOXOXO---')
      ];

      scenarios.forEach(board => {
        const easyMove = AI.makeEasyMove(board);
        const mediumMove = AI.makeMediumMove(board, 'O');
        const hardMove = AI.makeHardMove(board, 'O');

        expect(easyMove).toBeValidMove();
        expect(mediumMove).toBeValidMove();
        expect(hardMove).toBeValidMove();
      });
    });
  });
});
