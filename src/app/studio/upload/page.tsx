// src/app/studio/upload/page.tsx

"use client";

import React, { useState } from 'react';
import ImageDropzone from '@/components/ImageDropzone'; // Adjust the path as per your project structure
import JSONForm from '@/components/JSONForm'; // Import the JSONForm component
import JSONUpload from '@/components/JSONUpload'; // Import the JSONUpload component

const UploadPage: React.FC = () => {
  const userId = 'test-user-id'; // Replace this with actual user ID logic
  const [uploadedImages, setUploadedImages] = useState<string[]>(Array(5).fill(""));

  const handleImageUpload = (imageUrl: string, index: number) => {
    setUploadedImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = imageUrl;
      return newImages;
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-black p-4" style={{ paddingTop: '70px' }}>
      <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Upload Images</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(5)].map((_, index) => (
          <ImageDropzone key={index} userId={userId} onUpload={handleImageUpload} index={index} />
        ))}
      </div>
      <JSONForm uploadedImages={uploadedImages} />
      <JSONUpload />
    </div>
  );
};

export default UploadPage;
