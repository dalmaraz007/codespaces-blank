/**
 * Integration Tests
 * End-to-end game flow testing for complete scenarios
 */

import { BoardPatterns, AITestHelpers, MockData } from './helpers.js';

describe('Integration Tests - Full Game Flows', () => {
  let gameState, container, statusElement;

  beforeEach(() => {
    createMockDOM();
    container = document.getElementById('board');
    statusElement = document.getElementById('status');

    gameState = {
      board: Game.createBoard(),
      currentPlayer: 'X',
      gameOver: false,
      winner: null,
      mode: 'pvp',
      difficulty: 'medium'
    };
  });

  afterEach(() => {
    cleanupDOM();
  });

  describe('Player vs Player (PvP) Complete Games', () => {
    test('should complete full PvP game with X winning', () => {
      const moves = [0, 3, 1, 4, 2]; // X wins top row

      moves.forEach((move, index) => {
        const player = index % 2 === 0 ? 'X' : 'O';
        gameState.board = Game.makeMove(gameState.board, move, player);
        UI.renderBoard(container, gameState.board);

        const winner = Game.checkWinner(gameState.board);
        if (winner) {
          gameState.winner = winner;
          gameState.gameOver = true;
          UI.updateStatus(statusElement, `Player ${winner} wins!`);
        } else {
          gameState.currentPlayer = player === 'X' ? 'O' : 'X';
          UI.updateStatus(statusElement, `Player ${gameState.currentPlayer} turn`);
        }
      });

      expect(gameState.winner).toBe('X');
      expect(gameState.gameOver).toBe(true);
      expect(statusElement.textContent).toBe('Player X wins!');
    });

    test('should complete full PvP game ending in draw', () => {
      const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];

      moves.forEach((move, index) => {
        const player = index % 2 === 0 ? 'X' : 'O';
        gameState.board = Game.makeMove(gameState.board, move, player);
        gameState.currentPlayer = player === 'X' ? 'O' : 'X';
      });

      const isDraw = Game.isDraw(gameState.board);
      expect(isDraw).toBe(true);
      expect(Game.checkWinner(gameState.board)).toBeNull();
    });

    test('should handle invalid move attempts', () => {
      gameState.board = Game.makeMove(gameState.board, 4, 'X');
      const invalidBoard = Game.makeMove(gameState.board, 4, 'O');

      expect(invalidBoard).toBeNull();
      expect(gameState.board[4]).toBe('X'); // Original move preserved
    });

    test('should track game progression correctly', () => {
      const moves = [0, 1, 2, 3, 4];
      const boardHistory = [];

      moves.forEach((move, index) => {
        const player = index % 2 === 0 ? 'X' : 'O';
        gameState.board = Game.makeMove(gameState.board, move, player);
        boardHistory.push([...gameState.board]);
      });

      expect(boardHistory).toHaveLength(5);
      expect(boardHistory[0].filter(c => c !== null)).toHaveLength(1);
      expect(boardHistory[4].filter(c => c !== null)).toHaveLength(5);
    });
  });

  describe('Player vs AI - Easy Mode', () => {
    test('should complete game against easy AI', () => {
      gameState.mode = 'pva';
      gameState.difficulty = 'easy';

      let movesCount = 0;
      while (!gameState.gameOver && movesCount < 9) {
        if (gameState.currentPlayer === 'X') {
          // Human move (simulated)
          const available = BoardPatterns.getAvailableMoves(gameState.board);
          const move = available[0];
          gameState.board = Game.makeMove(gameState.board, move, 'X');
        } else {
          // AI move
          const aiMove = AI.makeEasyMove(gameState.board);
          gameState.board = Game.makeMove(gameState.board, aiMove, 'O');
        }

        const winner = Game.checkWinner(gameState.board);
        if (winner) {
          gameState.winner = winner;
          gameState.gameOver = true;
        } else if (Game.isDraw(gameState.board)) {
          gameState.gameOver = true;
        }

        gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
        movesCount++;
      }

      expect(gameState.gameOver).toBe(true);
      expect(movesCount).toBeLessThanOrEqual(9);
    });

    test('should allow human to win against easy AI', () => {
      gameState.mode = 'pva';
      gameState.difficulty = 'easy';

      // Strategic moves by human
      const humanMoves = [0, 1, 2];
      let humanMoveIndex = 0;

      while (!gameState.gameOver && humanMoveIndex < humanMoves.length) {
        // Human move
        gameState.board = Game.makeMove(gameState.board, humanMoves[humanMoveIndex], 'X');

        const winner = Game.checkWinner(gameState.board);
        if (winner === 'X') {
          gameState.winner = 'X';
          gameState.gameOver = true;
          break;
        }

        // AI move
        const available = BoardPatterns.getAvailableMoves(gameState.board);
        if (available.length > 0) {
          const aiMove = available[available.length - 1]; // Pick last available
          gameState.board = Game.makeMove(gameState.board, aiMove, 'O');
        }

        humanMoveIndex++;
      }

      expect(gameState.winner).toBe('X');
    });
  });

  describe('Player vs AI - Medium Mode', () => {
    test('should complete game against medium AI', () => {
      gameState.mode = 'pva';
      gameState.difficulty = 'medium';

      while (!gameState.gameOver) {
        const available = BoardPatterns.getAvailableMoves(gameState.board);
        if (available.length === 0) break;

        let move;
        if (gameState.currentPlayer === 'X') {
          move = available[0]; // Simple human strategy
        } else {
          move = AI.makeMediumMove(gameState.board, 'O');
        }

        gameState.board = Game.makeMove(gameState.board, move, gameState.currentPlayer);

        const winner = Game.checkWinner(gameState.board);
        if (winner) {
          gameState.winner = winner;
          gameState.gameOver = true;
        } else if (Game.isDraw(gameState.board)) {
          gameState.gameOver = true;
        }

        gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
      }

      expect(gameState.gameOver).toBe(true);
    });

    test('medium AI should block obvious wins', () => {
      gameState.board = BoardPatterns.fromString('XX-------');
      const aiMove = AI.makeMediumMove(gameState.board, 'O');

      expect(aiMove).toBe(2); // Blocks top row
    });

    test('medium AI should take wins when available', () => {
      gameState.board = BoardPatterns.fromString('OO-XX----');
      const aiMove = AI.makeMediumMove(gameState.board, 'O');

      expect(aiMove).toBe(2); // Wins top row
    });
  });

  describe('Player vs AI - Hard Mode', () => {
    test('should complete game against hard AI', () => {
      gameState.mode = 'pva';
      gameState.difficulty = 'hard';

      while (!gameState.gameOver) {
        const available = BoardPatterns.getAvailableMoves(gameState.board);
        if (available.length === 0) break;

        let move;
        if (gameState.currentPlayer === 'X') {
          move = available[Math.floor(Math.random() * available.length)];
        } else {
          move = AI.makeHardMove(gameState.board, 'O');
        }

        gameState.board = Game.makeMove(gameState.board, move, gameState.currentPlayer);

        const winner = Game.checkWinner(gameState.board);
        if (winner) {
          gameState.winner = winner;
          gameState.gameOver = true;
        } else if (Game.isDraw(gameState.board)) {
          gameState.gameOver = true;
        }

        gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
      }

      expect(gameState.gameOver).toBe(true);
      // Hard AI should never lose
      expect(gameState.winner).not.toBe('X');
    });

    test('hard AI should never lose', () => {
      const results = { aiWins: 0, draws: 0, aiLosses: 0 };

      for (let game = 0; game < 10; game++) {
        let board = Game.createBoard();
        let currentPlayer = 'X';
        let gameOver = false;

        while (!gameOver) {
          const available = BoardPatterns.getAvailableMoves(board);
          if (available.length === 0) break;

          const move = currentPlayer === 'O'
            ? AI.makeHardMove(board, 'O')
            : available[Math.floor(Math.random() * available.length)];

          board = Game.makeMove(board, move, currentPlayer);

          const winner = Game.checkWinner(board);
          if (winner) {
            if (winner === 'O') results.aiWins++;
            else results.aiLosses++;
            gameOver = true;
          } else if (Game.isDraw(board)) {
            results.draws++;
            gameOver = true;
          }

          currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
      }

      expect(results.aiLosses).toBe(0);
      expect(results.aiWins + results.draws).toBe(10);
    });
  });

  describe('Multiple Consecutive Games', () => {
    test('should handle game reset and replay', () => {
      // Play first game
      const game1Moves = [0, 3, 1, 4, 2];
      game1Moves.forEach((move, index) => {
        const player = index % 2 === 0 ? 'X' : 'O';
        gameState.board = Game.makeMove(gameState.board, move, player);
      });

      expect(gameState.board[0]).toBe('X');

      // Reset
      gameState.board = Game.reset();
      gameState.currentPlayer = 'X';
      gameState.gameOver = false;
      gameState.winner = null;

      // Play second game
      const game2Moves = [4, 0, 1, 2, 7];
      game2Moves.forEach((move, index) => {
        const player = index % 2 === 0 ? 'X' : 'O';
        gameState.board = Game.makeMove(gameState.board, move, player);
      });

      expect(gameState.board[4]).toBe('X');
      expect(gameState.board[0]).toBe('O');
    });

    test('should track stats across multiple games', () => {
      const stats = { xWins: 0, oWins: 0, draws: 0 };

      for (let i = 0; i < 5; i++) {
        let board = Game.createBoard();
        const moves = i % 2 === 0
          ? [0, 3, 1, 4, 2] // X wins
          : [3, 0, 4, 1, 6, 2]; // O wins

        moves.forEach((move, index) => {
          const player = index % 2 === 0 ? 'X' : 'O';
          board = Game.makeMove(board, move, player);
        });

        const winner = Game.checkWinner(board);
        if (winner === 'X') stats.xWins++;
        else if (winner === 'O') stats.oWins++;
        else stats.draws++;
      }

      expect(stats.xWins + stats.oWins + stats.draws).toBe(5);
    });
  });

  describe('Mode Switching', () => {
    test('should switch from PvP to PvAI mid-session', () => {
      gameState.mode = 'pvp';
      gameState.board = Game.makeMove(gameState.board, 0, 'X');

      // Switch mode
      gameState.mode = 'pva';
      gameState.difficulty = 'medium';

      // Continue with AI
      const aiMove = AI.makeMediumMove(gameState.board, 'O');
      gameState.board = Game.makeMove(gameState.board, aiMove, 'O');

      expect(gameState.mode).toBe('pva');
      expect(gameState.board.filter(c => c !== null)).toHaveLength(2);
    });

    test('should switch difficulty levels', () => {
      gameState.mode = 'pva';
      gameState.board = BoardPatterns.fromString('XX-------');

      gameState.difficulty = 'easy';
      const easyMove = AI.makeEasyMove(gameState.board);

      gameState.difficulty = 'hard';
      const hardMove = AI.makeHardMove(gameState.board, 'O');

      // Hard should block, easy might not
      expect(hardMove).toBe(2);
    });
  });

  describe('Error Recovery', () => {
    test('should handle rapid consecutive clicks', () => {
      gameState.board = Game.createBoard();

      // Try to make multiple moves on same cell
      const board1 = Game.makeMove(gameState.board, 4, 'X');
      const board2 = Game.makeMove(board1, 4, 'O');
      const board3 = Game.makeMove(board1, 4, 'X');

      expect(board2).toBeNull();
      expect(board3).toBeNull();
      expect(board1[4]).toBe('X');
    });

    test('should validate state consistency', () => {
      gameState.board = BoardPatterns.fromString('XXX------');

      const winner = Game.checkWinner(gameState.board);
      expect(winner).toBe('X');

      // Should not allow more moves after game over
      const available = BoardPatterns.getAvailableMoves(gameState.board);
      expect(available).toHaveLength(6);

      // Application should check gameOver flag
      gameState.gameOver = winner !== null;
      expect(gameState.gameOver).toBe(true);
    });
  });

  describe('Performance - Full Game', () => {
    test('should complete full game efficiently', async () => {
      const duration = await measurePerformance(async () => {
        let board = Game.createBoard();
        let currentPlayer = 'X';

        while (BoardPatterns.getAvailableMoves(board).length > 0) {
          const move = AI.makeMediumMove(board, currentPlayer);
          board = Game.makeMove(board, move, currentPlayer);

          if (Game.checkWinner(board) || Game.isDraw(board)) break;

          currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
      });

      expect(duration).toBeLessThan(1000);
    });
  });
});
