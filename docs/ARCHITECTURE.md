# Tic Tac Toe Game - System Architecture Document

**Version**: 1.0
**Date**: 2025-11-03
**Status**: Approved
**Architect**: System Architecture Designer

---

## 1. Executive Summary

This document outlines the complete system architecture for the Tic Tac Toe game, including module structure, data models, component interactions, and design patterns. The architecture follows clean architecture principles with separation of concerns, ensuring modularity, testability, and maintainability.

---

## 2. Architecture Overview

### 2.1 Architecture Style
- **Pattern**: Model-View-Controller (MVC) variant
- **Paradigm**: Modular JavaScript with functional and object-oriented approaches
- **Communication**: Event-driven with observer pattern
- **State Management**: Centralized game state with immutable updates

### 2.2 Design Principles
1. **Separation of Concerns**: Clear boundaries between game logic, AI, UI, and utilities
2. **Single Responsibility**: Each module has one well-defined purpose
3. **Dependency Inversion**: UI depends on abstractions, not concrete implementations
4. **Open/Closed**: Extensible for new features without modifying core logic
5. **DRY (Don't Repeat Yourself)**: Shared utilities prevent code duplication

---

## 3. System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser Environment                      │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                         UI Layer                            │ │
│  │                        (ui.js)                             │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │ │
│  │  │  Board   │  │ Controls │  │  Status  │  │  Events  │  │ │
│  │  │ Renderer │  │  Panel   │  │ Display  │  │ Handler  │  │ │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │ │
│  └───────┼─────────────┼─────────────┼─────────────┼────────┘ │
│          │             │             │             │           │
│          └─────────────┴─────────────┴─────────────┘           │
│                            │                                    │
│                            ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   Application Layer                        │ │
│  │                      (game.js)                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │ │
│  │  │ Game Manager │  │ State Manager│  │  Win/Draw    │   │ │
│  │  │              │  │              │  │   Detector   │   │ │
│  │  │ - init()     │  │ - makeMove() │  │ - checkWin() │   │ │
│  │  │ - reset()    │  │ - getState() │  │ - checkDraw()│   │ │
│  │  │ - setMode()  │  │ - isValid()  │  │              │   │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │ │
│  └─────────┼──────────────────┼──────────────────┼──────────┘ │
│            │                  │                  │             │
│            │                  ▼                  │             │
│            │         ┌─────────────────┐         │             │
│            │         │   Game State    │         │             │
│            │         │   Data Model    │         │             │
│            │         │  (Centralized)  │         │             │
│            │         └─────────────────┘         │             │
│            │                  │                  │             │
│            ▼                  ▼                  ▼             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      AI Layer                              │ │
│  │                      (ai.js)                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │ │
│  │  │ Easy AI      │  │  Medium AI   │  │   Hard AI    │   │ │
│  │  │ (Random)     │  │ (Heuristic)  │  │  (Minimax)   │   │ │
│  │  │              │  │              │  │              │   │ │
│  │  │ - getMove()  │  │ - getMove()  │  │ - minimax()  │   │ │
│  │  │              │  │ - blockWin() │  │ - evaluate() │   │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            │                                    │
│                            ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Utility Layer                           │ │
│  │                     (utils.js)                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │ │
│  │  │  Constants   │  │  Validators  │  │   Helpers    │   │ │
│  │  │              │  │              │  │              │   │ │
│  │  │ - PLAYERS    │  │ - isValidPos │  │ - deepClone  │   │ │
│  │  │ - WIN_LINES  │  │ - isEmpty    │  │ - getEmpty   │   │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Module Architecture

### 4.1 Module Structure

```
src/
├── js/
│   ├── game.js         # Core game logic and state management
│   ├── ai.js           # AI opponent implementation (all difficulty levels)
│   ├── ui.js           # UI rendering, event handling, DOM manipulation
│   └── utils.js        # Shared utilities, constants, helpers
├── index.html          # Main HTML structure
└── styles.css          # Styling and responsive design
```

### 4.2 Module Dependencies

```
┌──────────┐
│ index.html│
└────┬─────┘
     │ loads
     ▼
┌──────────┐      ┌──────────┐
│  ui.js   │─────▶│ game.js  │
└────┬─────┘      └────┬─────┘
     │ uses            │ uses
     │                 │
     ▼                 ▼
┌──────────┐      ┌──────────┐
│ utils.js │◀─────│  ai.js   │
└──────────┘      └──────────┘
```

**Dependency Rules**:
- `ui.js` depends on `game.js` and `utils.js`
- `game.js` depends on `ai.js` and `utils.js`
- `ai.js` depends on `utils.js`
- `utils.js` has no dependencies (pure utilities)

---

## 5. Data Models

### 5.1 Game State Model

```javascript
/**
 * Central game state object
 * @typedef {Object} GameState
 */
const GameState = {
  // Board representation: 1D array of 9 cells
  // Index mapping: [0,1,2,3,4,5,6,7,8] corresponds to:
  //   0 | 1 | 2
  //   ---------
  //   3 | 4 | 5
  //   ---------
  //   6 | 7 | 8
  board: Array(9).fill(null),        // null | 'X' | 'O'

  // Current player turn
  currentPlayer: 'X',                 // 'X' | 'O'

  // Game mode
  mode: 'pvai',                       // 'pvp' | 'pvai'

  // AI difficulty (if applicable)
  difficulty: 'medium',               // 'easy' | 'medium' | 'hard'

  // Game status
  status: 'active',                   // 'active' | 'won' | 'draw'

  // Winner (if status is 'won')
  winner: null,                       // null | 'X' | 'O'

  // Winning line (if status is 'won')
  winningLine: null,                  // null | [index1, index2, index3]

  // Move counter
  moveCount: 0,                       // 0-9

  // Move history
  history: [],                        // [{player, position, timestamp}]

  // Statistics (optional)
  stats: {
    xWins: 0,
    oWins: 0,
    draws: 0
  }
};
```

### 5.2 Player Model

```javascript
/**
 * Player representation
 * @typedef {Object} Player
 */
const Player = {
  symbol: 'X',                        // 'X' | 'O'
  type: 'human',                      // 'human' | 'ai'
  name: 'Player X'                    // Display name
};
```

### 5.3 Move Model

```javascript
/**
 * Move representation
 * @typedef {Object} Move
 */
const Move = {
  player: 'X',                        // 'X' | 'O'
  position: 4,                        // 0-8 (board index)
  timestamp: Date.now(),              // Unix timestamp
  isValid: true                       // boolean
};
```

### 5.4 AI Decision Model

```javascript
/**
 * AI decision output
 * @typedef {Object} AIDecision
 */
const AIDecision = {
  position: 4,                        // 0-8 (chosen position)
  confidence: 0.95,                   // 0-1 (hard mode only)
  reasoning: 'center_control',        // Strategy used
  alternatives: [0, 2],               // Other considered positions
  evaluationTime: 15                  // milliseconds
};
```

---

## 6. Component Specifications

### 6.1 Game Manager (game.js)

**Responsibilities**:
- Initialize and manage game state
- Validate and execute moves
- Detect win/draw conditions
- Coordinate with AI for computer moves
- Manage game flow and turn switching

**Public API**:
```javascript
class GameManager {
  // Initialization
  constructor(config = {})
  init(mode, difficulty)

  // Game flow
  makeMove(position)
  reset()

  // State access
  getState()
  getCurrentPlayer()
  isGameOver()

  // Configuration
  setMode(mode)
  setDifficulty(difficulty)

  // Validation
  isValidMove(position)
  getAvailableMoves()

  // Win/Draw detection
  checkWin()
  checkDraw()
  findWinningLine()

  // Event emission
  on(event, callback)
  emit(event, data)
}
```

**Events Emitted**:
- `move`: When a move is made
- `gameOver`: When game ends (win or draw)
- `playerChange`: When turn switches
- `stateUpdate`: When state changes
- `error`: When an error occurs

### 6.2 AI Engine (ai.js)

**Responsibilities**:
- Implement three difficulty levels
- Calculate optimal moves
- Evaluate board positions
- Provide move recommendations

**Public API**:
```javascript
class AIEngine {
  constructor(difficulty = 'medium')

  // Main interface
  getMove(board, player)
  setDifficulty(difficulty)

  // Easy mode
  getRandomMove(availableMoves)

  // Medium mode
  getMediumMove(board, player)
  findWinningMove(board, player)
  findBlockingMove(board, player)
  getStrategicMove(board)

  // Hard mode
  getOptimalMove(board, player)
  minimax(board, depth, isMaximizing, alpha, beta)
  evaluate(board, player)

  // Utilities
  simulateMove(board, position, player)
  getAllMoves(board)
}
```

**Algorithm Details**:

1. **Easy Mode**: Random selection
   - Time Complexity: O(1)
   - Approach: Select random from available positions

2. **Medium Mode**: Heuristic-based
   - Time Complexity: O(n) where n = available moves
   - Priority:
     1. Win if possible
     2. Block opponent win
     3. Take center (position 4)
     4. Take corner (0, 2, 6, 8)
     5. Take edge (1, 3, 5, 7)

3. **Hard Mode**: Minimax with Alpha-Beta pruning
   - Time Complexity: O(b^d) optimized to O(b^(d/2))
   - Depth: Full game tree (max 9 moves)
   - Evaluation: +10 (AI win), -10 (player win), 0 (draw)
   - Optimization: Alpha-beta pruning, move ordering

### 6.3 UI Controller (ui.js)

**Responsibilities**:
- Render game board and controls
- Handle user interactions
- Display game status and messages
- Manage responsive layout
- Provide visual feedback

**Public API**:
```javascript
class UIController {
  constructor(gameManager)

  // Initialization
  init()
  bindEvents()

  // Rendering
  render()
  renderBoard(state)
  renderStatus(state)
  renderControls(state)
  highlightWinningLine(positions)

  // Event handlers
  onCellClick(position)
  onResetClick()
  onModeChange(mode)
  onDifficultyChange(difficulty)

  // Visual feedback
  showMessage(message, type)
  animateMove(position, player)
  disableBoard()
  enableBoard()

  // Updates
  updateCell(position, player)
  updateStatus(text)
  updateTurnIndicator(player)
}
```

**DOM Structure**:
```html
<div id="game-container">
  <header class="game-header">
    <h1>Tic Tac Toe</h1>
    <div class="game-controls">
      <select id="mode-selector">
        <option value="pvai">vs AI</option>
        <option value="pvp">vs Player</option>
      </select>
      <select id="difficulty-selector">
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
  </header>

  <div class="game-status">
    <p id="status-text">X's Turn</p>
    <p id="move-counter">Move: 0/9</p>
  </div>

  <div id="game-board" class="board">
    <div class="cell" data-index="0"></div>
    <div class="cell" data-index="1"></div>
    <div class="cell" data-index="2"></div>
    <div class="cell" data-index="3"></div>
    <div class="cell" data-index="4"></div>
    <div class="cell" data-index="5"></div>
    <div class="cell" data-index="6"></div>
    <div class="cell" data-index="7"></div>
    <div class="cell" data-index="8"></div>
  </div>

  <div class="game-actions">
    <button id="reset-btn">New Game</button>
  </div>

  <div class="game-stats">
    <div class="stat">X Wins: <span id="x-wins">0</span></div>
    <div class="stat">O Wins: <span id="o-wins">0</span></div>
    <div class="stat">Draws: <span id="draws">0</span></div>
  </div>
</div>
```

### 6.4 Utilities (utils.js)

**Responsibilities**:
- Define constants and configurations
- Provide validation functions
- Offer helper utilities
- Handle common operations

**Public API**:
```javascript
// Constants
export const PLAYERS = {
  X: 'X',
  O: 'O'
};

export const GAME_MODES = {
  PVP: 'pvp',
  PVAI: 'pvai'
};

export const DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

export const GAME_STATUS = {
  ACTIVE: 'active',
  WON: 'won',
  DRAW: 'draw'
};

// Win condition lines (8 possible winning combinations)
export const WIN_LINES = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal top-left to bottom-right
  [2, 4, 6]  // Diagonal top-right to bottom-left
];

// Position categories for AI strategy
export const POSITIONS = {
  CENTER: [4],
  CORNERS: [0, 2, 6, 8],
  EDGES: [1, 3, 5, 7]
};

// Validation functions
export function isValidPosition(position) {
  return Number.isInteger(position) && position >= 0 && position <= 8;
}

export function isCellEmpty(board, position) {
  return board[position] === null;
}

export function isValidMove(board, position) {
  return isValidPosition(position) && isCellEmpty(board, position);
}

// Board utilities
export function deepCloneBoard(board) {
  return [...board];
}

export function getEmptyCells(board) {
  return board
    .map((cell, index) => cell === null ? index : null)
    .filter(index => index !== null);
}

export function countMoves(board) {
  return board.filter(cell => cell !== null).length;
}

export function isBoardFull(board) {
  return board.every(cell => cell !== null);
}

// Player utilities
export function getOpponent(player) {
  return player === PLAYERS.X ? PLAYERS.O : PLAYERS.X;
}

export function isPlayerValid(player) {
  return player === PLAYERS.X || player === PLAYERS.O;
}

// Win detection utilities
export function checkLine(board, line, player) {
  return line.every(index => board[index] === player);
}

export function findWinningLine(board) {
  for (const line of WIN_LINES) {
    if (checkLine(board, line, PLAYERS.X)) {
      return { player: PLAYERS.X, line };
    }
    if (checkLine(board, line, PLAYERS.O)) {
      return { player: PLAYERS.O, line };
    }
  }
  return null;
}

// Performance utilities
export function measureTime(fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  return { result, time: end - start };
}

// Random utilities
export function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}
```

---

## 7. Data Flow

### 7.1 Move Execution Flow

```
User clicks cell
      │
      ▼
UI captures click event
      │
      ▼
UI calls game.makeMove(position)
      │
      ▼
Game validates move
      │
      ├─── Invalid ──▶ Emit error event ──▶ UI shows error
      │
      ▼ Valid
Game updates state
      │
      ▼
Game checks win/draw
      │
      ├─── Game Over ──▶ Emit gameOver event ──▶ UI shows result
      │
      ▼ Continue
Game switches player
      │
      ▼
Game emits move event
      │
      ▼
UI updates display
      │
      ▼
Is AI turn?
      │
      ├─── No ──▶ Wait for user input
      │
      ▼ Yes
Game calls AI.getMove()
      │
      ▼
AI calculates move
      │
      ▼
AI returns position
      │
      ▼
Loop back to "Game validates move"
```

### 7.2 State Update Flow

```
State Change Trigger
      │
      ▼
Game updates internal state
      │
      ▼
Game emits stateUpdate event
      │
      ▼
UI receives event
      │
      ▼
UI calls game.getState()
      │
      ▼
UI receives current state
      │
      ▼
UI re-renders affected components
      │
      ├─── Update board cells
      ├─── Update status text
      ├─── Update move counter
      └─── Update controls
```

### 7.3 AI Decision Flow

```
AI.getMove(board, player) called
      │
      ▼
Check difficulty level
      │
      ├─── Easy ──▶ Get available moves ──▶ Return random
      │
      ├─── Medium ──▶ Check winning move ──▶ Found? Return it
      │                      │
      │                      ▼ Not found
      │              Check blocking move ──▶ Found? Return it
      │                      │
      │                      ▼ Not found
      │              Check strategic positions ──▶ Return best
      │
      └─── Hard ──▶ Call minimax algorithm
                         │
                         ▼
                 Evaluate all possible moves
                         │
                         ▼
                 Use alpha-beta pruning
                         │
                         ▼
                 Return optimal move
```

---

## 8. API Contracts

### 8.1 Game Manager ↔ UI Controller

```javascript
// UI → Game
interface UIToGame {
  // Initialize game with mode and difficulty
  init(mode: 'pvp' | 'pvai', difficulty: 'easy' | 'medium' | 'hard'): void;

  // Make a move at position
  makeMove(position: number): boolean;

  // Reset game
  reset(): void;

  // Get current state
  getState(): GameState;

  // Change mode/difficulty
  setMode(mode: 'pvp' | 'pvai'): void;
  setDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void;
}

// Game → UI
interface GameToUI {
  // Event: Move made
  on('move', (data: {player: string, position: number}) => void);

  // Event: Game over
  on('gameOver', (data: {status: 'won' | 'draw', winner?: string, line?: number[]}) => void);

  // Event: Player changed
  on('playerChange', (data: {player: string}) => void);

  // Event: State updated
  on('stateUpdate', (state: GameState) => void);

  // Event: Error occurred
  on('error', (error: {message: string, code: string}) => void);
}
```

### 8.2 Game Manager ↔ AI Engine

```javascript
// Game → AI
interface GameToAI {
  // Get AI move for current board state
  getMove(board: Array<string|null>, player: string): number;

  // Update AI difficulty
  setDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void;
}

// AI → Game
interface AIToGame {
  // Returns: position (0-8) where AI wants to move
  getMove(board: Array<string|null>, player: string): number;
}
```

### 8.3 All Modules ↔ Utils

```javascript
// All → Utils
interface ModulesToUtils {
  // Constants (read-only)
  PLAYERS: {X: 'X', O: 'O'};
  WIN_LINES: number[][];
  POSITIONS: {CENTER: number[], CORNERS: number[], EDGES: number[]};

  // Validation
  isValidPosition(position: number): boolean;
  isCellEmpty(board: Array<string|null>, position: number): boolean;
  isValidMove(board: Array<string|null>, position: number): boolean;

  // Board utilities
  deepCloneBoard(board: Array<string|null>): Array<string|null>;
  getEmptyCells(board: Array<string|null>): number[];
  isBoardFull(board: Array<string|null>): boolean;

  // Player utilities
  getOpponent(player: string): string;

  // Win detection
  findWinningLine(board: Array<string|null>): {player: string, line: number[]} | null;
}
```

---

## 9. Design Patterns

### 9.1 Observer Pattern
**Where**: Game Manager ↔ UI Controller
**Purpose**: Decouple game logic from UI rendering
**Implementation**:
```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}

// Usage
game.on('move', (data) => ui.updateBoard(data));
game.on('gameOver', (data) => ui.showGameOver(data));
```

### 9.2 Strategy Pattern
**Where**: AI Engine difficulty levels
**Purpose**: Encapsulate different AI algorithms
**Implementation**:
```javascript
class AIEngine {
  constructor(difficulty) {
    this.strategies = {
      easy: this.getRandomMove,
      medium: this.getMediumMove,
      hard: this.getOptimalMove
    };
    this.setDifficulty(difficulty);
  }

  setDifficulty(difficulty) {
    this.currentStrategy = this.strategies[difficulty];
  }

  getMove(board, player) {
    return this.currentStrategy.call(this, board, player);
  }
}
```

### 9.3 Module Pattern
**Where**: All modules (game.js, ai.js, ui.js, utils.js)
**Purpose**: Encapsulation and namespace management
**Implementation**:
```javascript
// ES6 modules
export class GameManager {
  // Private state
  #state = {};

  // Public methods
  makeMove(position) {
    // Implementation
  }
}

// Import
import { GameManager } from './game.js';
```

### 9.4 Singleton Pattern
**Where**: Game Manager (optional)
**Purpose**: Ensure single game instance
**Implementation**:
```javascript
class GameManager {
  static #instance = null;

  static getInstance() {
    if (!GameManager.#instance) {
      GameManager.#instance = new GameManager();
    }
    return GameManager.#instance;
  }
}
```

### 9.5 Factory Pattern
**Where**: Player creation
**Purpose**: Create player objects with different types
**Implementation**:
```javascript
class PlayerFactory {
  static createPlayer(symbol, type = 'human') {
    return {
      symbol,
      type,
      name: `Player ${symbol}`
    };
  }

  static createAIPlayer(symbol, difficulty) {
    return {
      symbol,
      type: 'ai',
      name: `AI (${difficulty})`,
      difficulty
    };
  }
}
```

---

## 10. Performance Considerations

### 10.1 AI Optimization

**Minimax Optimization**:
- Alpha-beta pruning reduces search space by ~50%
- Move ordering: check center and corners first
- Memoization for repeated board states (optional)
- Maximum depth limit ensures sub-500ms response

**Performance Targets**:
- Easy mode: < 10ms
- Medium mode: < 50ms
- Hard mode: < 200ms (worst case)

### 10.2 UI Optimization

**Rendering**:
- Update only changed cells, not entire board
- Use CSS transitions for smooth animations
- Debounce rapid clicks
- Virtual DOM updates (if framework used)

**Event Handling**:
- Event delegation for board cells
- Passive event listeners where applicable
- Remove event listeners on cleanup

### 10.3 Memory Management

**State Management**:
- Use primitive types where possible
- Clone board state for AI simulation (don't mutate)
- Limit history size to prevent memory growth
- Clear references on game reset

---

## 11. Security Considerations

### 11.1 Input Validation

**Move Validation**:
```javascript
function validateMove(position, board) {
  // Type check
  if (!Number.isInteger(position)) {
    throw new Error('Position must be an integer');
  }

  // Range check
  if (position < 0 || position > 8) {
    throw new Error('Position out of bounds');
  }

  // Occupancy check
  if (board[position] !== null) {
    throw new Error('Cell already occupied');
  }

  return true;
}
```

### 11.2 XSS Prevention

**Safe DOM Updates**:
```javascript
// ✅ Safe: textContent
cell.textContent = player; // 'X' or 'O' only

// ❌ Unsafe: innerHTML with user input
// cell.innerHTML = userInput; // Never do this

// ✅ Safe: setAttribute with validation
if (['X', 'O'].includes(player)) {
  cell.setAttribute('data-player', player);
}
```

### 11.3 State Integrity

**Immutable Updates**:
```javascript
// Don't mutate state directly
// ❌ this.state.board[position] = player;

// Create new state
// ✅ this.state = { ...this.state, board: newBoard };
```

---

## 12. Error Handling

### 12.1 Error Types

```javascript
class GameError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'GameError';
    this.code = code;
  }
}

// Error codes
const ERROR_CODES = {
  INVALID_MOVE: 'INVALID_MOVE',
  GAME_OVER: 'GAME_OVER',
  INVALID_POSITION: 'INVALID_POSITION',
  AI_ERROR: 'AI_ERROR',
  STATE_ERROR: 'STATE_ERROR'
};
```

### 12.2 Error Handling Strategy

```javascript
class GameManager {
  makeMove(position) {
    try {
      // Validate move
      if (!this.isValidMove(position)) {
        throw new GameError(
          'Invalid move: cell occupied or out of bounds',
          ERROR_CODES.INVALID_MOVE
        );
      }

      if (this.isGameOver()) {
        throw new GameError(
          'Cannot make move: game is over',
          ERROR_CODES.GAME_OVER
        );
      }

      // Execute move
      this.#executeMove(position);

    } catch (error) {
      // Emit error event
      this.emit('error', {
        message: error.message,
        code: error.code || 'UNKNOWN'
      });

      // Log for debugging
      console.error('Game error:', error);

      return false;
    }

    return true;
  }
}
```

---

## 13. Testing Strategy

### 13.1 Unit Tests

**Game Logic Tests**:
- Move validation
- Win detection (all 8 lines)
- Draw detection
- Player switching
- State management

**AI Tests**:
- Easy mode randomness
- Medium mode blocking
- Hard mode optimality
- Performance benchmarks

**Utilities Tests**:
- Validation functions
- Board utilities
- Win line detection

### 13.2 Integration Tests

**Game Flow**:
- Complete game scenario (X wins)
- Complete game scenario (O wins)
- Complete game scenario (draw)
- PvP mode
- PvAI mode (all difficulties)

**UI Integration**:
- Click handling
- State synchronization
- Visual updates
- Error display

### 13.3 Test Coverage Goals

- **Overall**: > 80%
- **Critical paths**: 100% (win detection, move validation)
- **AI algorithms**: > 90%
- **UI event handlers**: > 75%

---

## 14. Accessibility

### 14.1 ARIA Labels

```html
<div id="game-board"
     role="grid"
     aria-label="Tic Tac Toe game board">
  <div class="cell"
       role="gridcell"
       tabindex="0"
       aria-label="Cell 1, empty"
       data-index="0"></div>
  <!-- More cells... -->
</div>

<button id="reset-btn"
        aria-label="Start new game">
  New Game
</button>
```

### 14.2 Keyboard Navigation

```javascript
// Keyboard controls
document.addEventListener('keydown', (e) => {
  const focusedCell = document.activeElement;

  if (focusedCell.classList.contains('cell')) {
    const index = parseInt(focusedCell.dataset.index);

    switch(e.key) {
      case 'Enter':
      case ' ':
        game.makeMove(index);
        break;
      case 'ArrowRight':
        focusCell((index + 1) % 9);
        break;
      case 'ArrowLeft':
        focusCell((index - 1 + 9) % 9);
        break;
      // Arrow up/down for row navigation
    }
  }
});
```

### 14.3 Screen Reader Support

```javascript
// Announce moves
function announceMove(player, position) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.textContent = `${player} placed at position ${position + 1}`;
  document.body.appendChild(announcement);

  setTimeout(() => announcement.remove(), 1000);
}
```

---

## 15. Responsive Design

### 15.1 Breakpoints

```css
/* Mobile First Approach */

/* Mobile: 320px - 599px */
.board {
  width: 300px;
  height: 300px;
  grid-template-columns: repeat(3, 100px);
}

.cell {
  width: 100px;
  height: 100px;
  font-size: 2rem;
}

/* Tablet: 600px - 1023px */
@media (min-width: 600px) {
  .board {
    width: 450px;
    height: 450px;
    grid-template-columns: repeat(3, 150px);
  }

  .cell {
    width: 150px;
    height: 150px;
    font-size: 3rem;
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .board {
    width: 600px;
    height: 600px;
    grid-template-columns: repeat(3, 200px);
  }

  .cell {
    width: 200px;
    height: 200px;
    font-size: 4rem;
  }
}
```

### 15.2 Touch Targets

```css
/* Minimum 44px x 44px for touch targets */
.cell {
  min-width: 44px;
  min-height: 44px;
  touch-action: manipulation; /* Prevent double-tap zoom */
}

button {
  min-height: 44px;
  padding: 12px 24px;
}
```

---

## 16. Browser Compatibility

### 16.1 Polyfills

```javascript
// Array.prototype.fill (for older browsers)
if (!Array.prototype.fill) {
  Array.prototype.fill = function(value) {
    return this.map(() => value);
  };
}

// Performance.now (fallback)
if (!window.performance || !window.performance.now) {
  window.performance = { now: () => Date.now() };
}
```

### 16.2 Feature Detection

```javascript
// Check for ES6 class support
const hasClassSupport = (() => {
  try {
    eval('class Test {}');
    return true;
  } catch (e) {
    return false;
  }
})();

if (!hasClassSupport) {
  alert('Your browser does not support this game. Please upgrade.');
}
```

---

## 17. Deployment Architecture

### 17.1 File Structure

```
dist/
├── index.html          # Minified HTML
├── styles.min.css      # Minified CSS
└── js/
    └── bundle.min.js   # All JS bundled and minified
```

### 17.2 Build Process

```javascript
// Build steps:
// 1. Transpile ES6+ to ES5 (Babel)
// 2. Bundle modules (Webpack/Rollup)
// 3. Minify JS (Terser)
// 4. Minify CSS (cssnano)
// 5. Optimize HTML
// 6. Generate source maps
```

### 17.3 Hosting Options

- **Static Hosting**: GitHub Pages, Netlify, Vercel
- **CDN**: Cloudflare, AWS CloudFront
- **Traditional**: Apache, Nginx

---

## 18. Architecture Decision Records (ADRs)

### ADR-001: Board Representation as 1D Array

**Status**: Accepted
**Date**: 2025-11-03

**Context**:
Need to choose data structure for 3x3 game board.

**Decision**:
Use 1D array of 9 elements instead of 2D array.

**Rationale**:
- Simpler iteration and access
- Direct mapping to DOM elements
- Better performance (less nesting)
- Easier serialization

**Consequences**:
- Need helper functions for row/column logic
- Index calculation required for position mapping

---

### ADR-002: Event-Driven Architecture for UI Updates

**Status**: Accepted
**Date**: 2025-11-03

**Context**:
Need to synchronize game state with UI display.

**Decision**:
Use Observer pattern with event emitters.

**Rationale**:
- Decouples game logic from UI
- Allows multiple UI listeners
- Easier testing of game logic
- Follows single responsibility principle

**Consequences**:
- Additional complexity in event management
- Need to handle event cleanup
- Debugging can be more challenging

---

### ADR-003: Minimax with Alpha-Beta Pruning for Hard AI

**Status**: Accepted
**Date**: 2025-11-03

**Context**:
Need optimal AI for "hard" difficulty level.

**Decision**:
Implement minimax algorithm with alpha-beta pruning.

**Rationale**:
- Guarantees optimal play
- Small game tree (9! max states)
- Alpha-beta pruning reduces search time
- Industry-standard approach

**Consequences**:
- More complex than heuristics
- Requires careful implementation
- Always results in draw against perfect play

**Alternatives Considered**:
- Monte Carlo Tree Search (overkill for tic-tac-toe)
- Q-Learning (requires training data)
- Simple heuristics (not truly optimal)

---

### ADR-004: ES6 Modules Over Global Namespace

**Status**: Accepted
**Date**: 2025-11-03

**Context**:
Need to organize JavaScript code into modules.

**Decision**:
Use ES6 import/export modules.

**Rationale**:
- Native browser support in modern browsers
- Better encapsulation
- Tree-shaking for smaller bundles
- Standard approach in modern JS

**Consequences**:
- Requires module bundler for older browsers
- Need to serve with correct MIME type
- Slight overhead for multiple files in dev

---

### ADR-005: CSS Grid for Board Layout

**Status**: Accepted
**Date**: 2025-11-03

**Context**:
Need to layout 3x3 grid for game board.

**Decision**:
Use CSS Grid instead of Flexbox or table.

**Rationale**:
- Perfect for 2D layouts
- Simple grid-template-columns syntax
- Responsive with fr units
- Modern browser support

**Consequences**:
- Need fallback for IE11 (out of scope)
- Learning curve for team members unfamiliar with Grid

---

## 19. Non-Functional Requirements

### 19.1 Performance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial Load | < 2s | Time to interactive |
| Move Response | < 500ms | Click to visual update |
| AI Calculation (Easy) | < 10ms | Algorithm execution |
| AI Calculation (Medium) | < 50ms | Algorithm execution |
| AI Calculation (Hard) | < 200ms | Algorithm execution |
| FPS | 60fps | Animation smoothness |
| Memory Usage | < 10MB | Browser DevTools |

### 19.2 Scalability

**Current Scope**:
- Single game instance
- Local state only
- No backend required

**Future Scalability**:
- Multi-game sessions (localStorage)
- Online multiplayer (WebSocket)
- User accounts (backend integration)
- Leaderboards (database)

### 19.3 Maintainability

**Code Organization**:
- Maximum file size: 500 lines
- Maximum function complexity: O(n²)
- Consistent naming conventions
- JSDoc comments for public APIs

**Documentation**:
- README with setup instructions
- API documentation (JSDoc)
- Architecture diagrams
- ADRs for major decisions

---

## 20. Future Enhancements

### 20.1 Phase 2 Features

1. **Animations**
   - Cell highlight on hover
   - Winning line animation
   - Transition effects

2. **Sound Effects**
   - Move placement sound
   - Win/loss sounds
   - Background music (optional)

3. **Statistics**
   - Win/loss/draw tracking
   - ELO rating system
   - Move history replay

### 20.2 Phase 3 Features

1. **Online Multiplayer**
   - WebSocket integration
   - Matchmaking system
   - Chat functionality

2. **User Accounts**
   - Authentication
   - Profile customization
   - Achievement system

3. **Advanced AI**
   - Neural network opponent
   - Adaptive difficulty
   - Explain AI decisions

### 20.3 Architecture Evolution

**Current**: Monolithic client-side app
**Future**: Distributed architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│  WebSocket  │
│  (React)    │     │   Server    │
└─────────────┘     └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Backend   │
                    │   (Node.js) │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Database   │
                    │ (PostgreSQL)│
                    └─────────────┘
```

---

## 21. Conclusion

This architecture provides a solid foundation for a scalable, maintainable Tic Tac Toe game. Key strengths:

1. **Modularity**: Clear separation of concerns across four modules
2. **Extensibility**: Easy to add new features without breaking existing code
3. **Performance**: Optimized AI with sub-500ms response time
4. **Testability**: Loosely coupled components enable comprehensive testing
5. **Accessibility**: ARIA labels and keyboard navigation included
6. **Responsiveness**: Mobile-first design with three breakpoints

The architecture follows industry best practices and design patterns, ensuring the codebase remains maintainable as new features are added.

---

## 22. References

### 22.1 Technical Resources

- [MDN Web Docs - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Minimax Algorithm](https://en.wikipedia.org/wiki/Minimax)
- [Alpha-Beta Pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning)
- [Observer Pattern](https://refactoring.guru/design-patterns/observer)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

### 22.2 Design Patterns

- Gamma, E., et al. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*
- Fowler, M. (2002). *Patterns of Enterprise Application Architecture*

### 22.3 Accessibility Standards

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

## Appendix A: File Size Estimates

| File | Estimated Size (unminified) | Minified |
|------|----------------------------|----------|
| game.js | ~300 lines (~8KB) | ~3KB |
| ai.js | ~200 lines (~6KB) | ~2KB |
| ui.js | ~250 lines (~7KB) | ~2.5KB |
| utils.js | ~150 lines (~4KB) | ~1.5KB |
| styles.css | ~200 lines (~5KB) | ~2KB |
| **Total** | **~30KB** | **~11KB** |

---

## Appendix B: Browser Support Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| ES6 Classes | 49+ | 45+ | 9+ | 13+ |
| ES6 Modules | 61+ | 60+ | 10.1+ | 16+ |
| CSS Grid | 57+ | 52+ | 10.1+ | 16+ |
| Performance API | 24+ | 15+ | 8+ | 12+ |
| ARIA Support | All | All | All | All |

**Target Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

**Document End**
