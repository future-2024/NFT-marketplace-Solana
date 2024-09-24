// src/app/discover/page.tsx
'use client';

import React from 'react';
import FeaturedCollections from '../components/FeaturedCollections';
import TrendingCollections from '../components/TrendingCollections';

const DiscoverPage = () => {
  return (
    <div className="min-h-screen p-4 bg-white dark:bg-black flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <FeaturedCollections />
        <TrendingCollections />
      </div>
    </div>
  );
};

export default DiscoverPage;
