# Tic Tac Toe - Comprehensive Test Suite

## Quick Start

### Install Dependencies
```bash
cd /workspaces/codespaces-blank/config
npm install
```

### Run Tests
```bash
npm test                  # Run all tests
npm run test:coverage     # Run with coverage report
npm run test:watch        # Run in watch mode
npm run test:game         # Run game logic tests only
npm run test:ai           # Run AI tests only
npm run test:ui           # Run UI tests only
npm run test:integration  # Run integration tests only
```

## Test Suite Overview

### 📊 Test Statistics
- **Total Test Cases**: 60+
- **Test Files**: 4
- **Coverage Goal**: 80%+
- **Performance**: < 10 seconds total execution

### 📁 File Structure
```
/workspaces/codespaces-blank/
├── config/
│   ├── jest.config.js           # Jest configuration
│   ├── package.json             # Dependencies and scripts
│   └── .babelrc                 # Babel configuration
├── tests/
│   ├── setup.js                 # Global test setup
│   ├── helpers.js               # Test utilities
│   ├── game.test.js             # Game logic tests (25+ tests)
│   ├── ai.test.js               # AI implementation tests (15+ tests)
│   ├── ui.test.js               # UI interaction tests (12+ tests)
│   └── integration.test.js      # Integration tests (10+ tests)
└── docs/
    └── TEST_DOCUMENTATION.md    # Detailed documentation
```

## Test Coverage

### 1. Game Logic Tests (`game.test.js`)
✅ **25+ test cases covering:**
- Board initialization (3 tests)
- Move validation (7 tests)
- Win detection - Rows (4 tests)
- Win detection - Columns (3 tests)
- Win detection - Diagonals (3 tests)
- Win detection - Edge cases (5 tests)
- Draw detection (4 tests)
- Player switching (2 tests)
- Game state management (3 tests)
- Reset functionality (2 tests)
- Edge cases and boundary conditions (6 tests)
- Performance requirements (3 tests)

### 2. AI Implementation Tests (`ai.test.js`)
✅ **15+ test cases covering:**
- Easy mode - Random valid moves (5 tests)
- Medium mode - Strategic play (7 tests)
- Hard mode - Minimax algorithm (8 tests)
- AI performance requirements (4 tests)
- AI consistency and determinism (2 tests)
- AI edge cases (2 tests)

### 3. UI Interaction Tests (`ui.test.js`)
✅ **12+ test cases covering:**
- Board rendering (5 tests)
- Cell click events (4 tests)
- Status display (3 tests)
- Mode selector (4 tests)
- Difficulty selector (4 tests)
- Reset functionality (3 tests)
- Winning cell highlighting (3 tests)
- UI responsiveness (2 tests)

### 4. Integration Tests (`integration.test.js`)
✅ **10+ test cases covering:**
- Player vs Player complete games (4 tests)
- Player vs AI - Easy mode (2 tests)
- Player vs AI - Medium mode (3 tests)
- Player vs AI - Hard mode (2 tests)
- Multiple consecutive games (2 tests)
- Mode switching (2 tests)
- Error recovery (2 tests)
- Performance - Full game (1 test)

## Test Utilities

### Custom Matchers
```javascript
expect(move).toBeValidMove()
expect(board).toBeValidBoard()
expect(board).toBeWinningPosition('X')
```

### Helper Functions
```javascript
// Board creation
createEmptyBoard()
createBoardFromPattern('X-XO-O---')

// Performance testing
measurePerformance(async () => { /* code */ })

// DOM utilities
createMockDOM()
cleanupDOM()
```

### Helper Classes

#### GameStateBuilder
```javascript
GameStateBuilder.empty()
GameStateBuilder.withMoves(['X', 'O', 'X', ...])
GameStateBuilder.almostWin('X', [0, 1, 2])
GameStateBuilder.winningState('X')
GameStateBuilder.drawState()
```

#### BoardPatterns
```javascript
BoardPatterns.winPatterns        // All 8 win patterns
BoardPatterns.corners             // [0, 2, 6, 8]
BoardPatterns.edges               // [1, 3, 5, 7]
BoardPatterns.center              // 4
BoardPatterns.fromString('X-O---X--')
BoardPatterns.getAvailableMoves(board)
```

#### AITestHelpers
```javascript
AITestHelpers.isOptimalMove(board, move, player)
AITestHelpers.checkWin(board, player)
AITestHelpers.simulateGames(aiFunction, numGames)
AITestHelpers.playFullGame(aiFunction, aiPlayer)
```

#### UITestHelpers
```javascript
UITestHelpers.clickCell(4)
UITestHelpers.getBoardFromDOM()
UITestHelpers.getStatusText()
UITestHelpers.waitForDOMUpdate()
```

## Performance Benchmarks

### Game Logic
- ✅ Move validation: < 1ms
- ✅ Win detection: < 1ms
- ✅ 1000 operations: < 100ms

### AI Implementation
- ✅ Easy mode: < 100ms per move
- ✅ Medium mode: < 200ms per move
- ✅ Hard mode: < 500ms per move

### UI Operations
- ✅ Board rendering: < 50ms
- ✅ Status update: < 10ms

## AI Testing Strategy

### Easy Mode
- Generates random valid moves only
- No strategic thinking
- Tests randomness distribution

### Medium Mode
- Wins when possible (priority 1)
- Blocks opponent wins (priority 2)
- Prefers center then corners (priority 3)
- Tests strategic decision-making

### Hard Mode (Minimax)
- Plays optimally using minimax algorithm
- Never loses (draws against perfect play)
- Creates and prevents forks
- Tests algorithmic correctness

## Win Pattern Coverage

All 8 winning patterns are tested:

1. **Rows**: [0,1,2], [3,4,5], [6,7,8]
2. **Columns**: [0,3,6], [1,4,7], [2,5,8]
3. **Diagonals**: [0,4,8], [2,4,6]

## Edge Cases Covered

✅ Empty board operations
✅ Full board handling
✅ Invalid move attempts
✅ Out of bounds indices
✅ Non-integer positions
✅ Rapid consecutive clicks
✅ Immediate wins (3 moves)
✅ Multiple potential wins
✅ Game state after reset
✅ Mode switching mid-game
✅ Last available move
✅ Concurrent operations

## Mock Data Scenarios

```javascript
MockData.scenarios = {
  xWinsRow0: 'XXXOO----',
  oWinsCol1: 'XOX-O--O-',
  xWinsDiag: 'XO-OXO--X',
  draw: 'XOXOXOXOX',
  almostWinX: 'XX-OO----',
  forkOpportunity: 'X---O---X'
}
```

## Test-Driven Development (TDD)

This test suite follows TDD principles:

1. **Tests First**: All tests written before implementation
2. **Red-Green-Refactor**: Tests fail initially, then pass with implementation
3. **Comprehensive Coverage**: Edge cases and performance included
4. **Maintainable**: Well-organized with clear helpers

## Implementation Checklist

To implement the Tic Tac Toe game to pass all tests:

### Game Module (`/src/game.js`)
- [ ] `createBoard()` - Returns array of 9 nulls
- [ ] `makeMove(board, position, player)` - Returns new board or null
- [ ] `checkWinner(board)` - Returns 'X', 'O', or null
- [ ] `isDraw(board)` - Returns boolean
- [ ] `isValidMove(board, position)` - Returns boolean
- [ ] `getAvailableMoves(board)` - Returns array of indices
- [ ] `reset()` - Returns empty board

### AI Module (`/src/ai.js`)
- [ ] `makeEasyMove(board)` - Random valid move
- [ ] `makeMediumMove(board, player)` - Strategic move
- [ ] `makeHardMove(board, player)` - Minimax optimal move

### UI Module (`/src/ui.js`)
- [ ] `renderBoard(container, board)` - Renders board to DOM
- [ ] `updateStatus(statusElement, message)` - Updates status text
- [ ] `getCellElement(index)` - Returns cell DOM element
- [ ] `attachCellClickHandlers(container, callback)` - Attaches events
- [ ] `highlightWinningCells(winPattern)` - Highlights winners
- [ ] `reset(container, statusElement)` - Clears UI

## Running in CI/CD

```bash
npm run test:ci
```

This mode:
- Runs non-interactively
- Generates coverage reports
- Uses limited workers
- Produces JUnit XML output

## Coverage Reports

After running tests with coverage:

```bash
npm run test:coverage
```

View reports:
- **Terminal**: Summary displayed
- **HTML**: `/workspaces/codespaces-blank/coverage/index.html`
- **LCOV**: `/workspaces/codespaces-blank/coverage/lcov.info`

## Debugging Tests

### Run single test file
```bash
npx jest tests/game.test.js
```

### Run specific test
```bash
npx jest -t "should create empty 3x3 board"
```

### Debug mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Best Practices

1. **Fast Tests**: Each test < 100ms
2. **Isolated**: No shared state between tests
3. **Descriptive**: Clear test names
4. **Comprehensive**: Happy path + edge cases
5. **Maintainable**: DRY with helper functions

## Troubleshooting

### "Cannot find module" errors
```bash
cd config && npm install
```

### Tests timeout
Increase timeout in jest.config.js:
```javascript
testTimeout: 20000
```

### Coverage below threshold
Check which files/branches are missing coverage:
```bash
npm run test:coverage -- --verbose
```

## Contributing

When adding new features:

1. Write tests first (TDD)
2. Ensure all tests pass
3. Maintain 80%+ coverage
4. Update documentation
5. Add performance benchmarks

## License

MIT

---

**Total Test Cases**: 60+ tests
**Estimated Implementation Time**: 4-6 hours
**Test Execution Time**: < 10 seconds
**Coverage Target**: 80%+
