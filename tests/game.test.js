/**
 * Game Logic Tests
 * Comprehensive test suite for Tic Tac Toe game mechanics
 */

import { GameStateBuilder, BoardPatterns, MockData } from './helpers.js';

// Mock game module (to be implemented)
const Game = {
  createBoard: () => Array(9).fill(null),
  makeMove: (board, position, player) => {
    if (board[position] !== null) return null;
    const newBoard = [...board];
    newBoard[position] = player;
    return newBoard;
  },
  checkWinner: (board) => {
    for (const pattern of BoardPatterns.winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  },
  isDraw: (board) => {
    return board.every(cell => cell !== null) && Game.checkWinner(board) === null;
  },
  isValidMove: (board, position) => {
    return position >= 0 && position < 9 && board[position] === null;
  },
  getAvailableMoves: (board) => {
    return board.map((cell, index) => cell === null ? index : null)
               .filter(index => index !== null);
  },
  reset: () => Array(9).fill(null)
};

describe('Game Logic Tests', () => {

  describe('Board Initialization', () => {
    test('should create empty 3x3 board', () => {
      const board = Game.createBoard();
      expect(board).toHaveLength(9);
      expect(board).toBeValidBoard();
      expect(board.every(cell => cell === null)).toBe(true);
    });

    test('should initialize with all cells empty', () => {
      const board = Game.createBoard();
      expect(board.filter(cell => cell === null)).toHaveLength(9);
    });

    test('should be array of nulls', () => {
      const board = Game.createBoard();
      expect(board).toEqual(Array(9).fill(null));
    });
  });

  describe('Move Validation', () => {
    let board;

    beforeEach(() => {
      board = Game.createBoard();
    });

    test('should accept valid move on empty cell', () => {
      expect(Game.isValidMove(board, 0)).toBe(true);
      expect(Game.isValidMove(board, 4)).toBe(true);
      expect(Game.isValidMove(board, 8)).toBe(true);
    });

    test('should reject move on occupied cell', () => {
      board[4] = 'X';
      expect(Game.isValidMove(board, 4)).toBe(false);
    });

    test('should reject out of bounds moves', () => {
      expect(Game.isValidMove(board, -1)).toBe(false);
      expect(Game.isValidMove(board, 9)).toBe(false);
      expect(Game.isValidMove(board, 100)).toBe(false);
    });

    test('should reject non-integer positions', () => {
      expect(Game.isValidMove(board, 4.5)).toBe(false);
      expect(Game.isValidMove(board, '4')).toBe(false);
    });

    test('should update board correctly on valid move', () => {
      const newBoard = Game.makeMove(board, 0, 'X');
      expect(newBoard[0]).toBe('X');
      expect(newBoard.filter(cell => cell === null)).toHaveLength(8);
    });

    test('should return null on invalid move', () => {
      board[4] = 'X';
      const newBoard = Game.makeMove(board, 4, 'O');
      expect(newBoard).toBeNull();
    });

    test('should not mutate original board', () => {
      const originalBoard = [...board];
      Game.makeMove(board, 0, 'X');
      expect(board).toEqual(originalBoard);
    });
  });

  describe('Win Detection - Rows', () => {
    test('should detect win in top row', () => {
      const board = BoardPatterns.fromString('XXXOO----');
      expect(Game.checkWinner(board)).toBe('X');
      expect(board).toBeWinningPosition('X');
    });

    test('should detect win in middle row', () => {
      const board = BoardPatterns.fromString('--OXXX-O-');
      expect(Game.checkWinner(board)).toBe('X');
    });

    test('should detect win in bottom row', () => {
      const board = BoardPatterns.fromString('XOX-OXOOO');
      expect(Game.checkWinner(board)).toBe('O');
    });

    test('should detect O win in any row', () => {
      const board = BoardPatterns.fromString('X-XOOO-X-');
      expect(Game.checkWinner(board)).toBe('O');
    });
  });

  describe('Win Detection - Columns', () => {
    test('should detect win in left column', () => {
      const board = BoardPatterns.fromString('XO-XO-X--');
      expect(Game.checkWinner(board)).toBe('X');
    });

    test('should detect win in middle column', () => {
      const board = BoardPatterns.fromString('-X--X--X-');
      expect(Game.checkWinner(board)).toBe('X');
    });

    test('should detect win in right column', () => {
      const board = BoardPatterns.fromString('--OX-O--O');
      expect(Game.checkWinner(board)).toBe('O');
    });
  });

  describe('Win Detection - Diagonals', () => {
    test('should detect win in main diagonal', () => {
      const board = BoardPatterns.fromString('XO-OXO--X');
      expect(Game.checkWinner(board)).toBe('X');
    });

    test('should detect win in anti-diagonal', () => {
      const board = BoardPatterns.fromString('--OXO-O--');
      expect(Game.checkWinner(board)).toBe('O');
    });

    test('should handle diagonal with mixed symbols', () => {
      const board = BoardPatterns.fromString('XO--O----');
      expect(Game.checkWinner(board)).toBeNull();
    });
  });

  describe('Win Detection - Edge Cases', () => {
    test('should return null for empty board', () => {
      const board = Game.createBoard();
      expect(Game.checkWinner(board)).toBeNull();
    });

    test('should return null when no winner', () => {
      const board = BoardPatterns.fromString('XOX-XO---');
      expect(Game.checkWinner(board)).toBeNull();
    });

    test('should detect winner on last move', () => {
      const board = BoardPatterns.fromString('XXOOOXXXO');
      expect(Game.checkWinner(board)).toBe('X');
    });

    test('should handle multiple potential wins (first takes precedence)', () => {
      // This shouldn't happen in real game, but test robustness
      const board = BoardPatterns.fromString('XXXXXXXXX');
      expect(Game.checkWinner(board)).toBe('X');
    });

    test('should not detect incomplete patterns as wins', () => {
      const board = BoardPatterns.fromString('XX-OO----');
      expect(Game.checkWinner(board)).toBeNull();
    });
  });

  describe('Draw Detection', () => {
    test('should detect draw when board is full with no winner', () => {
      const board = BoardPatterns.fromString('XOXOXOXOX');
      expect(Game.isDraw(board)).toBe(true);
      expect(Game.checkWinner(board)).toBeNull();
    });

    test('should not be draw when board has empty cells', () => {
      const board = BoardPatterns.fromString('XOXOXO---');
      expect(Game.isDraw(board)).toBe(false);
    });

    test('should not be draw when there is a winner', () => {
      const board = BoardPatterns.fromString('XXXOOOXOX');
      expect(Game.isDraw(board)).toBe(false);
      expect(Game.checkWinner(board)).toBe('X');
    });

    test('should handle standard draw pattern', () => {
      const board = MockData.scenarios.draw;
      expect(Game.isDraw(board)).toBe(true);
    });
  });

  describe('Player Switching', () => {
    test('should alternate between X and O', () => {
      let currentPlayer = 'X';
      const board = Game.createBoard();

      Game.makeMove(board, 0, currentPlayer);
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      expect(currentPlayer).toBe('O');

      Game.makeMove(board, 1, currentPlayer);
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      expect(currentPlayer).toBe('X');
    });

    test('should maintain correct player sequence', () => {
      const players = [];
      let current = 'X';

      for (let i = 0; i < 9; i++) {
        players.push(current);
        current = current === 'X' ? 'O' : 'X';
      }

      expect(players).toEqual(['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X']);
    });
  });

  describe('Game State Management', () => {
    test('should track available moves correctly', () => {
      const board = Game.createBoard();
      expect(Game.getAvailableMoves(board)).toHaveLength(9);

      board[0] = 'X';
      expect(Game.getAvailableMoves(board)).toHaveLength(8);

      board[4] = 'O';
      expect(Game.getAvailableMoves(board)).toHaveLength(7);
    });

    test('should identify all available positions', () => {
      const board = BoardPatterns.fromString('X-XO-O---');
      const available = Game.getAvailableMoves(board);
      expect(available).toEqual([1, 4, 6, 7, 8]);
    });

    test('should return empty array when board is full', () => {
      const board = BoardPatterns.fromString('XOXOXOXOX');
      expect(Game.getAvailableMoves(board)).toEqual([]);
    });
  });

  describe('Reset Functionality', () => {
    test('should reset board to initial state', () => {
      const board = BoardPatterns.fromString('XOXOX----');
      const resetBoard = Game.reset();
      expect(resetBoard).toEqual(Array(9).fill(null));
    });

    test('should clear all game state', () => {
      const resetBoard = Game.reset();
      expect(Game.checkWinner(resetBoard)).toBeNull();
      expect(Game.isDraw(resetBoard)).toBe(false);
      expect(Game.getAvailableMoves(resetBoard)).toHaveLength(9);
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    test('should handle immediate win (3 moves)', () => {
      const board = Game.createBoard();
      Game.makeMove(board, 0, 'X');
      Game.makeMove(board, 3, 'O');
      Game.makeMove(board, 1, 'X');
      Game.makeMove(board, 4, 'O');
      const finalBoard = Game.makeMove(board, 2, 'X');

      expect(Game.checkWinner(finalBoard)).toBe('X');
    });

    test('should handle full board sequence', () => {
      const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
      let board = Game.createBoard();

      moves.forEach((move, index) => {
        const player = index % 2 === 0 ? 'X' : 'O';
        board = Game.makeMove(board, move, player);
      });

      expect(board.every(cell => cell !== null)).toBe(true);
    });

    test('should handle corner cases', () => {
      const corners = [0, 2, 6, 8];
      const board = Game.createBoard();

      corners.forEach(corner => {
        expect(Game.isValidMove(board, corner)).toBe(true);
      });
    });

    test('should handle center and edges', () => {
      const board = Game.createBoard();
      expect(Game.isValidMove(board, 4)).toBe(true); // center
      expect(Game.isValidMove(board, 1)).toBe(true); // edge
      expect(Game.isValidMove(board, 3)).toBe(true); // edge
    });

    test('should maintain board integrity during rapid moves', () => {
      let board = Game.createBoard();
      const moves = [4, 0, 1, 2, 7];

      moves.forEach((move, index) => {
        const player = index % 2 === 0 ? 'X' : 'O';
        board = Game.makeMove(board, move, player) || board;
      });

      expect(board.filter(cell => cell !== null)).toHaveLength(5);
    });
  });

  describe('Performance Requirements', () => {
    test('should validate move in under 1ms', async () => {
      const board = Game.createBoard();
      const duration = await measurePerformance(() => {
        Game.isValidMove(board, 4);
      });

      expect(duration).toBeLessThan(1);
    });

    test('should check winner in under 1ms', async () => {
      const board = MockData.scenarios.draw;
      const duration = await measurePerformance(() => {
        Game.checkWinner(board);
      });

      expect(duration).toBeLessThan(1);
    });

    test('should handle 1000 sequential operations efficiently', async () => {
      const duration = await measurePerformance(() => {
        for (let i = 0; i < 1000; i++) {
          const board = Game.createBoard();
          Game.makeMove(board, i % 9, 'X');
          Game.checkWinner(board);
        }
      });

      expect(duration).toBeLessThan(100);
    });
  });
});
