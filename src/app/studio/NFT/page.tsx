//src/app/studio/NFT/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';

interface NFT {
  tokenAddress: string;
  ownerAddress: string;
  designerId: string;
}

const NFTPage: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/nfts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setNfts(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (connected) {
      fetchNFTs();
    } else {
      setLoading(false);
    }
  }, [connected]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!connected || !publicKey) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">My NFTs</h1>
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.map((nft) => (
          <div key={nft.tokenAddress} className="p-4 border rounded shadow">
            <p><strong>Token Address:</strong> {nft.tokenAddress}</p>
            <p><strong>Owner Address:</strong> {nft.ownerAddress}</p>
            <p><strong>Designer ID:</strong> {nft.designerId}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTPage;
