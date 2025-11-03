/**
 * Jest Configuration for Tic Tac Toe Game
 * Comprehensive test suite configuration with coverage reporting
 */

module.exports = {
  // Test environment
  testEnvironment: 'jsdom',

  // Root directory
  rootDir: '../',

  // Test match patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],

  // Coverage configuration
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },

  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json'
  ],

  // Coverage directory
  coverageDirectory: '<rootDir>/coverage',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Module paths
  modulePaths: ['<rootDir>/src'],

  // Transform files
  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/'
  ],

  // Verbose output
  verbose: true,

  // Test timeout
  testTimeout: 10000,

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Error handling
  bail: false,

  // Globals
  globals: {
    'NODE_ENV': 'test'
  }
};
