# Ledger Lotto - Solana Lottery dApp

A decentralized lottery application built on the Solana blockchain, featuring a Next.js frontend and Anchor program.

## Overview

Ledger Lotto is an on-chain lottery system where users can:
- Purchase lottery tickets using SOL
- View their tickets and current participants
- Win prizes based on randomly selected winning numbers
- Track recent winners

The application consists of two main components:
1. A Solana program (smart contract) built with Anchor framework
2. A Next.js web application for the user interface

## Technology Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **@solana/wallet-adapter** - Wallet connection components
- **@coral-xyz/anchor** - Solana program interaction

### Backend/Blockchain
- **Anchor Framework** - Solana smart contract development
- **Rust** - Programming language for Solana programs
- **Solana Web3.js** - JavaScript API for Solana

## Smart Contract Features

The Solana program provides the following functions:
- `initLotteryVault` - Initialize a new lottery
- `purchaseTicket` - Allow users to buy lottery tickets
- `selectWinners` - Randomly select winning tickets
- `lotteryPayout` - Distribute prizes to winners
- `reallocLotteryVault` - Reallocate storage for the lottery vault

## Getting Started

### Prerequisites
- Node.js 18.x (as specified in .nvmrc)
- Rust and Solana CLI tools
- Anchor framework

### Installation

#### Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

#### Smart Contract
```bash
# Navigate to onchain directory
cd onchain

# Build the Anchor program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

### Environment Variables

Create a `.env.local` file with the following variables:

- SOLANA_RPC_URL=https://api.devnet.solana.com
- LOTTERY_AUTHORITY_KEYPAIR=<Your Authority Keypair JSON>


## Usage

1. Connect your Solana wallet (Phantom, Solflare, etc.)
2. Navigate to the Tickets page
3. Purchase tickets (maximum 10 per wallet)
4. Wait for the lottery drawing
5. If your tickets win, prizes will be automatically transferred to your wallet

## Lottery Rules

- First place winner receives 50% of the prize pool
- Second place winner receives 30% of the prize pool
- Third place winner receives 15% of the prize pool
- Protocol treasury receives the remaining 5%

## Development

### Project Structure
- `/app` - Next.js application
  - `/api` - API routes (includes lottery payout endpoint)
  - `/components` - React components
  - `/tickets` - Ticket purchasing page
- `/onchain` - Solana program code
  - `/programs/solana-lottery` - Anchor program
  - `/app` - Program account definitions

### Running Tests
```bash
# To run frontend tests
npm run test

# To run Solana program tests (in onchain directory)
anchor test
```


## Contact
For questions or support, please open an issue on this repository.
