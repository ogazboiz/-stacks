# Stacks Blockchain Development Powerhouse

A collection of decentralized applications and smart contracts built on the Stacks blockchain. This repository contains DeFi protocols, gaming applications, and utility contracts.

## Architecture Overview

This repository contains multiple independent projects:

- AMM (Automated Market Maker) - Decentralized exchange protocol
- Token Streaming - Continuous payment streaming system
- Tic-Tac-Toe - Blockchain-based gaming with betting
- Frontend Applications - User interfaces for various projects
- ParkNotify Landing - Parking coordination platform

## Project Structure

```
stacks/
├── amm/                          # Automated Market Maker Protocol
├── stacks-token-streaming/       # Token Streaming System
├── tic-tac-toe/                  # Blockchain Tic-Tac-Toe Game
├── frontend/                     # Frontend Applications
│   ├── account-history/          # Account history tracking
│   ├── amm/                      # AMM frontend interface
│   └── tic-tac-toe/              # Tic-tac-toe game interface
├── Project/                      # Special Projects
│   └── parknotify-landing/       # ParkNotify landing page
└── stacks-tic-tac-toe/           # [IGNORED] Advanced tic-tac-toe project
```

## Technology Stack

- Blockchain: Stacks (STX)
- Smart Contracts: Clarity
- Development: Clarinet SDK
- Testing: Vitest
- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Deployment: Stacks Testnet/Mainnet

## Getting Started

### Prerequisites

- Node.js (v18+)
- Clarinet SDK
- Stacks CLI
- Git

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd stacks
   ```

2. Install dependencies for each project
   ```bash
   # Install root dependencies
   npm install
   
   # Install AMM dependencies
   cd amm && npm install && cd ..
   
   # Install Token Streaming dependencies
   cd stacks-token-streaming && npm install && cd ..
   
   # Install Tic-Tac-Toe dependencies
   cd tic-tac-toe && npm install && cd ..
   ```

3. Start Clarinet development environment
   ```bash
   # For AMM
   cd amm && clarinet console
   
   # For Token Streaming
   cd stacks-token-streaming && clarinet console
   
   # For Tic-Tac-Toe
   cd tic-tac-toe && clarinet console
   ```

## Testing

Each project includes test suites:

```bash
# Run tests for AMM
cd amm && npm test

# Run tests for Token Streaming
cd stacks-token-streaming && npm test

# Run tests for Tic-Tac-Toe
cd tic-tac-toe && npm test
```

## Frontend Development

The frontend applications provide user interfaces for the smart contracts:

```bash
# Start AMM frontend
cd frontend/amm && npm run dev

# Start Tic-Tac-Toe frontend
cd frontend/tic-tac-toe && npm run dev

# Start ParkNotify landing page
cd Project/parknotify-landing && npm run dev
```

## Project Details

### AMM (Automated Market Maker)
- Purpose: Decentralized exchange for token swaps
- Features: Liquidity pools, automated pricing, fee collection
- Status: Production ready
- Documentation: [See AMM README](./amm/README.md)

### Token Streaming
- Purpose: Continuous payment streaming system
- Features: Time-based payments, withdrawal management, stream scheduling
- Status: Production ready
- Documentation: [See Token Streaming README](./stacks-token-streaming/README.md)

### Tic-Tac-Toe
- Purpose: Blockchain-based gaming with betting mechanics
- Features: Multiplayer gaming, STX betting, winner determination
- Status: Production ready
- Documentation: [See Tic-Tac-Toe README](./tic-tac-toe/README.md)

### ParkNotify Landing
- Purpose: Parking coordination platform landing page
- Features: Waitlist signup, responsive design, modern UI
- Status: Production ready
- Documentation: [See ParkNotify README](./Project/parknotify-landing/README.md)

## Development Workflow

1. Smart Contract Development
   - Write Clarity contracts
   - Test with Clarinet
   - Deploy to testnet

2. Frontend Development
   - Build React/Next.js interfaces
   - Integrate with Stacks.js
   - Test user interactions

3. Integration Testing
   - End-to-end testing
   - User acceptance testing
   - Performance optimization

## Deployment

### Testnet Deployment
```bash
# Deploy AMM to testnet
cd amm && clarinet deploy --testnet

# Deploy Token Streaming to testnet
cd stacks-token-streaming && clarinet deploy --testnet

# Deploy Tic-Tac-Toe to testnet
cd tic-tac-toe && clarinet deploy --testnet
```

### Mainnet Deployment
```bash
# Deploy to mainnet (ensure thorough testing first)
clarinet deploy --mainnet
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Links

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarinet Documentation](https://github.com/hirosystems/clarinet)
- [Clarity Language Reference](https://docs.stacks.co/references/clarity-language)

## Support

For support and questions:
- Create an issue in this repository
- Join the Stacks Discord community
- Check the individual project READMEs for specific guidance

Built on the Stacks blockchain
