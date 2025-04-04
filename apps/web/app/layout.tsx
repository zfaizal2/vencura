import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { SolanaWalletConnectors } from "@dynamic-labs/solana";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Turborepo',
  description: 'Generated by create turbo',
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {' '}
        <DynamicContextProvider
          settings={{
            environmentId: '9a6dc4c8-71a6-47b7-a570-c111c5de1f2c',
            walletConnectors: [SolanaWalletConnectors],
          }}
        >
        {children}
        </DynamicContextProvider>
      </body>
    </html>
  );
}
