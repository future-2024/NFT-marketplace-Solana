// src/components/JSONForm.tsx

"use client";

import React, { useState } from 'react';

interface JSONFormProps {
  uploadedImages: string[];
}

const JSONForm: React.FC<JSONFormProps> = ({ uploadedImages }) => {
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    designer: "",
    website: "",
    collection: "",
    image: "",
    description: ""
  });
  const [jsonOutput, setJsonOutput] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, image: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const jsonString = JSON.stringify(formData, null, 2);
    setJsonOutput(jsonString);

    // Trigger download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.name || 'data'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8 w-full max-w-lg mx-auto bg-white dark:bg-black p-6 rounded shadow-md border dark:border-white">
      <h2 className="text-xl font-semibold mb-4 text-center text-black dark:text-white">JSON Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-black dark:text-white" htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-black dark:text-white" htmlFor="year">Year</label>
          <input type="text" id="year" name="year" value={formData.year} onChange={handleInputChange} className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-black dark:text-white" htmlFor="designer">Designer</label>
          <input type="text" id="designer" name="designer" value={formData.designer} onChange={handleInputChange} className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-black dark:text-white" htmlFor="website">Website</label>
          <input type="text" id="website" name="website" value={formData.website} onChange={handleInputChange} className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-black dark:text-white" htmlFor="collection">Collection</label>
          <input type="text" id="collection" name="collection" value={formData.collection} onChange={handleInputChange} className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-black dark:text-white" htmlFor="image">Image</label>
          <select id="image" name="image" value={formData.image} onChange={handleImageSelect} className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white" required>
            <option value="">Select an image</option>
            {uploadedImages.map((url, index) => url && <option key={index} value={url}>{url}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-black dark:text-white" htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white" required />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Generate JSON</button>
      </form>
      {jsonOutput && (
        <div className="mt-8 w-full bg-white dark:bg-black p-6 rounded shadow-md border dark:border-white">
          <h2 className="text-xl font-semibold mb-4 text-center text-black dark:text-white">Generated JSON</h2>
          <pre className="whitespace-pre-wrap break-words text-black dark:text-white">{jsonOutput}</pre>
        </div>
      )}
    </div>
  );
};

export default JSONForm;
