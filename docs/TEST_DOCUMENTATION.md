# Tic Tac Toe - Test Suite Documentation

## Overview

Comprehensive test suite for the Tic Tac Toe game with 40+ test cases covering game logic, AI implementation, UI interactions, and full integration scenarios.

## Test Structure

### Test Files

1. **game.test.js** (25+ tests)
   - Board initialization
   - Move validation
   - Win detection (rows, columns, diagonals)
   - Draw detection
   - Player switching
   - Game state management
   - Reset functionality
   - Edge cases and boundary conditions
   - Performance requirements

2. **ai.test.js** (15+ tests)
   - Easy mode: Random valid moves
   - Medium mode: Strategic play (win/block)
   - Hard mode: Minimax optimal play
   - AI performance benchmarks
   - Consistency and determinism
   - Edge case handling

3. **ui.test.js** (12+ tests)
   - Board rendering
   - Cell click events
   - Status display updates
   - Mode selector functionality
   - Difficulty selector functionality
   - Reset functionality
   - Winning cell highlighting
   - UI responsiveness

4. **integration.test.js** (10+ tests)
   - Complete PvP games
   - Complete PvAI games (all difficulties)
   - Win scenarios
   - Draw scenarios
   - Multiple consecutive games
   - Mode switching
   - Error recovery

## Test Coverage Goals

- **Statements**: 80%+
- **Branches**: 80%+
- **Functions**: 80%+
- **Lines**: 80%+

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Specific Test Files
```bash
npm run test:game
npm run test:ai
npm run test:ui
npm run test:integration
```

### CI/CD Mode
```bash
npm run test:ci
```

## Test Utilities

### Custom Matchers

- **toBeValidMove(boardSize)**: Validates move index
- **toBeValidBoard()**: Validates board structure
- **toBeWinningPosition(player)**: Checks winning state

### Global Utilities

- **createEmptyBoard()**: Generate empty board
- **createBoardFromPattern(pattern)**: Create board from string
- **mockLocalStorage()**: Mock storage API
- **measurePerformance(fn)**: Time execution
- **createMockDOM()**: Setup DOM for testing

### Helper Classes

#### GameStateBuilder
```javascript
GameStateBuilder.empty()
GameStateBuilder.withMoves([moves])
GameStateBuilder.almostWin(player)
GameStateBuilder.winningState(player)
GameStateBuilder.drawState()
```

#### BoardPatterns
```javascript
BoardPatterns.winPatterns
BoardPatterns.corners
BoardPatterns.edges
BoardPatterns.center
BoardPatterns.fromString(pattern)
BoardPatterns.getAvailableMoves(board)
```

#### AITestHelpers
```javascript
AITestHelpers.isOptimalMove(board, move, player)
AITestHelpers.checkWin(board, player)
AITestHelpers.simulateGames(aiFunction, numGames)
```

#### UITestHelpers
```javascript
UITestHelpers.clickCell(index)
UITestHelpers.getBoardFromDOM()
UITestHelpers.getStatusText()
```

## Performance Requirements

### Game Logic
- Move validation: < 1ms
- Win detection: < 1ms
- 1000 operations: < 100ms

### AI Implementation
- Easy mode: < 100ms
- Medium mode: < 200ms
- Hard mode: < 500ms

### UI Operations
- Board rendering: < 50ms
- Status update: < 10ms

## Test Scenarios

### Win Patterns (8 total)
1. Top row: [0, 1, 2]
2. Middle row: [3, 4, 5]
3. Bottom row: [6, 7, 8]
4. Left column: [0, 3, 6]
5. Middle column: [1, 4, 7]
6. Right column: [2, 5, 8]
7. Main diagonal: [0, 4, 8]
8. Anti-diagonal: [2, 4, 6]

### AI Difficulty Behaviors

#### Easy
- Generates random valid moves
- No strategic thinking
- Demonstrates randomness

#### Medium
- Wins when possible
- Blocks opponent wins
- Prefers center then corners
- Strategic positioning

#### Hard (Minimax)
- Plays optimally
- Never loses (draws minimum)
- Creates forks when possible
- Prevents opponent forks
- Deterministic for same position

## Mock Data Scenarios

```javascript
MockData.scenarios = {
  xWinsRow0: ['X', 'X', 'X', 'O', 'O', null, null, null, null],
  oWinsCol1: ['X', 'O', 'X', null, 'O', null, null, 'O', null],
  xWinsDiag: ['X', 'O', 'O', null, 'X', null, 'O', null, 'X'],
  draw: ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'],
  almostWinX: ['X', 'X', null, 'O', 'O', null, null, null, null],
  forkOpportunity: ['X', null, null, null, 'O', null, null, null, 'X']
}
```

## Coverage Report

After running `npm run test:coverage`, view detailed HTML report:

```bash
open coverage/index.html
```

## Continuous Integration

The test suite is CI-ready with:
- Deterministic test execution
- No external dependencies
- Fast execution (< 10 seconds)
- Clear pass/fail reporting
- Coverage thresholds enforcement

## Edge Cases Tested

1. Empty board operations
2. Full board handling
3. Invalid move attempts
4. Out of bounds indices
5. Non-integer positions
6. Rapid consecutive clicks
7. Immediate wins (3 moves)
8. Multiple potential wins
9. Game state after reset
10. Mode switching mid-game

## Best Practices

1. **Isolation**: Each test is independent
2. **Fast**: Unit tests < 100ms
3. **Repeatable**: Same results every time
4. **Clear**: Descriptive test names
5. **Coverage**: All critical paths tested
6. **Maintainable**: Well-organized helpers

## Future Enhancements

- Visual regression testing
- Accessibility testing
- Cross-browser compatibility
- Mobile interaction testing
- Network delay simulation (for future online mode)
- Save/load game state testing

## Contributing

When adding new features:

1. Write tests first (TDD)
2. Maintain 80%+ coverage
3. Update test documentation
4. Add performance benchmarks
5. Include edge cases

## License

MIT
