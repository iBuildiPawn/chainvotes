'use client';

import React from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <AppLayout>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">About ChainVotes</h1>
            
            <div className="mt-10 space-y-16">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Our Mission</h2>
                <p className="mt-4 text-lg text-gray-600">
                  ChainVotes is on a mission to revolutionize voting systems by leveraging blockchain technology. 
                  We believe that voting should be transparent, secure, and accessible to everyone. Our platform 
                  enables organizations of all sizes to conduct fair and tamper-proof elections.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">How It Works</h2>
                <p className="mt-4 text-lg text-gray-600">
                  ChainVotes uses smart contracts deployed on Ethereum and Layer 2 solutions to create a 
                  decentralized voting system. Here's how it works:
                </p>
                <ul className="mt-4 list-disc pl-6 text-lg text-gray-600 space-y-2">
                  <li>Administrators create campaigns and add positions and candidates</li>
                  <li>Voters connect their wallets to authenticate their identity</li>
                  <li>Votes are recorded on the blockchain, ensuring they cannot be altered</li>
                  <li>Results are transparent and can be verified by anyone</li>
                  <li>The entire process is secured by cryptography</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Technology Stack</h2>
                <p className="mt-4 text-lg text-gray-600">
                  Our platform is built using cutting-edge technologies:
                </p>
                <ul className="mt-4 list-disc pl-6 text-lg text-gray-600 space-y-2">
                  <li><strong>Smart Contracts:</strong> Written in Solidity and deployed on Ethereum</li>
                  <li><strong>Layer 2 Solutions:</strong> Support for Optimism and Arbitrum for lower fees and faster transactions</li>
                  <li><strong>Frontend:</strong> Built with Next.js, React, and Tailwind CSS</li>
                  <li><strong>Web3 Integration:</strong> Using ethers.js, wagmi, and viem for blockchain interaction</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Security Features</h2>
                <p className="mt-4 text-lg text-gray-600">
                  Security is our top priority. ChainVotes includes the following security features:
                </p>
                <ul className="mt-4 list-disc pl-6 text-lg text-gray-600 space-y-2">
                  <li>Reentrancy protection to prevent attacks</li>
                  <li>Access control for admin functions</li>
                  <li>Prevention of double voting</li>
                  <li>Transparent vote counting</li>
                  <li>Smart contract auditing and testing</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Get Started</h2>
                <p className="mt-4 text-lg text-gray-600">
                  Ready to experience the future of voting? Connect your wallet and start exploring our platform today.
                </p>
                <div className="mt-6">
                  <Link href="/">
                    <Button size="lg">Back to Home</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}