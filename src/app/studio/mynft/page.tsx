// src/app/discover/closet/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { getAssetsByOwner, fetchNFTDetails, extractGroupAddress } from '@/utils/getAssets';
import Image from 'next/image';
import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useWallet } from '@solana/wallet-adapter-react';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';

interface Asset {
  id: string;
  content: {
    json_uri: string;
    metadata: {
      name: string;
    };
  };
  token_info: {
    supply: number;
  };
}

interface DetailedAsset extends Asset {
  image?: string;
  groupAddress?: string;
}

const trimAddress = (address: string) => `${address.slice(0, 4)}...${address.slice(-4)}`;

const Closet: React.FC = () => {
  const {publicKey} = useWallet();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [assets, setAssets] = useState<DetailedAsset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  console.log(publicKey?.toBase58())
  useEffect(() => {
    const storedWalletAddress = sessionStorage.getItem('walletAddress');
    const storedAssets = sessionStorage.getItem('assets');

    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    }

    if (storedAssets) {
      setAssets(JSON.parse(storedAssets));
    }
    
  }, []);

  useEffect(()=>{
    fetchAssets()
  },[publicKey])

  useEffect(() => {
    sessionStorage.setItem('walletAddress', walletAddress);
  }, [walletAddress]);

  useEffect(() => {
    sessionStorage.setItem('assets', JSON.stringify(assets));
  }, [assets]);

  const fetchAssets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const assets = await getAssetsByOwner(publicKey?.toBase58()||'');
      const filteredAssets = assets.filter((asset: Asset) => asset.token_info.supply === 1);

      const detailedAssets = await Promise.all(
        filteredAssets.map(async (asset: Asset) => {
          try {
            const details = await fetchNFTDetails(asset.content.json_uri);
            const groupAddress = extractGroupAddress(asset);
            return {
              ...asset,
              image: details.image,
              groupAddress: groupAddress,
            };
          } catch (error) {
            console.error(`Error fetching details for asset ${asset.id}:`, error);
            return {
              ...asset,
              groupAddress: '',
            };
          }
        })
      );

      setAssets(detailedAssets);
    } catch (err) {
      setError('Failed to fetch assets');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 pt-20 bg-white dark:bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center text-black dark:text-white">NFTs in my wallet</h1>

      {/* <div className="flex justify-center mb-4">
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter Wallet Address"
          className="border border-gray-300 p-2 rounded w-1/2 bg-white dark:bg-black dark:text-gray-200"
        />
        <button
          onClick={fetchAssets}
          disabled={isLoading}
          className={`ml-2 p-2 rounded ${isLoading ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
        >
          {isLoading ? 'Loading...' : 'Load NFTs'}
        </button>
      </div> */}

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {isLoading?(<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index}>
              <Skeleton className="h-64 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>))}</div>):(<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {assets.map((asset: DetailedAsset) => (
          <div key={asset.id} className="relative p-4 border rounded shadow hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer bg-white dark:bg-black group">
            <Link href={`/studio/mynft/${asset.id}`}>
              <div className="relative h-64 w-full mb-4">
                {asset.image ? (
                  <Image
                    src={asset.image}
                    alt={`Asset ${asset.id}`}
                    layout="fill"
                    objectFit="contain"
                    className="rounded"
                  />
                ) : (
                  <p>No Image Available</p>
                )}
              </div>
            </Link>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-opacity flex flex-col justify-end items-center opacity-0 group-hover:opacity-100 text-white text-xs p-2">
              <p className="font-semibold">{asset.content.metadata.name || 'Unknown'}</p>
              <Link href={`https://solana.fm/address/${asset.id}`} target="_blank" className="hover:text-gray-300 flex items-center">
                {trimAddress(asset.id)} <FaExternalLinkAlt className="ml-1" />
              </Link>
              {asset.groupAddress && (
                <Link href={`https://solana.fm/address/${asset.groupAddress}`} target="_blank" className="hover:text-gray-300 flex items-center">
                  Group: {trimAddress(asset.groupAddress)} <FaExternalLinkAlt className="ml-1" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>)}
    </div>
  );
};

export default Closet;
