// src/app/components/TrendingDesigners.tsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

const TrendingDesigners = ({ designerUsernames }: { designerUsernames: string[] }) => {
  const [designers, setDesigners] = useState<any[]>([]);

  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        const designersData = await Promise.all(
          designerUsernames.map(async (username) => {
            const response = await axios.get(`http://localhost:4000/api/public/designers/username/${username}`);
            return response.data;
          })
        );
        setDesigners(designersData);
      } catch (error) {
        console.error('Error fetching trending designers:', error);
      }
    };

    fetchDesigners();
  }, [designerUsernames]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Trending Designers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {designers.map((designer) => (
          <Card key={designer._id} className="p-4 border rounded">
            <h3 className="text-lg font-semibold">{designer.username}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Email:</strong> {designer.email}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Wallet:</strong> {designer.solanaWallet}</p>
            <Link href={`/discover/designers/${designer.username}`} className="text-blue-500 hover:underline">
              View Profile
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrendingDesigners;
