// src/components/JSONUpload.tsx

"use client";

import React, { useState } from 'react';
import uploadToS3 from '@/utils/uploadToS3'; // Adjust the path as per your project structure
import { FaCopy } from 'react-icons/fa';

const JSONUpload: React.FC = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);

      // Upload JSON file to S3
      const userId = 'test-user-id'; // Replace this with actual user ID logic
      try {
        const url = await uploadToS3(file, `uploads/${userId}/json/${file.name}`);
        setUploadUrl(url);
      } catch (error) {
        console.error('Error uploading JSON to S3:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleCopyToClipboard = () => {
    if (uploadUrl) {
      navigator.clipboard.writeText(uploadUrl);
    }
  };

  return (
    <div className="mt-8 w-full max-w-lg mx-auto bg-white dark:bg-black p-6 rounded shadow-md border dark:border-white">
      <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Upload JSON File</h1>
      <input type="file" accept=".json" onChange={handleFileUpload} className="mb-4 block mx-auto text-black dark:text-white" />
      {uploading && <p className="text-center text-black dark:text-white">Uploading...</p>}
      {uploadUrl && (
        <div className="mt-4 flex items-center justify-center">
          <p className="text-center text-black dark:text-white mr-2">Uploaded JSON URL:</p>
          <span className="text-black dark:text-white">{uploadUrl}</span>
          <button onClick={handleCopyToClipboard} className="ml-2">
            <FaCopy className="text-black dark:text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default JSONUpload;
