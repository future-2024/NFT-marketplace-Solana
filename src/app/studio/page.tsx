// src/app/studio/page.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const StudioPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Link href="/studio/mint">
            <Button className="w-full h-16 text-xl bg-blue-600 text-white hover:bg-blue-700">Mint NFT</Button>
          </Link>
          <Link href="/studio/collections">
            <Button className="w-full h-16 text-xl bg-gray-600 text-white hover:bg-gray-700">Collections</Button>
          </Link>
          <Link href="/studio/mynft">
            <Button className="w-full h-16 text-xl bg-gray-600 text-white hover:bg-gray-700">My NFTs</Button>
          </Link>
        </div>
        <div className="flex justify-center">
          <Image 
            src="/assets/womenfashion.png" 
            alt="Studio" 
            width={500} 
            height={500} 
            className="object-cover rounded-md" 
          />
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
