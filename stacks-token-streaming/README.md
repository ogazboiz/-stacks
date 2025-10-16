# 💰 Token Streaming System

A decentralized payment streaming system built on the Stacks blockchain that enables continuous, time-based token transfers.

## 📋 Overview

The Token Streaming system allows users to create continuous payment streams where tokens are automatically transferred to recipients over a specified time period. This is particularly useful for salary payments, subscription services, and other recurring payment scenarios.

## ✨ Features

- **Continuous Payments**: Stream tokens over time with automatic distribution
- **Flexible Timeframes**: Set custom start and stop blocks for streams
- **Withdrawal Management**: Recipients can withdraw available tokens at any time
- **Stream Scheduling**: Create streams that start in the future
- **Balance Tracking**: Monitor stream balances and withdrawal history
- **Security**: Secure stream creation and management

## 🏗️ Architecture

### Smart Contract

- **`stream.clar`**: Main streaming contract with core functionality

### Key Functions

- `stream-to`: Create a new payment stream
- `withdraw`: Withdraw available tokens from a stream
- `cancel-stream`: Cancel an active stream (sender only)
- `get-stream-info`: Query stream information
- `get-available-balance`: Check withdrawable balance

## 🚀 Getting Started

### Prerequisites

- Clarinet SDK
- Node.js (v18+)
- Basic understanding of blockchain payments

### Installation

```bash
# Navigate to Token Streaming directory
cd stacks-token-streaming

# Install dependencies
npm install

# Start Clarinet console
clarinet console
```

### Basic Usage

1. **Create a Stream**
   ```clarity
   (contract-call? .stream stream-to
     'ST1RECEIVER123456789012345678901234567890
     u1000000  ; initial balance (1 STX in micro-STX)
     {
       start-block: u1000,
       stop-block: u2000
     }
     u1000     ; payment per block
   )
   ```

2. **Withdraw from Stream**
   ```clarity
   (contract-call? .stream withdraw
     stream-id
   )
   ```

3. **Cancel Stream**
   ```clarity
   (contract-call? .stream cancel-stream
     stream-id
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

- Stream creation and validation
- Token withdrawal functionality
- Stream cancellation
- Balance calculations
- Error handling and edge cases
- Time-based payment logic

## 📊 Stream Structure

Each stream contains:

```clarity
{
    sender: principal,           # Stream creator
    recipient: principal,        # Stream recipient
    balance: uint,              # Total stream balance
    withdrawn-balance: uint,    # Amount already withdrawn
    payment-per-block: uint,    # Tokens per block
    timeframe: {
        start-block: uint,      # Stream start block
        stop-block: uint        # Stream end block
    }
}
```

## 💰 Payment Logic

### Withdrawal Calculation

The available balance for withdrawal is calculated as:

```
available_balance = min(
    (current_block - start_block) * payment_per_block,
    total_balance - withdrawn_balance
)
```

### Example

- **Stream Duration**: 100 blocks
- **Total Balance**: 100,000 tokens
- **Payment per Block**: 1,000 tokens
- **Current Block**: 50 (halfway through)
- **Available**: 50,000 tokens

## 🔒 Security Features

- **Authorization**: Only stream sender can cancel
- **Balance Validation**: Prevents over-withdrawal
- **Time Validation**: Ensures valid timeframes
- **Reentrancy Protection**: Prevents reentrancy attacks

## 🌐 Use Cases

### 1. Salary Payments
- Stream monthly salary over 30 days
- Employees can withdraw as needed
- Automatic distribution

### 2. Subscription Services
- Stream subscription fees
- Continuous access to services
- Flexible withdrawal timing

### 3. Freelance Payments
- Stream project payments
- Milestone-based streaming
- Secure payment delivery

### 4. Investment Returns
- Stream investment profits
- Regular distribution to investors
- Transparent payment tracking

## 📈 Performance Metrics

- **Gas Efficiency**: Optimized for minimal transaction costs
- **Scalability**: Supports multiple concurrent streams
- **Accuracy**: Precise block-based calculations
- **Reliability**: Secure and tamper-proof

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
- `CONTRACT_ADDRESS`: Streaming contract address
- `BLOCK_TIME`: Average block time for calculations

### Stream Parameters

- **Minimum Stream Duration**: 1 block
- **Maximum Stream Duration**: No limit
- **Minimum Payment per Block**: 1 micro-STX
- **Maximum Initial Balance**: No limit

## 📚 API Reference

### Read-Only Functions

- `get-stream-info`: Get complete stream information
- `get-available-balance`: Calculate withdrawable balance
- `get-stream-count`: Get total number of streams
- `is-stream-active`: Check if stream is currently active

### Public Functions

- `stream-to`: Create new payment stream
- `withdraw`: Withdraw available tokens
- `cancel-stream`: Cancel active stream
- `emergency-withdraw`: Emergency withdrawal (if implemented)

## 🔍 Monitoring

### Stream Status

- **Active**: Stream is currently running
- **Completed**: Stream has reached end block
- **Cancelled**: Stream was cancelled by sender
- **Paused**: Stream is temporarily paused (if implemented)

### Balance Tracking

- **Total Balance**: Original stream amount
- **Withdrawn Balance**: Amount already withdrawn
- **Available Balance**: Currently withdrawable amount
- **Remaining Balance**: Amount not yet available

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
- [Payment Streaming Concepts](https://docs.sablier.finance/)

---

**Built with ❤️ on the Stacks blockchain**
