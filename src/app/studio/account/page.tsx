//src/app/studio/account/page.tsx


"use client";

import React, { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import DisplayTokens from './components/DisplayTokens';
import { fetchAssetsByOwner } from '@/utils/fetchAssetsByOwner';

const Account = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        const balance = await connection.getBalance(new PublicKey(publicKey));
        setBalance(balance / 1e9); // Convert lamports to SOL
      }
    };

    fetchBalance();
  }, [publicKey]);

  const trimAddress = (address: string) => {
    return address.slice(0, 4) + '...' + address.slice(-4);
  };

  return (
    <div className="flex flex-col items-center pt-16 p-4 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-6">Account Information</h1>
      {publicKey ? (
        <div className="w-full max-w-2xl text-center">
          <p className="text-xl mb-4">
            <strong>Wallet Address:</strong> {trimAddress(publicKey.toString())}
          </p>
          <p className="text-2xl mb-4">
            <strong>Balance:</strong> {balance !== null ? `${balance} SOL` : 'Loading...'}
          </p>
          <DisplayTokens />
        </div>
      ) : (
        <p>Please connect your wallet.</p>
      )}
    </div>
  );
};

export default Account;
