'use client';

import Link from 'next/link';
import { useWeb3 } from '@/contexts/Web3Context';
import { 
  CheckCircleIcon, 
  ShieldCheckIcon, 
  BoltIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const { isConnected, connect } = useWeb3();

  return (
    <AppLayout>
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Secure Blockchain Voting for Everyone
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              ChainVotes is a decentralized voting platform that ensures transparency, security, and 
              immutability for all types of elections.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {isConnected ? (
                <Link href="/campaigns">
                  <Button size="lg">View Campaigns</Button>
                </Link>
              ) : (
                <Button size="lg" onClick={connect}>Connect Wallet</Button>
              )}
              <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Why Choose ChainVotes</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              A better way to run elections
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform leverages blockchain technology to provide a secure, transparent, and tamper-proof 
              voting experience.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <ShieldCheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Secure Voting
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Every vote is cryptographically secured on the blockchain, making it impossible to tamper with results.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <CheckCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Transparent Results
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  All votes are recorded on the blockchain and can be independently verified by anyone.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <BoltIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Fast and Efficient
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Built on Ethereum L2 solutions for lower gas fees and faster transactions.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <Cog6ToothIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Easy to Use
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  User-friendly interface that makes it easy for anyone to participate in elections.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-primary-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              Join thousands of users who are already using ChainVotes for secure and transparent elections.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {isConnected ? (
                <Link href="/campaigns">
                  <Button variant="secondary" size="lg">View Campaigns</Button>
                </Link>
              ) : (
                <Button variant="secondary" size="lg" onClick={connect}>Connect Wallet</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}