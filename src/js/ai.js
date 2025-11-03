/**
 * AI Player for Tic Tac Toe Game
 * Supports three difficulty levels: easy, medium, and hard
 */

/**
 * AIPlayer class implementing three difficulty levels
 */
class AIPlayer {
  /**
   * Creates an AI player with specified difficulty
   * @param {string} difficulty - The difficulty level ('easy', 'medium', or 'hard')
   * @throws {Error} If difficulty is not valid
   */
  constructor(difficulty = 'medium') {
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(difficulty)) {
      throw new Error(`Invalid difficulty: ${difficulty}. Must be one of: ${validDifficulties.join(', ')}`);
    }
    this.difficulty = difficulty;
  }

  /**
   * Main interface for getting AI move
   * @param {Array<Array<string>>} board - 3x3 game board
   * @param {string} playerSymbol - AI's symbol ('X' or 'O')
   * @param {string} opponentSymbol - Opponent's symbol ('X' or 'O')
   * @returns {{row: number, col: number}} The chosen move
   * @throws {Error} If board is invalid or no moves available
   */
  getMove(board, playerSymbol, opponentSymbol) {
    this._validateBoard(board);
    this._validateSymbols(playerSymbol, opponentSymbol);

    const availableMoves = this._getAvailableMoves(board);

    if (availableMoves.length === 0) {
      throw new Error('No available moves on the board');
    }

    switch (this.difficulty) {
      case 'easy':
        return this._getRandomMove(availableMoves);
      case 'medium':
        return this._getMediumMove(board, playerSymbol, opponentSymbol, availableMoves);
      case 'hard':
        return this._getMiniMaxMove(board, playerSymbol, opponentSymbol);
      default:
        return this._getRandomMove(availableMoves);
    }
  }

  /**
   * Easy mode: Select random valid move
   * @param {Array<{row: number, col: number}>} availableMoves - Array of available positions
   * @returns {{row: number, col: number}} Random move
   * @private
   */
  _getRandomMove(availableMoves) {
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  /**
   * Medium mode: Strategic move selection
   * Strategy priority: Win → Block opponent → Center → Corners → Edges
   * @param {Array<Array<string>>} board - 3x3 game board
   * @param {string} playerSymbol - AI's symbol
   * @param {string} opponentSymbol - Opponent's symbol
   * @param {Array<{row: number, col: number}>} availableMoves - Available positions
   * @returns {{row: number, col: number}} Strategic move
   * @private
   */
  _getMediumMove(board, playerSymbol, opponentSymbol, availableMoves) {
    // Priority 1: Win if possible
    const winningMove = this._findWinningMove(board, playerSymbol, availableMoves);
    if (winningMove) return winningMove;

    // Priority 2: Block opponent's winning move
    const blockingMove = this._findWinningMove(board, opponentSymbol, availableMoves);
    if (blockingMove) return blockingMove;

    // Priority 3: Take center if available
    const centerMove = availableMoves.find(move => move.row === 1 && move.col === 1);
    if (centerMove) return centerMove;

    // Priority 4: Take corners
    const corners = availableMoves.filter(move =>
      (move.row === 0 || move.row === 2) && (move.col === 0 || move.col === 2)
    );
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // Priority 5: Take any available edge
    return this._getRandomMove(availableMoves);
  }

  /**
   * Hard mode: Minimax algorithm with alpha-beta pruning
   * @param {Array<Array<string>>} board - 3x3 game board
   * @param {string} playerSymbol - AI's symbol
   * @param {string} opponentSymbol - Opponent's symbol
   * @returns {{row: number, col: number}} Optimal move
   * @private
   */
  _getMiniMaxMove(board, playerSymbol, opponentSymbol) {
    let bestScore = -Infinity;
    let bestMove = null;

    const availableMoves = this._getAvailableMoves(board);

    for (const move of availableMoves) {
      const newBoard = this._cloneBoard(board);
      newBoard[move.row][move.col] = playerSymbol;

      const score = this._minimax(
        newBoard,
        0,
        false,
        playerSymbol,
        opponentSymbol,
        -Infinity,
        Infinity
      );

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove || availableMoves[0];
  }

  /**
   * Minimax algorithm with alpha-beta pruning
   * @param {Array<Array<string>>} board - Current board state
   * @param {number} depth - Current depth in game tree
   * @param {boolean} isMaximizing - True if maximizing player's turn
   * @param {string} playerSymbol - AI's symbol
   * @param {string} opponentSymbol - Opponent's symbol
   * @param {number} alpha - Alpha value for pruning
   * @param {number} beta - Beta value for pruning
   * @returns {number} Score of the position
   * @private
   */
  _minimax(board, depth, isMaximizing, playerSymbol, opponentSymbol, alpha, beta) {
    const winner = this._checkWinner(board);

    // Terminal states
    if (winner === playerSymbol) {
      return 10 - depth; // Prefer faster wins
    }
    if (winner === opponentSymbol) {
      return depth - 10; // Prefer slower losses
    }
    if (this._isBoardFull(board)) {
      return 0; // Draw
    }

    const availableMoves = this._getAvailableMoves(board);

    if (isMaximizing) {
      let maxScore = -Infinity;

      for (const move of availableMoves) {
        const newBoard = this._cloneBoard(board);
        newBoard[move.row][move.col] = playerSymbol;

        const score = this._minimax(
          newBoard,
          depth + 1,
          false,
          playerSymbol,
          opponentSymbol,
          alpha,
          beta
        );

        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);

        // Alpha-beta pruning
        if (beta <= alpha) {
          break;
        }
      }

      return maxScore;
    } else {
      let minScore = Infinity;

      for (const move of availableMoves) {
        const newBoard = this._cloneBoard(board);
        newBoard[move.row][move.col] = opponentSymbol;

        const score = this._minimax(
          newBoard,
          depth + 1,
          true,
          playerSymbol,
          opponentSymbol,
          alpha,
          beta
        );

        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);

        // Alpha-beta pruning
        if (beta <= alpha) {
          break;
        }
      }

      return minScore;
    }
  }

  /**
   * Find a winning move for the specified symbol
   * @param {Array<Array<string>>} board - Current board state
   * @param {string} symbol - Symbol to check for winning move
   * @param {Array<{row: number, col: number}>} availableMoves - Available positions
   * @returns {{row: number, col: number}|null} Winning move or null
   * @private
   */
  _findWinningMove(board, symbol, availableMoves) {
    for (const move of availableMoves) {
      const testBoard = this._cloneBoard(board);
      testBoard[move.row][move.col] = symbol;

      if (this._checkWinner(testBoard) === symbol) {
        return move;
      }
    }
    return null;
  }

  /**
   * Check if there's a winner on the board
   * @param {Array<Array<string>>} board - Current board state
   * @returns {string|null} Winner symbol or null
   * @private
   */
  _checkWinner(board) {
    // Check rows
    for (let row = 0; row < 3; row++) {
      if (board[row][0] &&
          board[row][0] === board[row][1] &&
          board[row][1] === board[row][2]) {
        return board[row][0];
      }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
      if (board[0][col] &&
          board[0][col] === board[1][col] &&
          board[1][col] === board[2][col]) {
        return board[0][col];
      }
    }

    // Check diagonals
    if (board[0][0] &&
        board[0][0] === board[1][1] &&
        board[1][1] === board[2][2]) {
      return board[0][0];
    }

    if (board[0][2] &&
        board[0][2] === board[1][1] &&
        board[1][1] === board[2][0]) {
      return board[0][2];
    }

    return null;
  }

  /**
   * Get all available moves on the board
   * @param {Array<Array<string>>} board - Current board state
   * @returns {Array<{row: number, col: number}>} Array of available positions
   * @private
   */
  _getAvailableMoves(board) {
    const moves = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (!board[row][col] || board[row][col] === '') {
          moves.push({ row, col });
        }
      }
    }
    return moves;
  }

  /**
   * Check if the board is completely filled
   * @param {Array<Array<string>>} board - Current board state
   * @returns {boolean} True if board is full
   * @private
   */
  _isBoardFull(board) {
    return this._getAvailableMoves(board).length === 0;
  }

  /**
   * Create a deep copy of the board
   * @param {Array<Array<string>>} board - Board to clone
   * @returns {Array<Array<string>>} Cloned board
   * @private
   */
  _cloneBoard(board) {
    return board.map(row => [...row]);
  }

  /**
   * Validate board structure
   * @param {Array<Array<string>>} board - Board to validate
   * @throws {Error} If board is invalid
   * @private
   */
  _validateBoard(board) {
    if (!Array.isArray(board) || board.length !== 3) {
      throw new Error('Board must be a 3x3 array');
    }

    for (const row of board) {
      if (!Array.isArray(row) || row.length !== 3) {
        throw new Error('Each row must contain exactly 3 cells');
      }
    }
  }

  /**
   * Validate player symbols
   * @param {string} playerSymbol - AI's symbol
   * @param {string} opponentSymbol - Opponent's symbol
   * @throws {Error} If symbols are invalid
   * @private
   */
  _validateSymbols(playerSymbol, opponentSymbol) {
    if (!playerSymbol || !opponentSymbol) {
      throw new Error('Player and opponent symbols must be provided');
    }

    if (playerSymbol === opponentSymbol) {
      throw new Error('Player and opponent must have different symbols');
    }
  }
}

// Export for use in other modules (CommonJS and ES6 compatible)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIPlayer;
}

if (typeof window !== 'undefined') {
  window.AIPlayer = AIPlayer;
}
