// src/app/components/FeaturedCollections.tsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';

const FeaturedCollections = () => {
  const collectionAddresses = [
    'C9XC1GcJ2JWAesYCNyEc9DPi593b2nudnTrSpbg8qgAo',
    '3TzvHfyKY3JCxwdbpxHtePhv4VgycmHKaSt1zEv55Sh3',
    'JCf17X3yuW2pt7V4JXutQCvj51kt96ackPNUzK3Qkx8w'
  ];

  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collectionsData = await Promise.all(
          collectionAddresses.map(async (address) => {
            const response = await axios.get(`http://localhost:4000/api/public/collections/address/${address}`);
            return response.data;
          })
        );
        setCollections(collectionsData);
      } catch (error) {
        console.error('Error fetching featured collections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="bg-white dark:bg-black text-gray-800 dark:text-white p-4 ">
      <h2 className="text-2xl font-bold mb-4 text-center">Featured Collections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <Skeleton className="h-64 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))
        ) : (
          collections.map((collection) => (
            <Card key={collection._id} className="flex flex-col">
              <div className="flex-shrink-0">
                <Image src={collection.imageUrl} alt={collection.name} width={400} height={400} className="object-contain w-full h-64" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 text-center flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{collection.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2"><strong>Designer:</strong> <span className="italic font-medium">{collection.designerUsername}</span></p>
                <Link href={`/discover/collections/${collection._id}`} className="flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                  <span className="mr-1">View Collection</span> <FaExternalLinkAlt />
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default FeaturedCollections;
