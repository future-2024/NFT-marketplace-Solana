// src/app/discover/collections/[collectionId]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import Image from 'next/image';
import Link from 'next/link';
import FeaturedCollections from '@/app/components/FeaturedCollections';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl1: string;
  imageUrl2?: string;
}

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

const CollectionPage = () => {
  const { collectionId } = useParams() as { collectionId: string };
  const router = useRouter();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (collectionId) {
      axios.get(`http://localhost:4000/api/public/collections/${collectionId}`)
        .then(response => {
          setCollection(response.data);
          return axios.get(`http://localhost:4000/api/public/collections/${collectionId}/products`);
        })
        .then(response => {
          setProducts(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching collection or products:', error);
          setLoading(false);
        });
    }
  }, [collectionId]);

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

  if (!collection) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-gray-100 dark:bg-black p-4">
        <Skeleton className="h-10 w-48 rounded-md mb-2" />
        <Skeleton className="h-6 w-32 rounded-md mb-4" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex flex-col items-center bg-gray-100 dark:bg-black p-4">
      <div className="mb-4 self-start">
        <button 
          onClick={() => router.back()} 
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          &larr; Back to Discover
        </button>
      </div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">{collection.name}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          by 
          <Link href={`/discover/designers/${collection.designerId}`} className="italic font-medium text-gray-800 dark:text-gray-200 hover:underline ml-1">
            {collection.designerUsername}
          </Link>
        </p>
      </div>

      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200"></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product: Product) => (
            <div key={product._id}>
              <Card className="mb-4">
                <Link href={`/discover/products/${product._id}`}>
                  <div className="relative h-64">
                    <Image 
                      src={product.imageUrl1} 
                      alt={product.name} 
                      layout="fill"
                      objectFit="contain"
                      className="rounded-md transform transition-transform duration-300 ease-in-out hover:scale-105" 
                    />
                    {product.imageUrl2 && (
                      <Image 
                        src={product.imageUrl2} 
                        alt={product.name} 
                        layout="fill"
                        objectFit="contain"
                        className="rounded-md absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out" 
                      />
                    )}
                  </div>
                </Link>
              </Card>
              <Card className="bg-gray-100 dark:bg-gray-700 p-4 text-center flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{product.name}</h3>
                <div className="flex items-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mr-2">${product.price}</p>
                  <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Buy</button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-7xl pt-20">
        <FeaturedCollections />
      </div>
    </div>
  );
};

export default CollectionPage;
