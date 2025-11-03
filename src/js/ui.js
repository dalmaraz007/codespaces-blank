/**
 * UI Manager for Tic Tac Toe Game
 * Handles all UI rendering, interactions, and visual feedback
 */

// UI Constants
const UI_CONSTANTS = {
    // Selectors
    SELECTORS: {
        GAME_BOARD: '#game-board',
        CELL: '.cell',
        MODE_BUTTONS: '.btn-mode',
        DIFFICULTY_BUTTONS: '.btn-difficulty',
        DIFFICULTY_CONTAINER: '#difficulty-container',
        NEW_GAME_BUTTON: '#new-game-btn',
        CURRENT_PLAYER: '#current-player',
        MOVE_COUNTER: '#move-number',
        GAME_MESSAGE: '#game-message',
        SCORE_X: '#score-x',
        SCORE_O: '#score-o',
        SCORE_DRAWS: '#score-draws',
        SR_ANNOUNCEMENTS: '#sr-announcements'
    },

    // CSS Classes
    CLASSES: {
        CELL: 'cell',
        CELL_X: 'cell-x',
        CELL_O: 'cell-o',
        CELL_WINNING: 'winning-cell',
        CELL_DISABLED: 'disabled',
        ACTIVE: 'active',
        BOARD_DISABLED: 'board-disabled',
        PLAYER_X: 'player-x',
        PLAYER_O: 'player-o',
        MESSAGE_WINNER: 'message-winner',
        MESSAGE_DRAW: 'message-draw',
        MESSAGE_TURN: 'message-turn'
    },

    // Symbols
    SYMBOLS: {
        X: 'X',
        O: 'O',
        EMPTY: ''
    },

    // Game Modes
    MODES: {
        PVP: 'pvp',
        PVAI: 'pvai'
    },

    // AI Difficulty
    DIFFICULTY: {
        EASY: 'easy',
        MEDIUM: 'medium',
        HARD: 'hard'
    }
};

/**
 * UIManager Class
 * Manages all UI-related functionality for the game
 */
class UIManager {
    constructor() {
        this.board = null;
        this.currentPlayer = UI_CONSTANTS.SYMBOLS.X;
        this.gameMode = UI_CONSTANTS.MODES.PVP;
        this.aiDifficulty = UI_CONSTANTS.DIFFICULTY.MEDIUM;
        this.moveCount = 0;
        this.isGameActive = true;
        this.scores = {
            x: 0,
            o: 0,
            draws: 0
        };

        // DOM Elements cache
        this.elements = {};

        this.init();
    }

    /**
     * Initialize the UI Manager
     */
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.initializeBoard();
        this.renderBoard();
        this.renderGameStatus();
        this.loadScoresFromStorage();
    }

    /**
     * Cache DOM elements for performance
     */
    cacheElements() {
        this.elements = {
            gameBoard: document.querySelector(UI_CONSTANTS.SELECTORS.GAME_BOARD),
            cells: document.querySelectorAll(UI_CONSTANTS.SELECTORS.CELL),
            modeButtons: document.querySelectorAll(UI_CONSTANTS.SELECTORS.MODE_BUTTONS),
            difficultyButtons: document.querySelectorAll(UI_CONSTANTS.SELECTORS.DIFFICULTY_BUTTONS),
            difficultyContainer: document.querySelector(UI_CONSTANTS.SELECTORS.DIFFICULTY_CONTAINER),
            newGameButton: document.querySelector(UI_CONSTANTS.SELECTORS.NEW_GAME_BUTTON),
            currentPlayerDisplay: document.querySelector(UI_CONSTANTS.SELECTORS.CURRENT_PLAYER),
            moveCounter: document.querySelector(UI_CONSTANTS.SELECTORS.MOVE_COUNTER),
            gameMessage: document.querySelector(UI_CONSTANTS.SELECTORS.GAME_MESSAGE),
            scoreX: document.querySelector(UI_CONSTANTS.SELECTORS.SCORE_X),
            scoreO: document.querySelector(UI_CONSTANTS.SELECTORS.SCORE_O),
            scoreDraws: document.querySelector(UI_CONSTANTS.SELECTORS.SCORE_DRAWS),
            srAnnouncements: document.querySelector(UI_CONSTANTS.SELECTORS.SR_ANNOUNCEMENTS)
        };
    }

    /**
     * Initialize empty board
     */
    initializeBoard() {
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Cell click handlers
        this.elements.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
            cell.addEventListener('keydown', (e) => this.handleCellKeydown(e));
        });

        // Mode selector
        this.setupModeSelector();

        // Difficulty selector
        this.setupDifficultySelector();

        // New game button
        this.elements.newGameButton.addEventListener('click', () => this.resetGame());

        // Keyboard navigation for board
        this.setupKeyboardNavigation();
    }

    /**
     * Setup mode selector logic
     */
    setupModeSelector() {
        this.elements.modeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.gameMode = mode;

                // Update active state
                this.elements.modeButtons.forEach(btn => {
                    btn.classList.remove(UI_CONSTANTS.CLASSES.ACTIVE);
                    btn.setAttribute('aria-checked', 'false');
                });
                e.target.classList.add(UI_CONSTANTS.CLASSES.ACTIVE);
                e.target.setAttribute('aria-checked', 'true');

                // Show/hide difficulty selector
                if (mode === UI_CONSTANTS.MODES.PVAI) {
                    this.elements.difficultyContainer.style.display = 'block';
                } else {
                    this.elements.difficultyContainer.style.display = 'none';
                }

                // Reset game
                this.resetGame();

                // Announce to screen readers
                this.announceToScreenReader(`Game mode changed to ${mode === 'pvp' ? 'Player versus Player' : 'Player versus AI'}`);
            });
        });
    }

    /**
     * Setup difficulty selector logic
     */
    setupDifficultySelector() {
        this.elements.difficultyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.aiDifficulty = e.target.dataset.difficulty;

                // Update active state
                this.elements.difficultyButtons.forEach(btn => {
                    btn.classList.remove(UI_CONSTANTS.CLASSES.ACTIVE);
                    btn.setAttribute('aria-checked', 'false');
                });
                e.target.classList.add(UI_CONSTANTS.CLASSES.ACTIVE);
                e.target.setAttribute('aria-checked', 'true');

                // Reset game
                this.resetGame();

                // Announce to screen readers
                this.announceToScreenReader(`AI difficulty changed to ${this.aiDifficulty}`);
            });
        });
    }

    /**
     * Handle cell click
     */
    handleCellClick(event) {
        if (!this.isGameActive) return;

        const cell = event.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        // Check if cell is empty
        if (this.board[row][col] !== '') return;

        // Make move
        this.makeMove(row, col);
    }

    /**
     * Handle keyboard navigation for cells
     */
    handleCellKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.handleCellClick(event);
        }
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        this.elements.cells.forEach((cell, index) => {
            cell.addEventListener('keydown', (e) => {
                let targetIndex = index;

                switch(e.key) {
                    case 'ArrowRight':
                        targetIndex = (index + 1) % 9;
                        break;
                    case 'ArrowLeft':
                        targetIndex = (index - 1 + 9) % 9;
                        break;
                    case 'ArrowDown':
                        targetIndex = (index + 3) % 9;
                        break;
                    case 'ArrowUp':
                        targetIndex = (index - 3 + 9) % 9;
                        break;
                    default:
                        return;
                }

                e.preventDefault();
                this.elements.cells[targetIndex].focus();
            });
        });
    }

    /**
     * Make a move
     */
    makeMove(row, col) {
        // Update board state
        this.board[row][col] = this.currentPlayer;
        this.moveCount++;

        // Update UI
        this.updateCellUI(row, col, this.currentPlayer);

        // Check for winner or draw
        const winner = this.checkWinner();
        if (winner) {
            this.displayWinner(winner);
            return;
        }

        if (this.moveCount === 9) {
            this.displayDraw();
            return;
        }

        // Switch player
        this.currentPlayer = this.currentPlayer === UI_CONSTANTS.SYMBOLS.X ?
            UI_CONSTANTS.SYMBOLS.O : UI_CONSTANTS.SYMBOLS.X;

        this.renderGameStatus();

        // AI move in PvAI mode
        if (this.gameMode === UI_CONSTANTS.MODES.PVAI && this.currentPlayer === UI_CONSTANTS.SYMBOLS.O) {
            this.makeAIMove();
        }
    }

    /**
     * Make AI move
     */
    makeAIMove() {
        this.disableBoardWhileAIThinks();

        setTimeout(() => {
            const move = this.getAIMove();
            if (move) {
                this.makeMove(move.row, move.col);
            }
            this.enableBoard();
        }, 300); // Small delay for better UX
    }

    /**
     * Get AI move based on difficulty
     */
    getAIMove() {
        if (this.aiDifficulty === UI_CONSTANTS.DIFFICULTY.EASY) {
            return this.getRandomMove();
        } else if (this.aiDifficulty === UI_CONSTANTS.DIFFICULTY.MEDIUM) {
            // 50% chance of smart move, 50% random
            return Math.random() < 0.5 ? this.getBestMove() : this.getRandomMove();
        } else {
            return this.getBestMove();
        }
    }

    /**
     * Get random available move
     */
    getRandomMove() {
        const available = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (this.board[row][col] === '') {
                    available.push({ row, col });
                }
            }
        }
        return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : null;
    }

    /**
     * Get best move using minimax algorithm
     */
    getBestMove() {
        let bestScore = -Infinity;
        let bestMove = null;

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (this.board[row][col] === '') {
                    this.board[row][col] = UI_CONSTANTS.SYMBOLS.O;
                    const score = this.minimax(this.board, 0, false);
                    this.board[row][col] = '';

                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = { row, col };
                    }
                }
            }
        }

        return bestMove;
    }

    /**
     * Minimax algorithm for AI
     */
    minimax(board, depth, isMaximizing) {
        const winner = this.checkWinner();

        if (winner === UI_CONSTANTS.SYMBOLS.O) return 10 - depth;
        if (winner === UI_CONSTANTS.SYMBOLS.X) return depth - 10;
        if (this.isBoardFull()) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (board[row][col] === '') {
                        board[row][col] = UI_CONSTANTS.SYMBOLS.O;
                        const score = this.minimax(board, depth + 1, false);
                        board[row][col] = '';
                        bestScore = Math.max(score, bestScore);
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (board[row][col] === '') {
                        board[row][col] = UI_CONSTANTS.SYMBOLS.X;
                        const score = this.minimax(board, depth + 1, true);
                        board[row][col] = '';
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    }

    /**
     * Check if board is full
     */
    isBoardFull() {
        return this.board.every(row => row.every(cell => cell !== ''));
    }

    /**
     * Check for winner
     */
    checkWinner() {
        // Check rows
        for (let row = 0; row < 3; row++) {
            if (this.board[row][0] !== '' &&
                this.board[row][0] === this.board[row][1] &&
                this.board[row][1] === this.board[row][2]) {
                this.winningCells = [[row, 0], [row, 1], [row, 2]];
                return this.board[row][0];
            }
        }

        // Check columns
        for (let col = 0; col < 3; col++) {
            if (this.board[0][col] !== '' &&
                this.board[0][col] === this.board[1][col] &&
                this.board[1][col] === this.board[2][col]) {
                this.winningCells = [[0, col], [1, col], [2, col]];
                return this.board[0][col];
            }
        }

        // Check diagonals
        if (this.board[0][0] !== '' &&
            this.board[0][0] === this.board[1][1] &&
            this.board[1][1] === this.board[2][2]) {
            this.winningCells = [[0, 0], [1, 1], [2, 2]];
            return this.board[0][0];
        }

        if (this.board[0][2] !== '' &&
            this.board[0][2] === this.board[1][1] &&
            this.board[1][1] === this.board[2][0]) {
            this.winningCells = [[0, 2], [1, 1], [2, 0]];
            return this.board[0][2];
        }

        return null;
    }

    /**
     * Render the game board
     */
    renderBoard() {
        this.elements.cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const value = this.board[row][col];

            cell.textContent = value;
            cell.className = UI_CONSTANTS.CLASSES.CELL;

            if (value === UI_CONSTANTS.SYMBOLS.X) {
                cell.classList.add(UI_CONSTANTS.CLASSES.CELL_X);
            } else if (value === UI_CONSTANTS.SYMBOLS.O) {
                cell.classList.add(UI_CONSTANTS.CLASSES.CELL_O);
            }

            // Update ARIA label
            const cellNumber = row * 3 + col + 1;
            const status = value ? `occupied by ${value}` : 'empty';
            cell.setAttribute('aria-label', `Cell ${cellNumber}, ${status}`);
        });
    }

    /**
     * Render game status
     */
    renderGameStatus() {
        const playerSymbol = this.currentPlayer === UI_CONSTANTS.SYMBOLS.X ?
            `<span class="player-symbol ${UI_CONSTANTS.CLASSES.PLAYER_X}">X</span>` :
            `<span class="player-symbol ${UI_CONSTANTS.CLASSES.PLAYER_O}">O</span>`;

        this.elements.currentPlayerDisplay.innerHTML = `Current Player: ${playerSymbol}`;
        this.elements.moveCounter.textContent = this.moveCount;
    }

    /**
     * Update single cell UI
     */
    updateCellUI(row, col, symbol) {
        const cellIndex = row * 3 + col;
        const cell = this.elements.cells[cellIndex];

        cell.textContent = symbol;
        cell.classList.add(symbol === UI_CONSTANTS.SYMBOLS.X ?
            UI_CONSTANTS.CLASSES.CELL_X : UI_CONSTANTS.CLASSES.CELL_O);

        // Update ARIA label
        const cellNumber = cellIndex + 1;
        cell.setAttribute('aria-label', `Cell ${cellNumber}, occupied by ${symbol}`);

        // Announce move to screen readers
        this.announceToScreenReader(`${symbol} placed in cell ${cellNumber}`);
    }

    /**
     * Display winner
     */
    displayWinner(player) {
        this.isGameActive = false;

        const message = this.gameMode === UI_CONSTANTS.MODES.PVAI && player === UI_CONSTANTS.SYMBOLS.O ?
            'AI Wins!' : `Player ${player} Wins!`;

        this.elements.gameMessage.textContent = message;
        this.elements.gameMessage.className = `game-message ${UI_CONSTANTS.CLASSES.MESSAGE_WINNER}`;

        // Highlight winning cells
        this.highlightWinningCells(this.winningCells);

        // Update scores
        if (player === UI_CONSTANTS.SYMBOLS.X) {
            this.scores.x++;
        } else {
            this.scores.o++;
        }
        this.updateScoreDisplay();
        this.saveScoresToStorage();

        // Announce to screen readers
        this.announceToScreenReader(message);

        // Disable board
        this.disableBoard();
    }

    /**
     * Display draw
     */
    displayDraw() {
        this.isGameActive = false;

        this.elements.gameMessage.textContent = "It's a Draw!";
        this.elements.gameMessage.className = `game-message ${UI_CONSTANTS.CLASSES.MESSAGE_DRAW}`;

        // Update scores
        this.scores.draws++;
        this.updateScoreDisplay();
        this.saveScoresToStorage();

        // Announce to screen readers
        this.announceToScreenReader("Game ended in a draw");

        // Disable board
        this.disableBoard();
    }

    /**
     * Highlight winning cells
     */
    highlightWinningCells(cells) {
        if (!cells) return;

        cells.forEach(([row, col]) => {
            const cellIndex = row * 3 + col;
            this.elements.cells[cellIndex].classList.add(UI_CONSTANTS.CLASSES.CELL_WINNING);
        });
    }

    /**
     * Disable board while AI thinks
     */
    disableBoardWhileAIThinks() {
        this.elements.gameBoard.classList.add(UI_CONSTANTS.CLASSES.BOARD_DISABLED);
        this.elements.gameMessage.textContent = 'AI is thinking...';
        this.elements.gameMessage.className = `game-message ${UI_CONSTANTS.CLASSES.MESSAGE_TURN}`;
    }

    /**
     * Enable board
     */
    enableBoard() {
        this.elements.gameBoard.classList.remove(UI_CONSTANTS.CLASSES.BOARD_DISABLED);
        this.elements.gameMessage.textContent = '';
    }

    /**
     * Disable board
     */
    disableBoard() {
        this.elements.gameBoard.classList.add(UI_CONSTANTS.CLASSES.BOARD_DISABLED);
        this.elements.cells.forEach(cell => {
            cell.setAttribute('tabindex', '-1');
        });
    }

    /**
     * Reset game
     */
    resetGame() {
        this.initializeBoard();
        this.currentPlayer = UI_CONSTANTS.SYMBOLS.X;
        this.moveCount = 0;
        this.isGameActive = true;
        this.winningCells = null;

        this.elements.gameMessage.textContent = '';
        this.elements.gameMessage.className = 'game-message';

        this.renderBoard();
        this.renderGameStatus();
        this.enableBoard();

        // Reset tabindex
        this.elements.cells.forEach((cell, index) => {
            cell.setAttribute('tabindex', index === 0 ? '0' : '-1');
        });

        // Focus first cell
        this.elements.cells[0].focus();

        // Announce to screen readers
        this.announceToScreenReader('New game started');
    }

    /**
     * Update score display
     */
    updateScoreDisplay() {
        this.elements.scoreX.textContent = this.scores.x;
        this.elements.scoreO.textContent = this.scores.o;
        this.elements.scoreDraws.textContent = this.scores.draws;
    }

    /**
     * Save scores to localStorage
     */
    saveScoresToStorage() {
        localStorage.setItem('tictactoe-scores', JSON.stringify(this.scores));
    }

    /**
     * Load scores from localStorage
     */
    loadScoresFromStorage() {
        const saved = localStorage.getItem('tictactoe-scores');
        if (saved) {
            this.scores = JSON.parse(saved);
            this.updateScoreDisplay();
        }
    }

    /**
     * Announce message to screen readers
     */
    announceToScreenReader(message) {
        if (this.elements.srAnnouncements) {
            this.elements.srAnnouncements.textContent = message;
            setTimeout(() => {
                this.elements.srAnnouncements.textContent = '';
            }, 1000);
        }
    }
}

// Initialize UI Manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new UIManager();
});

export default UIManager;
