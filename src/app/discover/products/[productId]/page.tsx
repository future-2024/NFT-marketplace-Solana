// src/app/discover/products/[productId]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Product {
  _id: string;
  name: string;
  productAddress: string;
  description: string;
  price: number;
  imageUrl1: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  imageUrl5?: string;
  collectionAddress: string;
}

const ProductPage: React.FC = () => {
  const { productId } = useParams() as { productId: string };
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      axios.get(`http://localhost:4000/api/products/${productId}`)
        .then(response => {
          setProduct(response.data);
          setMainImage(response.data.imageUrl1);
        })
        .catch(error => {
          console.error('Error fetching product:', error);
        });
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-black p-4">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[500px] w-[500px] rounded-xl dark:bg-gray-800" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] dark:bg-gray-800" />
            <Skeleton className="h-4 w-[200px] dark:bg-gray-800" />
            <Skeleton className="h-4 w-[300px] dark:bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  const trimmedCollectionAddress = `${product.collectionAddress.slice(0, 6)}...${product.collectionAddress.slice(-4)}`;
  const imageUrls = [product.imageUrl1, product.imageUrl2, product.imageUrl3, product.imageUrl4, product.imageUrl5].filter(url => url);

  const handleThumbnailClick = (url: string) => {
    setMainImage(url);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-black p-4">
      <div className="mb-4 self-start">
        <button 
          onClick={() => router.back()} 
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          &larr; Back to Collection
        </button>
      </div>
      <Card className="flex flex-col md:flex-row p-8 border rounded-lg shadow-lg bg-white dark:bg-gray-900 dark:border-gray-700 w-full max-w-5xl">
        <div className="w-full md:w-1/2 pr-8">
          {mainImage && (
            <Image 
              src={mainImage} 
              alt={product.name} 
              width={800} 
              height={800} 
              className="object-contain rounded-lg mb-4"
              loading="lazy"
            />
          )}
          <div className="flex space-x-4">
            {imageUrls.map((url, index) => (
              <Image 
                key={index} 
                src={url as string} 
                alt={`${product.name}-${index}`} 
                width={100} 
                height={100} 
                className={`object-contain rounded-md cursor-pointer ${mainImage === url ? 'border-2 border-blue-500' : ''}`}
                onClick={() => handleThumbnailClick(url as string)}
                loading="lazy"
              />
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/2 pl-8 mt-4 md:mt-0">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">{product.name}</h1>
          <p className="text-xl font-semibold mb-2 text-gray-600 dark:text-gray-400">${product.price}</p>
          <p className="text-md mb-4 text-gray-800 dark:text-gray-200">{product.description}</p>
          <p className="text-md text-gray-800 dark:text-gray-200">
            <strong>Collection Address:</strong> 
            <Link href={`https://solscan.io/address/${product.collectionAddress}`} target="_blank" className="text-blue-500 hover:underline ml-2">
              {trimmedCollectionAddress}
            </Link>
          </p>
          <Button className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Buy</Button>
        </div>
      </Card>
    </div>
  );
};

export default ProductPage;
