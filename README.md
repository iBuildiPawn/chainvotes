# ChainVotes

A blockchain-based voting application using Ethereum that can be deployed on L2 solutions like Optimism and Arbitrum.

## Overview

ChainVotes is a decentralized voting platform that leverages blockchain technology to ensure transparent, secure, and tamper-proof elections. The system allows administrators to create voting campaigns, add positions and candidates, while voters can securely cast their votes with full transparency.

## Features

- **Secure Voting**: Cryptographically secure voting process
- **Transparent Results**: All votes are recorded on the blockchain and can be independently verified
- **Admin Controls**: Create campaigns, positions, and candidates
- **L2 Compatibility**: Designed to work on Ethereum L2 solutions for lower gas fees and faster transactions
- **User-Friendly Interface**: Modern Next.js frontend with Tailwind CSS

## Deployment

The ChainVotes contract has been deployed to the Optimism Sepolia testnet. For detailed deployment information, see [DEPLOYMENT.md](DEPLOYMENT.md).

- **Contract Address**: `0x3eE9A02BC093a59DCA689883cDe341B85F747fCE`
- **Block Explorer**: [View on Optimism Sepolia Explorer](https://sepolia-optimism.etherscan.io/address/0x3eE9A02BC093a59DCA689883cDe341B85F747fCE)

## Technology Stack

### Smart Contracts
- Solidity
- Hardhat development environment
- OpenZeppelin contracts for security

### Frontend
- Next.js 15.2
- React 18
- Tailwind CSS
- ethers.js for blockchain interaction
- wagmi & viem for Web3 integration

### Testing
- Hardhat testing framework
- Chai for assertions

## Project Structure

```
chainvotes/
├── contracts/           # Solidity smart contracts
├── frontend/            # Next.js web application
│   ├── src/
│   │   ├── app/         # Next.js app router
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React contexts
│   │   └── hooks/       # Custom React hooks
├── scripts/             # Deployment and utility scripts
└── test/                # Smart contract tests
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- MetaMask or another Ethereum wallet

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/iBuildiPawn/chainvotes.git
   cd chainvotes
   ```

2. Install dependencies for smart contracts:
   ```bash
   npm install
   ```

3. Install dependencies for frontend:
   ```bash
   cd frontend
   npm install
   ```

4. Create a `.env.local` file in the frontend directory:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x3eE9A02BC093a59DCA689883cDe341B85F747fCE
   NEXT_PUBLIC_CHAIN_ID=11155420
   ```

### Running the Application

1. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Connect your wallet to the Optimism Sepolia network

### Deploying Smart Contracts

1. Configure your network in `hardhat.config.js`
2. Deploy to a local network:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. Deploy to a testnet or mainnet:
   ```bash
   npx hardhat run scripts/deploy.js --network [network-name]
   ```

## Usage

### Admin Functions
- Create new voting campaigns
- Add positions to campaigns
- Add candidates to positions
- Activate or deactivate campaigns
- Add or remove admin addresses

### Voter Functions
- View active and upcoming campaigns
- View positions and candidates
- Cast votes for candidates
- View voting results

## Security Features

- Reentrancy protection
- Access control for admin functions
- Prevention of double voting
- Transparent vote counting

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.