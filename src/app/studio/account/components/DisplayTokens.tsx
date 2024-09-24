//src/app/studio/account/components/DisplayTokens.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { fetchAssetsByOwner } from '@/utils/fetchAssetsByOwner';
import TokenModal from './TokenModal';
import { FiExternalLink, FiCopy } from 'react-icons/fi';

const DisplayTokens: React.FC = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [tokenIds, setTokenIds] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      if (publicKey) {
        setLoading(true);
        setError(null);
        try {
          const fetchedTokens = await fetchAssetsByOwner(publicKey.toString(), connection);
          console.log('Fetched Tokens:', fetchedTokens);
          setTokenIds(fetchedTokens);
        } catch (err) {
          console.error('Error in fetchTokens:', err);
          setError('Failed to fetch tokens');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTokens();
  }, [publicKey, connection]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  if (!publicKey) {
    return <div>Please connect your wallet</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Tokens Owned:</h2>
      <ul className="space-y-2">
        {tokenIds.map((token, index) => (
          <li key={index} className="flex items-center justify-between p-2 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer">
            <span onClick={() => setSelectedToken(token.mint)}>
              {token.mint}
            </span>
            <div className="flex items-center space-x-2">
              <FiExternalLink
                onClick={(e: any) => {
                  e.stopPropagation();
                  window.open(`https://explorer.solana.com/address/${token.mint}?cluster=devnet`, '_blank');
                }}
                className="text-blue-500 hover:text-blue-300"
              />
              <FiCopy
                onClick={(e: any) => {
                  e.stopPropagation();
                  handleCopy(token.mint);
                }}
                className="text-blue-500 hover:text-blue-300"
              />
            </div>
          </li>
        ))}
      </ul>
      {selectedToken && (
        <TokenModal
          tokenAddress={selectedToken}
          isOpen={Boolean(selectedToken)}
          onClose={() => setSelectedToken(null)}
        />
      )}
    </div>
  );
};

export default DisplayTokens;
