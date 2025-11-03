/**
 * Test Helper Utilities
 * Reusable functions for test setup and validation
 */

/**
 * Game state builders
 */
export const GameStateBuilder = {
  empty() {
    return {
      board: Array(9).fill(null),
      currentPlayer: 'X',
      gameOver: false,
      winner: null,
      moves: 0
    };
  },

  withMoves(moves) {
    const state = this.empty();
    moves.forEach((move, index) => {
      if (move !== null) {
        state.board[index] = move;
        state.moves++;
      }
    });
    return state;
  },

  almostWin(player, winPattern = [0, 1, 2]) {
    const state = this.empty();
    state.board[winPattern[0]] = player;
    state.board[winPattern[1]] = player;
    return state;
  },

  winningState(player, winPattern = [0, 1, 2]) {
    const state = this.empty();
    winPattern.forEach(pos => {
      state.board[pos] = player;
    });
    state.winner = player;
    state.gameOver = true;
    return state;
  },

  drawState() {
    return this.withMoves(['X', 'O', 'X', 'O', 'O', 'X', 'O', 'X', 'O']);
  }
};

/**
 * Board pattern helpers
 */
export const BoardPatterns = {
  // All possible winning patterns
  winPatterns: [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ],

  // Strategic positions
  corners: [0, 2, 6, 8],
  edges: [1, 3, 5, 7],
  center: 4,

  // Create board from string pattern
  fromString(pattern) {
    return pattern.split('').map(char => {
      if (char === 'X') return 'X';
      if (char === 'O') return 'O';
      return null;
    });
  },

  // Convert board to string
  toString(board) {
    return board.map(cell => cell || '-').join('');
  },

  // Get available moves
  getAvailableMoves(board) {
    return board
      .map((cell, index) => cell === null ? index : null)
      .filter(index => index !== null);
  },

  // Check if position is taken
  isTaken(board, position) {
    return board[position] !== null;
  }
};

/**
 * AI test helpers
 */
export const AITestHelpers = {
  // Test if AI makes optimal move
  isOptimalMove(board, move, player) {
    const opponent = player === 'X' ? 'O' : 'X';

    // Check if move wins immediately
    const testBoard = [...board];
    testBoard[move] = player;
    if (this.checkWin(testBoard, player)) return true;

    // Check if move blocks opponent win
    for (const winPattern of BoardPatterns.winPatterns) {
      const opponentCells = winPattern.filter(pos => board[pos] === opponent).length;
      const emptyCells = winPattern.filter(pos => board[pos] === null);

      if (opponentCells === 2 && emptyCells.length === 1 && emptyCells[0] === move) {
        return true;
      }
    }

    return false;
  },

  checkWin(board, player) {
    return BoardPatterns.winPatterns.some(pattern =>
      pattern.every(pos => board[pos] === player)
    );
  },

  // Count wins for player in given number of games
  simulateGames(aiFunction, numGames, player = 'O') {
    let wins = 0;
    let draws = 0;
    let losses = 0;

    for (let i = 0; i < numGames; i++) {
      const result = this.playFullGame(aiFunction, player);
      if (result.winner === player) wins++;
      else if (result.winner === null) draws++;
      else losses++;
    }

    return { wins, draws, losses };
  },

  playFullGame(aiFunction, aiPlayer) {
    const board = Array(9).fill(null);
    const humanPlayer = aiPlayer === 'X' ? 'O' : 'X';
    let currentPlayer = 'X';

    while (true) {
      const availableMoves = BoardPatterns.getAvailableMoves(board);
      if (availableMoves.length === 0) {
        return { winner: null, board };
      }

      const move = currentPlayer === aiPlayer
        ? aiFunction(board, currentPlayer)
        : availableMoves[Math.floor(Math.random() * availableMoves.length)];

      board[move] = currentPlayer;

      if (this.checkWin(board, currentPlayer)) {
        return { winner: currentPlayer, board };
      }

      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
  }
};

/**
 * UI test helpers
 */
export const UITestHelpers = {
  // Create mock event
  createClickEvent(element, options = {}) {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      ...options
    });
    return event;
  },

  // Simulate user clicking a cell
  clickCell(cellIndex) {
    const cell = document.querySelector(`[data-cell-index="${cellIndex}"]`);
    if (cell) {
      cell.click();
      return true;
    }
    return false;
  },

  // Get current board state from DOM
  getBoardFromDOM() {
    const cells = document.querySelectorAll('[data-cell-index]');
    return Array.from(cells).map(cell => {
      const text = cell.textContent.trim();
      return text || null;
    });
  },

  // Wait for DOM update
  async waitForDOMUpdate() {
    return new Promise(resolve => setTimeout(resolve, 0));
  },

  // Get status text
  getStatusText() {
    const statusElement = document.getElementById('status');
    return statusElement ? statusElement.textContent : '';
  }
};

/**
 * Performance test helpers
 */
export const PerformanceHelpers = {
  async measure(fn, iterations = 100) {
    const times = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await fn();
      const end = performance.now();
      times.push(end - start);
    }

    return {
      min: Math.min(...times),
      max: Math.max(...times),
      avg: times.reduce((a, b) => a + b, 0) / times.length,
      median: times.sort((a, b) => a - b)[Math.floor(times.length / 2)]
    };
  },

  assertPerformance(duration, maxAllowed, message) {
    expect(duration).toBeLessThan(maxAllowed);
  }
};

/**
 * Mock data generators
 */
export const MockData = {
  randomBoard() {
    const board = Array(9).fill(null);
    const numMoves = Math.floor(Math.random() * 9);

    for (let i = 0; i < numMoves; i++) {
      const availableMoves = BoardPatterns.getAvailableMoves(board);
      if (availableMoves.length === 0) break;

      const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      board[move] = i % 2 === 0 ? 'X' : 'O';
    }

    return board;
  },

  scenarios: {
    xWinsRow0: ['X', 'X', 'X', 'O', 'O', null, null, null, null],
    oWinsCol1: ['X', 'O', 'X', null, 'O', null, null, 'O', null],
    xWinsDiag: ['X', 'O', 'O', null, 'X', null, 'O', null, 'X'],
    draw: ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'],
    almostWinX: ['X', 'X', null, 'O', 'O', null, null, null, null],
    forkOpportunity: ['X', null, null, null, 'O', null, null, null, 'X']
  }
};
