# Deployment Information

## Optimism Sepolia Testnet

The ChainVotes contract has been deployed to the Optimism Sepolia testnet.

- **Contract Address**: `0x3eE9A02BC093a59DCA689883cDe341B85F747fCE`
- **Block Explorer URL**: [https://sepolia-optimism.etherscan.io/address/0x3eE9A02BC093a59DCA689883cDe341B85F747fCE](https://sepolia-optimism.etherscan.io/address/0x3eE9A02BC093a59DCA689883cDe341B85F747fCE)
- **Network ID**: 11155420

## Frontend Configuration

To connect the frontend to the deployed contract, create a `.env.local` file in the `frontend` directory with the following content:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x3eE9A02BC093a59DCA689883cDe341B85F747fCE
NEXT_PUBLIC_CHAIN_ID=11155420
```

## Testing the Deployment

1. Make sure you have MetaMask or another Ethereum wallet installed
2. Add the Optimism Sepolia network to your wallet:
   - Network Name: Optimism Sepolia
   - RPC URL: https://sepolia.optimism.io
   - Chain ID: 11155420
   - Currency Symbol: ETH
   - Block Explorer URL: https://sepolia-optimism.etherscan.io

3. Get some testnet ETH from the [Optimism Sepolia Faucet](https://www.optimism.io/faucet)
4. Connect your wallet to the application
5. Create a campaign, add positions and candidates, and test voting functionality

## Verification

The contract has been verified on the Optimism Sepolia block explorer. You can interact with it directly through the block explorer if needed.