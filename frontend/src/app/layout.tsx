import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Web3Provider } from '@/contexts/Web3Context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ChainVotes - Blockchain Voting System',
  description: 'A decentralized voting platform built on Ethereum',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          {children}
          <Toaster position="bottom-right" />
        </Web3Provider>
      </body>
    </html>
  );
}