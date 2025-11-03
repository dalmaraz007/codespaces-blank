/**
 * UI Interaction Tests
 * Test suite for user interface components and interactions
 */

import { UITestHelpers, BoardPatterns } from './helpers.js';

// Mock UI module (to be implemented)
const UI = {
  renderBoard: (container, board) => {
    container.innerHTML = '';
    board.forEach((cell, index) => {
      const cellElement = document.createElement('div');
      cellElement.className = 'cell';
      cellElement.setAttribute('data-cell-index', index);
      cellElement.textContent = cell || '';
      container.appendChild(cellElement);
    });
  },

  updateStatus: (statusElement, message) => {
    statusElement.textContent = message;
  },

  getCellElement: (index) => {
    return document.querySelector(`[data-cell-index="${index}"]`);
  },

  attachCellClickHandlers: (container, callback) => {
    const cells = container.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
      cell.addEventListener('click', () => callback(index));
    });
  },

  highlightWinningCells: (winPattern) => {
    winPattern.forEach(index => {
      const cell = UI.getCellElement(index);
      if (cell) cell.classList.add('winning-cell');
    });
  },

  reset: (container, statusElement) => {
    container.innerHTML = '';
    statusElement.textContent = '';
  }
};

describe('UI Interaction Tests', () => {
  let container, statusElement, modeSelector, difficultySelector, resetButton;

  beforeEach(() => {
    createMockDOM();
    container = document.getElementById('board');
    statusElement = document.getElementById('status');
    modeSelector = document.getElementById('mode-selector');
    difficultySelector = document.getElementById('difficulty-selector');
    resetButton = document.getElementById('reset-btn');
  });

  afterEach(() => {
    cleanupDOM();
  });

  describe('Board Rendering', () => {
    test('should render empty board correctly', () => {
      const board = Game.createBoard();
      UI.renderBoard(container, board);

      const cells = container.querySelectorAll('.cell');
      expect(cells).toHaveLength(9);
      expect(Array.from(cells).every(cell => cell.textContent === '')).toBe(true);
    });

    test('should render board with moves', () => {
      const board = BoardPatterns.fromString('X-XO-O---');
      UI.renderBoard(container, board);

      expect(UI.getCellElement(0).textContent).toBe('X');
      expect(UI.getCellElement(1).textContent).toBe('');
      expect(UI.getCellElement(2).textContent).toBe('X');
      expect(UI.getCellElement(3).textContent).toBe('O');
    });

    test('should set correct data attributes', () => {
      const board = Game.createBoard();
      UI.renderBoard(container, board);

      const cells = container.querySelectorAll('.cell');
      cells.forEach((cell, index) => {
        expect(cell.getAttribute('data-cell-index')).toBe(String(index));
      });
    });

    test('should clear previous board before rendering', () => {
      const board1 = BoardPatterns.fromString('XXX------');
      UI.renderBoard(container, board1);

      const board2 = Game.createBoard();
      UI.renderBoard(container, board2);

      const cells = container.querySelectorAll('.cell');
      expect(cells).toHaveLength(9);
      expect(Array.from(cells).every(cell => cell.textContent === '')).toBe(true);
    });

    test('should apply cell class to all cells', () => {
      const board = Game.createBoard();
      UI.renderBoard(container, board);

      const cells = container.querySelectorAll('.cell');
      expect(cells).toHaveLength(9);
      cells.forEach(cell => {
        expect(cell.classList.contains('cell')).toBe(true);
      });
    });
  });

  describe('Cell Click Events', () => {
    test('should trigger callback on cell click', (done) => {
      const board = Game.createBoard();
      UI.renderBoard(container, board);

      UI.attachCellClickHandlers(container, (index) => {
        expect(index).toBe(4);
        done();
      });

      UI.getCellElement(4).click();
    });

    test('should pass correct index to callback', () => {
      const board = Game.createBoard();
      UI.renderBoard(container, board);

      const clickedIndices = [];
      UI.attachCellClickHandlers(container, (index) => {
        clickedIndices.push(index);
      });

      UI.getCellElement(0).click();
      UI.getCellElement(4).click();
      UI.getCellElement(8).click();

      expect(clickedIndices).toEqual([0, 4, 8]);
    });

    test('should handle multiple clicks on same cell', () => {
      const board = Game.createBoard();
      UI.renderBoard(container, board);

      let clickCount = 0;
      UI.attachCellClickHandlers(container, () => {
        clickCount++;
      });

      const cell = UI.getCellElement(4);
      cell.click();
      cell.click();
      cell.click();

      expect(clickCount).toBe(3);
    });

    test('should work for all cells', () => {
      const board = Game.createBoard();
      UI.renderBoard(container, board);

      const clickedCells = new Set();
      UI.attachCellClickHandlers(container, (index) => {
        clickedCells.add(index);
      });

      for (let i = 0; i < 9; i++) {
        UI.getCellElement(i).click();
      }

      expect(clickedCells.size).toBe(9);
    });
  });

  describe('Status Display', () => {
    test('should update status text', () => {
      UI.updateStatus(statusElement, 'Player X turn');
      expect(statusElement.textContent).toBe('Player X turn');
    });

    test('should handle different status messages', () => {
      const messages = [
        'Player X turn',
        'Player O turn',
        'Player X wins!',
        'Draw!',
        'Game Over'
      ];

      messages.forEach(message => {
        UI.updateStatus(statusElement, message);
        expect(statusElement.textContent).toBe(message);
      });
    });

    test('should clear previous status', () => {
      UI.updateStatus(statusElement, 'Old message');
      UI.updateStatus(statusElement, 'New message');
      expect(statusElement.textContent).toBe('New message');
    });
  });

  describe('Mode Selector', () => {
    test('should have PvP option', () => {
      const pvpOption = Array.from(modeSelector.options)
        .find(opt => opt.value === 'pvp');
      expect(pvpOption).toBeDefined();
    });

    test('should have PvA option', () => {
      const pvaOption = Array.from(modeSelector.options)
        .find(opt => opt.value === 'pva');
      expect(pvaOption).toBeDefined();
    });

    test('should change selected mode', () => {
      modeSelector.value = 'pva';
      expect(modeSelector.value).toBe('pva');

      modeSelector.value = 'pvp';
      expect(modeSelector.value).toBe('pvp');
    });

    test('should trigger change event', (done) => {
      modeSelector.addEventListener('change', (e) => {
        expect(e.target.value).toBe('pva');
        done();
      });

      modeSelector.value = 'pva';
      modeSelector.dispatchEvent(new Event('change'));
    });
  });

  describe('Difficulty Selector', () => {
    test('should have easy option', () => {
      const option = Array.from(difficultySelector.options)
        .find(opt => opt.value === 'easy');
      expect(option).toBeDefined();
    });

    test('should have medium option', () => {
      const option = Array.from(difficultySelector.options)
        .find(opt => opt.value === 'medium');
      expect(option).toBeDefined();
    });

    test('should have hard option', () => {
      const option = Array.from(difficultySelector.options)
        .find(opt => opt.value === 'hard');
      expect(option).toBeDefined();
    });

    test('should change difficulty', () => {
      difficultySelector.value = 'hard';
      expect(difficultySelector.value).toBe('hard');

      difficultySelector.value = 'easy';
      expect(difficultySelector.value).toBe('easy');
    });
  });

  describe('Reset Functionality', () => {
    test('should reset board display', () => {
      const board = BoardPatterns.fromString('XOXOXOXOX');
      UI.renderBoard(container, board);

      UI.reset(container, statusElement);
      expect(container.innerHTML).toBe('');
    });

    test('should clear status', () => {
      UI.updateStatus(statusElement, 'Player X wins!');
      UI.reset(container, statusElement);
      expect(statusElement.textContent).toBe('');
    });

    test('should be triggered by reset button', (done) => {
      resetButton.addEventListener('click', () => {
        UI.reset(container, statusElement);
        expect(container.innerHTML).toBe('');
        done();
      });

      resetButton.click();
    });
  });

  describe('Winning Cell Highlighting', () => {
    test('should highlight winning cells', () => {
      const board = Game.createBoard();
      UI.renderBoard(container, board);

      UI.highlightWinningCells([0, 1, 2]);

      expect(UI.getCellElement(0).classList.contains('winning-cell')).toBe(true);
      expect(UI.getCellElement(1).classList.contains('winning-cell')).toBe(true);
      expect(UI.getCellElement(2).classList.contains('winning-cell')).toBe(true);
    });

    test('should only highlight specified cells', () => {
      const board = Game.createBoard();
      UI.renderBoard(container, board);

      UI.highlightWinningCells([0, 4, 8]);

      expect(UI.getCellElement(0).classList.contains('winning-cell')).toBe(true);
      expect(UI.getCellElement(1).classList.contains('winning-cell')).toBe(false);
      expect(UI.getCellElement(4).classList.contains('winning-cell')).toBe(true);
    });

    test('should handle different win patterns', () => {
      BoardPatterns.winPatterns.forEach(pattern => {
        const board = Game.createBoard();
        UI.renderBoard(container, board);

        UI.highlightWinningCells(pattern);

        pattern.forEach(index => {
          expect(UI.getCellElement(index).classList.contains('winning-cell')).toBe(true);
        });
      });
    });
  });

  describe('UI Responsiveness', () => {
    test('should render quickly', async () => {
      const board = Game.createBoard();
      const duration = await measurePerformance(() => {
        UI.renderBoard(container, board);
      });

      expect(duration).toBeLessThan(50);
    });

    test('should update status quickly', async () => {
      const duration = await measurePerformance(() => {
        UI.updateStatus(statusElement, 'Test message');
      });

      expect(duration).toBeLessThan(10);
    });
  });
});
