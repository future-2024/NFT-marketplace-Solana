// src/app/studio/products/[productId]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  productAddress: string;
  category: string;
  description: string;
  price: number;
  imageUrl1: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  imageUrl5?: string;
  jsonUrl?: string;
  collectionId: string;
  collectionAddress: string;
}

const ProductProfilePage = () => {
  const { productId } = useParams() as { productId: string };
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [productAddress, setProductAddress] = useState('');
  const [category, setCategory] = useState('');
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/products/${productId}`);
        setProduct(response.data);
        setName(response.data.name);
        setProductAddress(response.data.productAddress);
        setCategory(response.data.category);
        setDescription(response.data.description);
        setPrice(response.data.price.toString());
        setImageUrl1(response.data.imageUrl1);
        setImageUrl2(response.data.imageUrl2 || '');
        setImageUrl3(response.data.imageUrl3 || '');
        setImageUrl4(response.data.imageUrl4 || '');
        setImageUrl5(response.data.imageUrl5 || '');
        setJsonUrl(response.data.jsonUrl || '');
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!name || !productAddress || !price || !imageUrl1) {
      setError('Required fields are missing');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:4000/api/products/${productId}`, {
        name,
        productAddress,
        category,
        description,
        price,
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

      if (response.status === 200) {
        setSuccess('Product updated successfully');
        setProduct(response.data);
        setEditMode(false);
      } else {
        setError('Failed to update product');
      }
    } catch (err) {
      setError('Error updating product. Please try again.');
      console.error('Error updating product:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    if (product) {
      setName(product.name);
      setProductAddress(product.productAddress);
      setCategory(product.category);
      setDescription(product.description);
      setPrice(product.price.toString());
      setImageUrl1(product.imageUrl1);
      setImageUrl2(product.imageUrl2 || '');
      setImageUrl3(product.imageUrl3 || '');
      setImageUrl4(product.imageUrl4 || '');
      setImageUrl5(product.imageUrl5 || '');
      setJsonUrl(product.jsonUrl || '');
    }
  };

  const trimUrl = (url: string) => {
    return url.length > 30 ? `${url.substring(0, 30)}...` : url;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-lg mb-8">
        <Button onClick={() => router.back()} className="mb-4">Back to Collection</Button>
        {product && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">{editMode ? 'Edit Product' : 'Product Details'}</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Name</label>
                {editMode ? (
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product Name"
                    required
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{product.name}</p>
                )}
                <hr className="border-gray-300 dark:border-gray-600 my-2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Product Address</label>
                {editMode ? (
                  <Input
                    value={productAddress}
                    onChange={(e) => setProductAddress(e.target.value)}
                    placeholder="Product Address"
                    required
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{product.productAddress}</p>
                )}
                <hr className="border-gray-300 dark:border-gray-600 my-2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Category</label>
                {editMode ? (
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                    required
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{product.category}</p>
                )}
                <hr className="border-gray-300 dark:border-gray-600 my-2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Description</label>
                {editMode ? (
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Product Description"
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
                )}
                <hr className="border-gray-300 dark:border-gray-600 my-2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Price</label>
                {editMode ? (
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Product Price"
                    required
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">${product.price}</p>
                )}
                <hr className="border-gray-300 dark:border-gray-600 my-2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Image URL 1</label>
                {editMode ? (
                  <Input
                    value={imageUrl1}
                    onChange={(e) => setImageUrl1(e.target.value)}
                    placeholder="Image URL 1"
                    required
                  />
                ) : (
                  <>
                    <Image src={product.imageUrl1} alt={product.name} width={200} height={200} className="object-cover rounded-md" />
                    <p className="text-gray-700 dark:text-gray-300">{trimUrl(product.imageUrl1)}</p>
                  </>
                )}
                <hr className="border-gray-300 dark:border-gray-600 my-2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Image URL 2</label>
                {editMode ? (
                  <Input
                    value={imageUrl2}
                    onChange={(e) => setImageUrl2(e.target.value)}
                    placeholder="Image URL 2"
                  />
                ) : (
                  product.imageUrl2 && (
                    <>
                      <Image src={product.imageUrl2} alt={product.name} width={200} height={200} className="object-cover rounded-md" />
                      <p className="text-gray-700 dark:text-gray-300">{trimUrl(product.imageUrl2)}</p>
                    </>
                  )
                )}
                <hr className="border-gray-300 dark:border-gray-600 my-2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Image URL 3</label>
                {editMode ? (
                  <Input
                    value={imageUrl3}
                    onChange={(e) => setImageUrl3(e.target.value)}
                    placeholder="Image URL 3"
                  />
                ) : (
                  product.imageUrl3 && (
                    <>
                      <Image src={product.imageUrl3} alt={product.name} width={200} height={200} className="object-cover rounded-md" />
                      <p className="text-gray-700 dark:text-gray-300">{trimUrl(product.imageUrl3)}</p>
                    </>
                  )
                )}
                <hr className="border-gray-300 dark:border-gray-600 my-2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Image URL 4</label>
                {editMode ? (
                  <Input
                    value={imageUrl4}
                    onChange={(e) => setImageUrl4(e.target.value)}
                    placeholder="Image URL 4"
                  />
                ) : (
                  product.imageUrl4 && (
                    <>
                      <Image src={product.imageUrl4} alt={product.name} width={200} height={200} className="object-cover rounded-md" />
                      <p className="text-gray-700 dark:text-gray-300">{trimUrl(product.imageUrl4)}</p>
                    </>
                  )
                )}
                <hr className="border-gray-300 dark:border-gray-600 my-2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Image URL 5</label>
                {editMode ? (
                  <Input
                    value={imageUrl5}
                    onChange={(e) => setImageUrl5(e.target.value)}
                    placeholder="Image URL 5"
                  />
                ) : (
                  product.imageUrl5 && (
                    <>
                      <Image src={product.imageUrl5} alt={product.name} width={200} height={200} className="object-cover rounded-md" />
                      <p className="text-gray-700 dark:text-gray-300">{trimUrl(product.imageUrl5)}</p>
                    </>
                  )
                )}
                <hr className="border-gray-300 dark:border-gray-600 my-2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">JSON URL</label>
                {editMode ? (
                  <Input
                    value={jsonUrl}
                    onChange={(e) => setJsonUrl(e.target.value)}
                    placeholder="JSON URL"
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{trimUrl(product.jsonUrl || '')}</p>
                )}
                <hr className="border-gray-300 dark:border-gray-600 my-2" />
              </div>
            </div>
            {editMode ? (
              <div className="flex space-x-4 mt-4">
                <Button onClick={handleUpdateProduct} className="w-full">Save</Button>
                <Button onClick={handleCancelEdit} variant="outline" className="w-full">Cancel</Button>
              </div>
            ) : (
              <>
                <Button onClick={() => setEditMode(true)} className="w-full mt-4">Edit</Button>
                <Link href={`/studio/products/${productId}/sizes`}>
                  <Button className="w-full mt-4">Manage Sizes</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductProfilePage;
