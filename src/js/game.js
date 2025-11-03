/**
 * @fileoverview Core game logic for Tic Tac Toe
 * @module game
 */

import {
  GAME_CONSTANTS,
  WINNING_COMBINATIONS,
  isValidPosition,
  coordinatesToIndex,
  isCellEmpty,
  isValidPlayer,
  getOppositePlayer,
  createEmptyBoard,
  countEmptyCells,
  Logger
} from './utils.js';

/**
 * GameState class manages the complete state of a Tic Tac Toe game
 * @class
 */
export class GameState {
  /**
   * Creates a new game state
   * @param {boolean} enableLogging - Enable logging for debugging
   */
  constructor(enableLogging = false) {
    this._board = createEmptyBoard();
    this._currentPlayer = GAME_CONSTANTS.PLAYER_X;
    this._gameStatus = GAME_CONSTANTS.STATUS_PLAYING;
    this._winner = null;
    this._winningCombination = null;
    this._moveHistory = [];
    this._logger = new Logger(enableLogging);

    this._logger.info('New game initialized');
  }

  /**
   * Gets the current board state
   * @returns {string[]} Copy of the current board
   */
  getBoard() {
    return [...this._board];
  }

  /**
   * Gets the current player
   * @returns {string} Current player (X or O)
   */
  getCurrentPlayer() {
    return this._currentPlayer;
  }

  /**
   * Gets the game status
   * @returns {string} Game status (playing, win, or draw)
   */
  getGameStatus() {
    return this._gameStatus;
  }

  /**
   * Gets the winner
   * @returns {string|null} Winner (X or O) or null if no winner
   */
  getWinner() {
    return this._winner;
  }

  /**
   * Gets the winning combination
   * @returns {number[]|null} Array of winning indices or null
   */
  getWinningCombination() {
    return this._winningCombination;
  }

  /**
   * Gets the move history
   * @returns {Array<{row: number, col: number, player: string}>} Array of moves
   */
  getMoveHistory() {
    return [...this._moveHistory];
  }

  /**
   * Checks if the game is over
   * @returns {boolean} True if game has ended (win or draw)
   */
  isGameOver() {
    return this._gameStatus !== GAME_CONSTANTS.STATUS_PLAYING;
  }

  /**
   * Validates if a move is legal
   * @param {number} row - Row index (0-2)
   * @param {number} col - Column index (0-2)
   * @returns {{valid: boolean, error: string|null}} Validation result
   * @private
   */
  _validateMove(row, col) {
    // Check if game is already over
    if (this.isGameOver()) {
      return {
        valid: false,
        error: `Game is already over. Status: ${this._gameStatus}`
      };
    }

    // Validate position bounds
    if (!isValidPosition(row, col)) {
      return {
        valid: false,
        error: `Invalid position: row=${row}, col=${col}. Must be 0-2.`
      };
    }

    // Check if cell is already occupied
    const index = coordinatesToIndex(row, col);
    if (!isCellEmpty(this._board[index])) {
      return {
        valid: false,
        error: `Cell at (${row}, ${col}) is already occupied by ${this._board[index]}`
      };
    }

    return { valid: true, error: null };
  }

  /**
   * Makes a move on the board
   * @param {number} row - Row index (0-2)
   * @param {number} col - Column index (0-2)
   * @returns {{success: boolean, error: string|null, gameStatus: string}} Move result
   * @throws {Error} If move validation fails
   */
  makeMove(row, col) {
    const validation = this._validateMove(row, col);

    if (!validation.valid) {
      this._logger.warn('Invalid move attempted', { row, col, error: validation.error });
      throw new Error(validation.error);
    }

    // Execute the move
    const index = coordinatesToIndex(row, col);
    this._board[index] = this._currentPlayer;

    // Record move in history
    this._moveHistory.push({
      row,
      col,
      player: this._currentPlayer,
      moveNumber: this._moveHistory.length + 1
    });

    this._logger.info('Move made', { row, col, player: this._currentPlayer });

    // Check for win condition
    if (this.checkWin()) {
      this._gameStatus = GAME_CONSTANTS.STATUS_WIN;
      this._winner = this._currentPlayer;
      this._logger.info('Game won', { winner: this._winner });

      return {
        success: true,
        error: null,
        gameStatus: this._gameStatus
      };
    }

    // Check for draw condition
    if (this.checkDraw()) {
      this._gameStatus = GAME_CONSTANTS.STATUS_DRAW;
      this._logger.info('Game ended in draw');

      return {
        success: true,
        error: null,
        gameStatus: this._gameStatus
      };
    }

    // Switch to next player
    this.switchPlayer();

    return {
      success: true,
      error: null,
      gameStatus: this._gameStatus
    };
  }

  /**
   * Checks if current player has won
   * @returns {boolean} True if current player has won
   */
  checkWin() {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;

      if (
        this._board[a] !== GAME_CONSTANTS.EMPTY_CELL &&
        this._board[a] === this._board[b] &&
        this._board[a] === this._board[c]
      ) {
        this._winningCombination = combination;
        return true;
      }
    }

    return false;
  }

  /**
   * Checks if the game is a draw
   * @returns {boolean} True if game is a draw (no empty cells and no winner)
   */
  checkDraw() {
    // Game is a draw if board is full and there's no winner
    return countEmptyCells(this._board) === 0 && !this.checkWin();
  }

  /**
   * Switches to the next player
   */
  switchPlayer() {
    this._currentPlayer = getOppositePlayer(this._currentPlayer);
    this._logger.info('Player switched', { currentPlayer: this._currentPlayer });
  }

  /**
   * Resets the game to initial state
   */
  resetGame() {
    this._board = createEmptyBoard();
    this._currentPlayer = GAME_CONSTANTS.PLAYER_X;
    this._gameStatus = GAME_CONSTANTS.STATUS_PLAYING;
    this._winner = null;
    this._winningCombination = null;
    this._moveHistory = [];

    this._logger.info('Game reset');
  }

  /**
   * Gets a cell value at specified position
   * @param {number} row - Row index (0-2)
   * @param {number} col - Column index (0-2)
   * @returns {string} Cell value (X, O, or empty)
   * @throws {Error} If position is invalid
   */
  getCellValue(row, col) {
    if (!isValidPosition(row, col)) {
      throw new Error(`Invalid position: row=${row}, col=${col}`);
    }

    const index = coordinatesToIndex(row, col);
    return this._board[index];
  }

  /**
   * Gets the number of moves made
   * @returns {number} Number of moves
   */
  getMoveCount() {
    return this._moveHistory.length;
  }

  /**
   * Gets available moves (empty cells)
   * @returns {Array<{row: number, col: number, index: number}>} Array of available positions
   */
  getAvailableMoves() {
    const moves = [];

    for (let i = 0; i < this._board.length; i++) {
      if (isCellEmpty(this._board[i])) {
        const row = Math.floor(i / GAME_CONSTANTS.BOARD_SIZE);
        const col = i % GAME_CONSTANTS.BOARD_SIZE;
        moves.push({ row, col, index: i });
      }
    }

    return moves;
  }

  /**
   * Checks if a specific position is available
   * @param {number} row - Row index (0-2)
   * @param {number} col - Column index (0-2)
   * @returns {boolean} True if position is available
   */
  isCellAvailable(row, col) {
    if (!isValidPosition(row, col)) {
      return false;
    }

    const index = coordinatesToIndex(row, col);
    return isCellEmpty(this._board[index]);
  }

  /**
   * Gets game state as a plain object (for serialization)
   * @returns {Object} Game state object
   */
  toJSON() {
    return {
      board: this.getBoard(),
      currentPlayer: this._currentPlayer,
      gameStatus: this._gameStatus,
      winner: this._winner,
      winningCombination: this._winningCombination,
      moveHistory: this.getMoveHistory(),
      moveCount: this.getMoveCount()
    };
  }

  /**
   * Restores game state from a plain object
   * @param {Object} state - Game state object
   * @throws {Error} If state is invalid
   */
  fromJSON(state) {
    if (!state || typeof state !== 'object') {
      throw new Error('Invalid state object');
    }

    if (!Array.isArray(state.board) || state.board.length !== GAME_CONSTANTS.BOARD_SIZE ** 2) {
      throw new Error('Invalid board state');
    }

    if (!isValidPlayer(state.currentPlayer)) {
      throw new Error('Invalid current player');
    }

    this._board = [...state.board];
    this._currentPlayer = state.currentPlayer;
    this._gameStatus = state.gameStatus || GAME_CONSTANTS.STATUS_PLAYING;
    this._winner = state.winner || null;
    this._winningCombination = state.winningCombination || null;
    this._moveHistory = state.moveHistory ? [...state.moveHistory] : [];

    this._logger.info('Game state restored from JSON');
  }
}

export default GameState;
