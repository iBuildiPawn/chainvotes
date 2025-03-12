'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createConfig, http, WagmiProvider, useAccount, useConnect, useDisconnect } from 'wagmi';
import { optimismSepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Create a client
const queryClient = new QueryClient();

// Create wagmi config
const config = createConfig({
  chains: [optimismSepolia],
  transports: {
    [optimismSepolia.id]: http(),
  },
  connectors: [
    injected(),
  ],
});

// Create context
interface Web3ContextType {
  isConnected: boolean;
  address: string | undefined;
  connect: () => void;
  disconnect: () => void;
  chainId: number | undefined;
}

const Web3Context = createContext<Web3ContextType>({
  isConnected: false,
  address: undefined,
  connect: () => {},
  disconnect: () => {},
  chainId: undefined,
});

// Web3 provider component
export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3ProviderInner>{children}</Web3ProviderInner>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function Web3ProviderInner({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [chainId, setChainId] = useState<number | undefined>(undefined);

  const { address: accountAddress, isConnected: accountConnected, chainId: accountChainId } = useAccount();
  const { connect: connectAccount, connectors } = useConnect();
  const { disconnect: disconnectAccount } = useDisconnect();

  useEffect(() => {
    setIsConnected(accountConnected);
    setAddress(accountAddress);
    setChainId(accountChainId);
  }, [accountConnected, accountAddress, accountChainId]);

  const connect = async () => {
    try {
      const connector = connectors[0]; // injected connector (MetaMask)
      connectAccount({ connector });
      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const disconnect = () => {
    try {
      disconnectAccount();
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Disconnection error:', error);
      toast.error('Failed to disconnect wallet');
    }
  };

  const contextValue: Web3ContextType = {
    isConnected,
    address,
    connect,
    disconnect,
    chainId,
  };

  return <Web3Context.Provider value={contextValue}>{children}</Web3Context.Provider>;
}

// Hook to use the Web3 context
export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}