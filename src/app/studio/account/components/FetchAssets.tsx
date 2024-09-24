//src/app/studio/account/components/FetchAssets.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getAssetsByOwner } from '@/utils/getAssets'; // Use the path alias

const FetchAssets: React.FC = () => {
  const { publicKey } = useWallet();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      if (publicKey) {
        setLoading(true);
        setError(null);
        try {
          const fetchedAssets = await getAssetsByOwner(publicKey.toString());
          console.log('Assets:', fetchedAssets);
          setAssets(fetchedAssets);
        } catch (err) {
          console.error('Error in fetchAssets:', err);
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
        {assets.map((asset, index) => (
          <li key={index}>
            <strong>ID:</strong> {asset.id} <br />
            <strong>Name:</strong> {asset.name || 'N/A'} <br />
            <strong>Type:</strong> {asset.type || 'unknown'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FetchAssets;
