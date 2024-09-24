// src/components/FetchAssets.tsx



"use client"; 

import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

// const assetURL = `https://devnet.helius-rpc.com/?api-key=ebe57d8c-01ae-4317-957e-d350790af639`;
const assetURL = ``;

interface Asset {
  id: string;
  // You can add other fields as needed
}

interface AssetResponse {
  jsonrpc: string;
  result: {
    items: Asset[];
  };
  // Define other fields as needed
}

const FetchAssets: React.FC = () => {
  const { publicKey } = useWallet();
  const [tokenIds, setTokenIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAssetsByOwner = async (walletAddress: string) => {
    const response = await fetch(assetURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: walletAddress,
          page: 1, // Starts at 1
          limit: 1000,
          displayOptions: {
            showFungible: true, //return both fungible and non-fungible tokens
          },
        },
      }),
    });

    const data = (await response.json()) as AssetResponse;
    return data.result.items.map((item) => item.id);
  };

  useEffect(() => {
    const fetchAssets = async () => {
      if (publicKey) {
        setLoading(true);
        setError(null);
        try {
          const ids = await getAssetsByOwner(publicKey.toString());
          setTokenIds(ids);
        } catch (err) {
          setError('Failed to fetch assets');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAssets();
  }, [publicKey]);

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
    <div>
      <h2>Tokens Owned:</h2>
      <ul>
        {tokenIds.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
    </div>
  );
};

export default FetchAssets;
