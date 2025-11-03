/**
 * @fileoverview Utility functions and constants for Tic Tac Toe game
 * @module utils
 */

/**
 * Game constants
 * @const {Object}
 */
export const GAME_CONSTANTS = {
  BOARD_SIZE: 3,
  PLAYER_X: 'X',
  PLAYER_O: 'O',
  EMPTY_CELL: '',
  STATUS_PLAYING: 'playing',
  STATUS_WIN: 'win',
  STATUS_DRAW: 'draw'
};

/**
 * Winning combinations for a 3x3 Tic Tac Toe board
 * @const {number[][]}
 */
export const WINNING_COMBINATIONS = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6]
];

/**
 * Validates if a position is within board bounds
 * @param {number} row - Row index (0-2)
 * @param {number} col - Column index (0-2)
 * @returns {boolean} True if position is valid
 */
export const isValidPosition = (row, col) => {
  return (
    Number.isInteger(row) &&
    Number.isInteger(col) &&
    row >= 0 &&
    row < GAME_CONSTANTS.BOARD_SIZE &&
    col >= 0 &&
    col < GAME_CONSTANTS.BOARD_SIZE
  );
};

/**
 * Converts 2D coordinates (row, col) to 1D array index
 * @param {number} row - Row index (0-2)
 * @param {number} col - Column index (0-2)
 * @returns {number} 1D array index (0-8)
 * @throws {Error} If position is invalid
 */
export const coordinatesToIndex = (row, col) => {
  if (!isValidPosition(row, col)) {
    throw new Error(`Invalid position: row=${row}, col=${col}`);
  }
  return row * GAME_CONSTANTS.BOARD_SIZE + col;
};

/**
 * Converts 1D array index to 2D coordinates (row, col)
 * @param {number} index - 1D array index (0-8)
 * @returns {{row: number, col: number}} 2D coordinates
 * @throws {Error} If index is invalid
 */
export const indexToCoordinates = (index) => {
  if (!Number.isInteger(index) || index < 0 || index >= GAME_CONSTANTS.BOARD_SIZE ** 2) {
    throw new Error(`Invalid index: ${index}`);
  }
  return {
    row: Math.floor(index / GAME_CONSTANTS.BOARD_SIZE),
    col: index % GAME_CONSTANTS.BOARD_SIZE
  };
};

/**
 * Creates a deep copy of the board
 * @param {string[]} board - The game board
 * @returns {string[]} Deep copy of the board
 */
export const cloneBoard = (board) => {
  return [...board];
};

/**
 * Checks if a cell is empty
 * @param {string} cell - Cell value
 * @returns {boolean} True if cell is empty
 */
export const isCellEmpty = (cell) => {
  return cell === GAME_CONSTANTS.EMPTY_CELL;
};

/**
 * Validates player symbol
 * @param {string} player - Player symbol
 * @returns {boolean} True if player is valid (X or O)
 */
export const isValidPlayer = (player) => {
  return player === GAME_CONSTANTS.PLAYER_X || player === GAME_CONSTANTS.PLAYER_O;
};

/**
 * Gets the opposite player
 * @param {string} player - Current player (X or O)
 * @returns {string} Opposite player
 * @throws {Error} If player is invalid
 */
export const getOppositePlayer = (player) => {
  if (!isValidPlayer(player)) {
    throw new Error(`Invalid player: ${player}`);
  }
  return player === GAME_CONSTANTS.PLAYER_X
    ? GAME_CONSTANTS.PLAYER_O
    : GAME_CONSTANTS.PLAYER_X;
};

/**
 * Creates an empty board
 * @returns {string[]} Empty board array
 */
export const createEmptyBoard = () => {
  return Array(GAME_CONSTANTS.BOARD_SIZE ** 2).fill(GAME_CONSTANTS.EMPTY_CELL);
};

/**
 * Counts empty cells on the board
 * @param {string[]} board - The game board
 * @returns {number} Number of empty cells
 */
export const countEmptyCells = (board) => {
  return board.filter(cell => isCellEmpty(cell)).length;
};

/**
 * Logger utility for game events
 * @class
 */
export class Logger {
  /**
   * @param {boolean} enabled - Enable/disable logging
   */
  constructor(enabled = false) {
    this.enabled = enabled;
  }

  /**
   * Logs an info message
   * @param {string} message - Message to log
   * @param {*} data - Additional data to log
   */
  info(message, data = null) {
    if (this.enabled) {
      console.log(`[INFO] ${message}`, data !== null ? data : '');
    }
  }

  /**
   * Logs a warning message
   * @param {string} message - Message to log
   * @param {*} data - Additional data to log
   */
  warn(message, data = null) {
    if (this.enabled) {
      console.warn(`[WARN] ${message}`, data !== null ? data : '');
    }
  }

  /**
   * Logs an error message
   * @param {string} message - Message to log
   * @param {Error} error - Error object
   */
  error(message, error = null) {
    if (this.enabled) {
      console.error(`[ERROR] ${message}`, error !== null ? error : '');
    }
  }

  /**
   * Enables logging
   */
  enable() {
    this.enabled = true;
  }

  /**
   * Disables logging
   */
  disable() {
    this.enabled = false;
  }
}

/**
 * Formats board for console display
 * @param {string[]} board - The game board
 * @returns {string} Formatted board string
 */
export const formatBoardForDisplay = (board) => {
  const rows = [];
  for (let i = 0; i < GAME_CONSTANTS.BOARD_SIZE; i++) {
    const start = i * GAME_CONSTANTS.BOARD_SIZE;
    const row = board.slice(start, start + GAME_CONSTANTS.BOARD_SIZE)
      .map(cell => cell || '-')
      .join(' | ');
    rows.push(row);
  }
  return rows.join('\n' + '-'.repeat(9) + '\n');
};
