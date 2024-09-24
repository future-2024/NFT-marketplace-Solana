// src/app/components/AddProductModal.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface AddProductModalProps {
  collectionId: string;
  collectionAddress: string;
  onProductAdded: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ collectionId, collectionAddress, onProductAdded }) => {
  const [name, setName] = useState('');
  const [productAddress, setProductAddress] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl1, setImageUrl1] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');
  const [imageUrl3, setImageUrl3] = useState('');
  const [imageUrl4, setImageUrl4] = useState('');
  const [imageUrl5, setImageUrl5] = useState('');
  const [jsonUrl, setJsonUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!name || !productAddress || !price || !imageUrl1) {
      setError('Required fields are missing');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/products', {
        name,
        productAddress,
        description,
        price,
        collectionId,
        collectionAddress,
        imageUrl1,
        imageUrl2,
        imageUrl3,
        imageUrl4,
        imageUrl5,
        jsonUrl
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        setSuccess('Product added successfully');
        onProductAdded();
        setName('');
        setProductAddress('');
        setDescription('');
        setPrice('');
        setImageUrl1('');
        setImageUrl2('');
        setImageUrl3('');
        setImageUrl4('');
        setImageUrl5('');
        setJsonUrl('');
      } else {
        setError('Failed to add product');
      }
    } catch (err) {
      setError('Error adding product. Please try again.');
      console.error('Error adding product:', err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-lg p-8 bg-white dark:bg-gray-800 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product Name"
              required
            />
          </div>
          <div>
            <label htmlFor="productAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Address</label>
            <Input
              id="productAddress"
              value={productAddress}
              onChange={(e) => setProductAddress(e.target.value)}
              placeholder="Product Address"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product Description"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Product Price"
              required
            />
          </div>
          <div>
            <label htmlFor="imageUrl1" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL 1</label>
            <Input
              id="imageUrl1"
              value={imageUrl1}
              onChange={(e) => setImageUrl1(e.target.value)}
              placeholder="Image URL 1"
              required
            />
          </div>
          <div>
            <label htmlFor="imageUrl2" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL 2</label>
            <Input
              id="imageUrl2"
              value={imageUrl2}
              onChange={(e) => setImageUrl2(e.target.value)}
              placeholder="Image URL 2"
            />
          </div>
          <div>
            <label htmlFor="imageUrl3" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL 3</label>
            <Input
              id="imageUrl3"
              value={imageUrl3}
              onChange={(e) => setImageUrl3(e.target.value)}
              placeholder="Image URL 3"
            />
          </div>
          <div>
            <label htmlFor="imageUrl4" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL 4</label>
            <Input
              id="imageUrl4"
              value={imageUrl4}
              onChange={(e) => setImageUrl4(e.target.value)}
              placeholder="Image URL 4"
            />
          </div>
          <div>
            <label htmlFor="imageUrl5" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL 5</label>
            <Input
              id="imageUrl5"
              value={imageUrl5}
              onChange={(e) => setImageUrl5(e.target.value)}
              placeholder="Image URL 5"
            />
          </div>
          <div>
            <label htmlFor="jsonUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">JSON URL</label>
            <Input
              id="jsonUrl"
              value={jsonUrl}
              onChange={(e) => setJsonUrl(e.target.value)}
              placeholder="JSON URL"
            />
          </div>
          <Button type="submit" className="w-full">Add Product</Button>
        </form>
      </Card>
    </div>
  );
};

export default AddProductModal;
