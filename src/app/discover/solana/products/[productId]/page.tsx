// src/app/discover/solana/products/[productId]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAsset } from '@/utils/getToken';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  name: string;
  imageURI: string;
  groupAddress: string;
}

const ProductPage: React.FC = () => {
  const { productId } = useParams() as { productId: string };
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      const fetchProductDetails = async () => {
        try {
          const details = await getAsset(productId);
          setProduct({
            name: details.name,
            imageURI: details.imageURI,
            groupAddress: details.groupAddress,
          });
          setMainImage(details.imageURI);
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      };

      fetchProductDetails();
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black p-4">
      <Card className="flex flex-col items-center p-8 border rounded-lg shadow-lg bg-white dark:bg-gray-900 dark:border-gray-700 w-full max-w-2xl">
        <button
          className="self-start mb-4 text-blue-500 hover:underline"
          onClick={() => router.back()}
        >
          Back to Closet
        </button>
        <div className="w-full flex flex-col items-center">
          {mainImage && (
            <Image 
              src={mainImage} 
              alt={product.name} 
              width={400} 
              height={400} 
              className="object-contain rounded-lg mb-4"
              loading="lazy"
            />
          )}
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">{product.name}</h1>
          <p className="text-md text-gray-800 dark:text-gray-200">
            <strong>Group Address:</strong> 
            <Link href={`https://solscan.io/address/${product.groupAddress}`} target="_blank" className="text-blue-500 hover:underline ml-2">
              {product.groupAddress}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ProductPage;
