# 🎮 Blockchain Tic-Tac-Toe

A decentralized tic-tac-toe game built on the Stacks blockchain with betting mechanics and secure gameplay.

## 📋 Overview

The Blockchain Tic-Tac-Toe game allows players to create and join games with STX betting. Players can bet STX tokens, and the winner takes the entire pot. The game is fully decentralized and runs entirely on the blockchain.

## ✨ Features

- **Multiplayer Gaming**: Create and join games with other players
- **STX Betting**: Bet STX tokens on game outcomes
- **Secure Gameplay**: All moves and outcomes are recorded on-chain
- **Winner Determination**: Automatic winner detection and payout
- **Game History**: Track all games and outcomes
- **Fair Play**: Tamper-proof game logic

## 🏗️ Architecture

### Smart Contract

- **`tic-tac-toe.clar`**: Main game contract with core functionality

### Key Functions

- `create-game`: Create a new game with betting
- `join-game`: Join an existing game
- `make-move`: Make a move in the game
- `get-game-info`: Query game information
- `get-game-board`: Get current game board state

## 🚀 Getting Started

### Prerequisites

- Clarinet SDK
- Node.js (v18+)
- Basic understanding of blockchain gaming

### Installation

```bash
# Navigate to Tic-Tac-Toe directory
cd tic-tac-toe

# Install dependencies
npm install

# Start Clarinet console
clarinet console
```

### Basic Usage

1. **Create a Game**
   ```clarity
   (contract-call? .tic-tac-toe create-game
     u1000000  ; bet amount (1 STX in micro-STX)
   )
   ```

2. **Join a Game**
   ```clarity
   (contract-call? .tic-tac-toe join-game
     game-id
   )
   ```

3. **Make a Move**
   ```clarity
   (contract-call? .tic-tac-toe make-move
     game-id
     u4  ; position (0-8)
   )
   ```

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:report

# Watch mode for development
npm run test:watch
```

### Test Coverage

- Game creation and joining
- Move validation and execution
- Winner determination
- Betting and payout logic
- Error handling and edge cases
- Board state management

## 🎯 Game Rules

### Board Layout

```
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

### Game Flow

1. **Player 1** creates a game with a bet amount
2. **Player 2** joins the game (must match bet amount)
3. **Player 1** makes the first move
4. **Player 2** makes the second move
5. **Alternating turns** until game ends
6. **Winner** receives the entire pot

### Winning Conditions

- **Row**: Three in a row horizontally
- **Column**: Three in a column vertically
- **Diagonal**: Three in a diagonal line
- **Draw**: All positions filled with no winner

## 📊 Game Structure

Each game contains:

```clarity
{
    player-one: principal,        # Game creator
    player-two: (optional principal), # Second player
    is-player-one-turn: bool,     # Current turn indicator
    bet-amount: uint,            # Bet amount in micro-STX
    board: (list 9 uint),        # Game board (0=empty, 1=X, 2=O)
    winner: (optional principal) # Game winner
}
```

## 💰 Betting System

### Betting Rules

- **Minimum Bet**: 100 micro-STX (0.0001 STX)
- **Bet Matching**: Second player must match the bet
- **Winner Takes All**: Winner receives the entire pot
- **Draw**: Bet amounts are returned to players

### Payout Logic

```clarity
; Winner gets: (bet-amount * 2) - contract fees
; Draw: Each player gets their bet back
```

## 🔒 Security Features

- **Move Validation**: Prevents invalid moves
- **Turn Enforcement**: Ensures proper turn order
- **Bet Validation**: Prevents insufficient bets
- **Game State Protection**: Prevents tampering
- **Access Control**: Proper authorization for all actions

## 🌐 Frontend Integration

The game includes a React frontend for user interaction:

```bash
# Start frontend development server
cd ../frontend/tic-tac-toe
npm run dev
```

### Frontend Features

- Game creation interface
- Game joining functionality
- Interactive game board
- Move history tracking
- Betting interface
- Winner announcement

## 📈 Performance Metrics

- **Gas Efficiency**: Optimized for minimal transaction costs
- **Game Speed**: Fast move execution
- **Scalability**: Supports multiple concurrent games
- **Reliability**: Secure and tamper-proof gameplay

## 🚀 Deployment

### Testnet Deployment

```bash
# Deploy to Stacks testnet
clarinet deploy --testnet
```

### Mainnet Deployment

```bash
# Deploy to Stacks mainnet
clarinet deploy --mainnet
```

## 🔧 Configuration

### Environment Variables

- `STACKS_NETWORK`: Network configuration (testnet/mainnet)
- `CONTRACT_ADDRESS`: Game contract address
- `MIN_BET_AMOUNT`: Minimum bet amount

### Game Parameters

- **Board Size**: 3x3 grid
- **Maximum Games**: No limit
- **Game Timeout**: No timeout (games persist)
- **Move Validation**: Strict validation rules

## 📚 API Reference

### Read-Only Functions

- `get-game-info`: Get complete game information
- `get-game-board`: Get current board state
- `get-game-count`: Get total number of games
- `is-game-active`: Check if game is still active
- `get-player-games`: Get games for a specific player

### Public Functions

- `create-game`: Create new game with betting
- `join-game`: Join existing game
- `make-move`: Make a move in the game
- `forfeit-game`: Forfeit current game (if implemented)

## 🎮 Game Strategies

### Winning Tips

1. **Center Control**: Take the center position (4) first
2. **Corner Strategy**: Control corners for multiple winning paths
3. **Block Opponent**: Always block opponent's winning moves
4. **Fork Creation**: Create multiple winning opportunities

### Common Patterns

- **Center-Edge**: Center + opposite edges
- **Corner-Corner**: Two corners + center
- **Edge-Edge**: Two edges + center

## 🔍 Game Monitoring

### Game States

- **Waiting**: Game created, waiting for second player
- **Active**: Game in progress
- **Completed**: Game finished with winner
- **Draw**: Game finished with no winner

### Statistics

- **Total Games**: Number of games created
- **Active Games**: Currently running games
- **Completed Games**: Finished games
- **Win Rate**: Player win statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add comprehensive tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Resources

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarity Language Reference](https://docs.stacks.co/references/clarity-language)
- [Blockchain Gaming Concepts](https://docs.axieinfinity.com/)

---

**Built with ❤️ on the Stacks blockchain**
