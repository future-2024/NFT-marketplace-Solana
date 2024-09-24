// src/app/discover/collections/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";

interface Collection {
  _id: string;
  name: string;
  collectionAddress: string;
  imageUrl: string;
  jsonUrl: string;
  designerId: string;
  designerUsername: string;
  products: string[];
}

const DiscoverCollectionsPage = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/public/collections');
        setCollections(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching collections:', error);
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-black p-4">
        <Skeleton className="h-20 w-full max-w-lg rounded mb-4" />
        <Skeleton className="h-20 w-full max-w-lg rounded mb-4" />
        <Skeleton className="h-20 w-full max-w-lg rounded mb-4" />
      </div>
    );
  }

  const trimAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-black p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Featured Collections</h1>
      <div className="w-full max-w-4xl space-y-6">
        {collections.map((collection: Collection) => (
          <Card key={collection._id} className="flex flex-col md:flex-row p-4 border rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <div className="flex items-center mb-4 md:mb-0 md:mr-4">
              <Image src={collection.imageUrl} alt={collection.name} width={160} height={160} className="object-cover rounded-md" />
            </div>
            <div className="flex flex-col flex-1">
              <h3 className="text-2xl font-semibold">{collection.name}</h3>
              <p className="text-md mb-2"><strong>Designer:</strong> {collection.designerUsername}</p>
              <p className="text-md mb-2"><strong>Collection Address:</strong> 
                <Link href={`https://solscan.io/address/${collection.collectionAddress}`} target="_blank">
                  <span className="ml-2 inline-flex items-center text-gray-800 dark:text-gray-200">
                    {trimAddress(collection.collectionAddress)}
                    <ExternalLink className="ml-1 h-4 w-4"/>
                  </span>
                </Link>
              </p>
              <Link href={`/discover/collections/${collection._id}`} className="mt-2 inline-flex items-center text-gray-800 dark:text-gray-200">
                View Collection
                <ExternalLink className="ml-1 h-4 w-4"/>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DiscoverCollectionsPage;
