// src/app/discover/designers/[designerId]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import Image from 'next/image';
import Link from 'next/link';

interface Collection {
  _id: string;
  name: string;
  imageUrl: string;
}

interface Designer {
  _id: string;
  username: string;
  solanaWallet: string;
  collections: Collection[];
}

const DesignerProfilePage = () => {
  const { designerId } = useParams() as { designerId: string };
  const [designer, setDesigner] = useState<Designer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (designerId) {
      axios.get(`http://localhost:4000/api/public/designers/${designerId}`)
        .then(response => {
          setDesigner(response.data);
          return axios.get(`http://localhost:4000/api/collections/by-designer/${designerId}`);
        })
        .then(response => {
          setDesigner(prevState => prevState ? { ...prevState, collections: response.data } : null);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching designer profile:', error);
          setLoading(false);
        });
    }
  }, [designerId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-gray-100 dark:bg-black p-4">
        <Skeleton className="h-10 w-48 rounded-md mb-2" />
        <Skeleton className="h-6 w-32 rounded-md mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index}>
              <Card>
                <Skeleton className="h-64 w-full mb-4" />
              </Card>
              <Card>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!designer) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-gray-100 dark:bg-black p-4">
        <Skeleton className="h-10 w-48 rounded-md mb-2" />
        <Skeleton className="h-6 w-32 rounded-md mb-4" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex flex-col items-center bg-gray-100 dark:bg-black p-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">{designer.username}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Wallet: <span className="font-mono">{designer.solanaWallet}</span></p>
      </div>

      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {designer.collections.map((collection: Collection) => (
            <Card key={collection._id} className="mb-4">
              <Link href={`/discover/collections/${collection._id}`}>
                <div className="relative h-64">
                  <Image 
                    src={collection.imageUrl} 
                    alt={collection.name} 
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md transform transition-transform duration-300 ease-in-out hover:scale-105" 
                  />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 text-center">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{collection.name}</h3>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignerProfilePage;
