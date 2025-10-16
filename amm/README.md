# 🔄 AMM (Automated Market Maker)

A decentralized exchange protocol built on the Stacks blockchain that enables automated token swaps through liquidity pools.

## 📋 Overview

The AMM (Automated Market Maker) is a decentralized exchange protocol that allows users to swap tokens without requiring a traditional order book. Instead, it uses liquidity pools and mathematical formulas to determine token prices automatically.

## ✨ Features

- **Liquidity Pools**: Create and manage token pairs for trading
- **Automated Pricing**: Uses constant product formula (x * y = k) for price discovery
- **Fee Collection**: Earn fees from trading activities
- **Position Management**: Track and manage liquidity provider positions
- **Token Swaps**: Execute token exchanges with minimal slippage

## 🏗️ Architecture

### Smart Contracts

- **`amm.clar`**: Main AMM contract with core functionality
- **`mock-token.clar`**: Test token for development and testing

### Key Functions

- `create-pool`: Create a new liquidity pool for a token pair
- `add-liquidity`: Add tokens to an existing pool
- `remove-liquidity`: Remove tokens from a pool
- `swap`: Execute token swaps
- `get-pool-info`: Query pool information

## 🚀 Getting Started

### Prerequisites

- Clarinet SDK
- Node.js (v18+)
- Basic understanding of AMM concepts

### Installation

```bash
# Navigate to AMM directory
cd amm

# Install dependencies
npm install

# Start Clarinet console
clarinet console
```

### Basic Usage

1. **Create a Pool**
   ```clarity
   (contract-call? .amm create-pool 
     {token-0: .mock-token, token-1: .mock-token-2, fee: u300}
     u1000000
     u2000000
   )
   ```

2. **Add Liquidity**
   ```clarity
   (contract-call? .amm add-liquidity
     pool-id
     u500000
     u1000000
   )
   ```

3. **Execute Swap**
   ```clarity
   (contract-call? .amm swap
     pool-id
     u100000
     u0
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

- Pool creation and management
- Liquidity addition and removal
- Token swapping functionality
- Error handling and edge cases
- Fee calculations

## 📊 Pool Structure

Each liquidity pool contains:

```clarity
{
    token-0: principal,      # First token contract
    token-1: principal,      # Second token contract
    fee: uint,              # Trading fee (basis points)
    liquidity: uint,        # Total liquidity tokens
    balance-0: uint,        # Balance of token-0
    balance-1: uint         # Balance of token-1
}
```

## 💰 Fee Structure

- **Trading Fee**: 0.3% (300 basis points) per swap
- **Liquidity Provider Rewards**: Fees distributed proportionally to LP token holders

## 🔒 Security Features

- **Reentrancy Protection**: Prevents reentrancy attacks
- **Slippage Protection**: Minimum output amount validation
- **Liquidity Validation**: Ensures sufficient liquidity for operations
- **Access Control**: Proper authorization for sensitive operations

## 🌐 Frontend Integration

The AMM includes a React frontend for user interaction:

```bash
# Start frontend development server
cd ../frontend/amm
npm run dev
```

### Frontend Features

- Pool creation interface
- Liquidity management dashboard
- Token swap interface
- Transaction history
- Real-time price updates

## 📈 Performance Metrics

- **Gas Efficiency**: Optimized for minimal transaction costs
- **Slippage**: Low slippage for small to medium trades
- **Liquidity**: Supports high liquidity pools
- **Speed**: Fast transaction execution

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
- `CONTRACT_ADDRESS`: AMM contract address
- `TOKEN_ADDRESSES`: Token contract addresses

### Pool Parameters

- **Minimum Liquidity**: 1000 units
- **Fee Denominator**: 10000 (for basis point calculations)
- **Maximum Slippage**: Configurable per transaction

## 📚 API Reference

### Read-Only Functions

- `get-pool-id`: Get pool identifier
- `get-pool-info`: Get pool information
- `get-position`: Get liquidity provider position
- `calculate-swap-output`: Calculate swap output amount

### Public Functions

- `create-pool`: Create new liquidity pool
- `add-liquidity`: Add liquidity to pool
- `remove-liquidity`: Remove liquidity from pool
- `swap`: Execute token swap

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
- [AMM Concepts](https://docs.uniswap.org/protocol/introduction)

---

**Built with ❤️ on the Stacks blockchain**
