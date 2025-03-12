# ChainVotes Frontend

This is the frontend application for the ChainVotes blockchain voting system. It's built with Next.js, React, and Tailwind CSS.

## Features

- Connect wallet using wagmi and viem
- View active and upcoming campaigns
- Vote for candidates
- Admin dashboard for creating campaigns, positions, and candidates
- Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- MetaMask or another Ethereum wallet

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
   NEXT_PUBLIC_CHAIN_ID=11155420  # Optimism Sepolia testnet
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js app router
│   │   ├── page.tsx     # Home page
│   │   ├── about/       # About page
│   │   ├── campaigns/   # Campaigns pages
│   │   ├── admin/       # Admin dashboard
│   │   └── vote/        # Voting page
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # Basic UI components
│   │   └── layout/      # Layout components
│   ├── contexts/        # React contexts
│   │   └── Web3Context.tsx  # Web3 provider context
│   ├── hooks/           # Custom React hooks
│   │   ├── useContract.ts   # Contract interaction hook
│   │   └── useCampaigns.ts  # Campaigns data hook
│   └── utils/           # Utility functions
└── tailwind.config.js   # Tailwind CSS configuration
```