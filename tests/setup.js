/**
 * Jest Test Setup
 * Global test configuration and utilities
 */

// Extend Jest matchers
expect.extend({
  toBeValidMove(received, boardSize = 9) {
    const pass =
      typeof received === 'number' &&
      received >= 0 &&
      received < boardSize &&
      Number.isInteger(received);

    return {
      pass,
      message: () =>
        pass
          ? `Expected ${received} not to be a valid move`
          : `Expected ${received} to be a valid move (0-${boardSize - 1})`
    };
  },

  toBeValidBoard(received) {
    const pass =
      Array.isArray(received) &&
      received.length === 9 &&
      received.every(cell => cell === null || cell === 'X' || cell === 'O');

    return {
      pass,
      message: () =>
        pass
          ? `Expected board not to be valid`
          : `Expected valid 3x3 board with null, 'X', or 'O' values`
    };
  },

  toBeWinningPosition(received, player) {
    if (!Array.isArray(received) || received.length !== 9) {
      return {
        pass: false,
        message: () => 'Expected valid board array'
      };
    }

    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    const hasWin = winPatterns.some(pattern =>
      pattern.every(index => received[index] === player)
    );

    return {
      pass: hasWin,
      message: () =>
        hasWin
          ? `Expected board not to have winning position for ${player}`
          : `Expected board to have winning position for ${player}`
    };
  }
});

// Global test utilities
global.createEmptyBoard = () => Array(9).fill(null);

global.createBoardFromPattern = (pattern) => {
  return pattern.split('').map(char => {
    if (char === 'X' || char === 'O') return char;
    if (char === '-' || char === '.') return null;
    return null;
  });
};

global.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

global.mockLocalStorage = () => {
  const storage = {};
  return {
    getItem: jest.fn((key) => storage[key] || null),
    setItem: jest.fn((key, value) => { storage[key] = value; }),
    removeItem: jest.fn((key) => { delete storage[key]; }),
    clear: jest.fn(() => { Object.keys(storage).forEach(key => delete storage[key]); })
  };
};

// Console suppression for cleaner test output
global.suppressConsole = () => {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
};

// Performance timing utilities
global.measurePerformance = async (fn) => {
  const start = performance.now();
  await fn();
  const end = performance.now();
  return end - start;
};

// DOM utilities
global.createMockDOM = () => {
  document.body.innerHTML = `
    <div id="game-container">
      <div id="board"></div>
      <div id="status"></div>
      <select id="mode-selector">
        <option value="pvp">Player vs Player</option>
        <option value="pva">Player vs AI</option>
      </select>
      <select id="difficulty-selector">
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <button id="reset-btn">Reset</button>
    </div>
  `;
};

global.cleanupDOM = () => {
  document.body.innerHTML = '';
};

// Setup and teardown
beforeAll(() => {
  // Global setup
});

afterAll(() => {
  // Global cleanup
});

beforeEach(() => {
  // Reset DOM
  if (typeof document !== 'undefined') {
    document.body.innerHTML = '';
  }
});

afterEach(() => {
  // Cleanup after each test
  jest.clearAllTimers();
});
