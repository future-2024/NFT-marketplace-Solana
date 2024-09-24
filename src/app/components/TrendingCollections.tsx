// src/app/components/TrendingCollections.tsx

'use client';

import React from 'react';

const TrendingCollections = () => {
  // Dummy data for trending collections
  const trendingCollections = [
    { name: 'Collection 1', designer: 'Designer A', volume: 1000 },
    { name: 'Collection 2', designer: 'Designer B', volume: 900 },
    { name: 'Collection 3', designer: 'Designer C', volume: 800 },
    // Add more dummy data as needed
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-black">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Trending Collections</h2>
      <table className="min-w-full bg-white dark:bg-black border dark:border-gray-700">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">Collection</th>
            <th className="py-2 px-4 border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">Designer</th>
            <th className="py-2 px-4 border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">Volume</th>
          </tr>
        </thead>
        <tbody>
          {trendingCollections.map((collection, index) => (
            <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <td className="py-2 px-4 border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">{collection.name}</td>
              <td className="py-2 px-4 border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">{collection.designer}</td>
              <td className="py-2 px-4 border-b dark:border-gray-700 text-gray-800 dark:text-gray-200">{collection.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrendingCollections;
