#!/bin/bash

# Tic Tac Toe Test Suite - Installation and Execution Script
# This script sets up the test environment and runs the test suite

echo "========================================="
echo "Tic Tac Toe Test Suite Setup"
echo "========================================="
echo ""

# Navigate to config directory
cd /workspaces/codespaces-blank/config

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js to run the tests"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing test dependencies..."
echo "-----------------------------------"
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully"
echo ""

# Display test structure
echo "📊 Test Suite Structure:"
echo "-----------------------------------"
echo "Test Files:"
echo "  - game.test.js (25+ tests)"
echo "  - ai.test.js (15+ tests)"
echo "  - ui.test.js (12+ tests)"
echo "  - integration.test.js (10+ tests)"
echo ""
echo "Total: 62+ test cases"
echo ""

# Ask user what to run
echo "What would you like to do?"
echo "-----------------------------------"
echo "1) Run all tests"
echo "2) Run tests with coverage"
echo "3) Run tests in watch mode"
echo "4) Run game logic tests only"
echo "5) Run AI tests only"
echo "6) Run UI tests only"
echo "7) Run integration tests only"
echo "8) Exit"
echo ""
read -p "Enter your choice (1-8): " choice

case $choice in
    1)
        echo ""
        echo "🧪 Running all tests..."
        npm test
        ;;
    2)
        echo ""
        echo "📊 Running tests with coverage..."
        npm run test:coverage
        echo ""
        echo "📄 Coverage report generated at: coverage/index.html"
        ;;
    3)
        echo ""
        echo "👀 Starting watch mode..."
        npm run test:watch
        ;;
    4)
        echo ""
        echo "🎮 Running game logic tests..."
        npm run test:game
        ;;
    5)
        echo ""
        echo "🤖 Running AI tests..."
        npm run test:ai
        ;;
    6)
        echo ""
        echo "🎨 Running UI tests..."
        npm run test:ui
        ;;
    7)
        echo ""
        echo "🔗 Running integration tests..."
        npm run test:integration
        ;;
    8)
        echo ""
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "========================================="
echo "✅ Test execution completed"
echo "========================================="
