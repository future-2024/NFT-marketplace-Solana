'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import ImageDropzone from '@/components/ImageDropzone';
import JSONForm from '@/components/JSONForm';
import JSONUpload from '@/components/JSONUpload';

interface Product {
  _id: string;
  name: string;
  productAddress: string;
  gender: string;
  category: string;
  color: string[];
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

const genderOptions = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' }
];

const categoryOptions: { [key: string]: string[] } = {
  men: [
    'Outerwear', 'Coats', 'Blazers', 'Jackets', 'Pants', 'Shorts', 'Shirts', 'Knitwear', 'Sweatshirts', 'T-shirts', 'Polos', 'Formal', 'Leather', 'Swimwear'
  ],
  women: [
    'Outerwear', 'Coats', 'Blazers', 'Jackets', 'Knitwear', 'Tops', 'Sweatshirts', 'Denim', 'Pants', 'Shorts', 'Dresses', 'Jumpsuits', 'Skirts', 'Leather', 'Cocktail', 'Swimwear', 'Lingerie'
  ]
};

const AddProductPage = () => {
  const [name, setName] = useState('');
  const [productAddress, setProductAddress] = useState('');
  const [gender, setGender] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
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
  const [products, setProducts] = useState<Product[]>([]);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const router = useRouter();
  const { collectionId } = useParams();
  const userId = 'test-user-id'; // Replace this with actual user ID logic
  const [uploadedImages, setUploadedImages] = useState<string[]>(Array(5).fill(""));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      axios.get(`http://localhost:4000/api/collections/${collectionId}/products`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        setProducts(response.data);
      }).catch(error => {
        console.error('Error fetching products:', error);
      });
    }
  }, [collectionId, router]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!name || !productAddress || !gender || !category || !color || !price || !imageUrl1) {
      setError('Required fields are missing');
      return;
    }

    const numericPrice = parseFloat(price);
    const colorArray = color.split(',').map(c => c.trim());

    try {
      const response = await axios.post('http://localhost:4000/api/products', {
        name,
        productAddress,
        gender,
        category,
        color: colorArray,
        description,
        price: numericPrice,
        collectionId,
        collectionAddress: products.length > 0 ? products[0].collectionAddress : '', // Assuming all products in the collection have the same address
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
        setProducts([...products, response.data]);
        setName('');
        setProductAddress('');
        setGender('');
        setCategory('');
        setColor('');
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

  const handleDeleteProduct = async (id: string) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.delete(`http://localhost:4000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setProducts(products.filter(product => product._id !== id));
      } else {
        setError('Failed to delete product');
      }
    } catch (err) {
      setError('Error deleting product. Please try again.');
      console.error('Error deleting product:', err);
    }
    setDeleteProductId(null); // Close the confirmation dialog
  };

  const handleEditProduct = (product: Product) => {
    setEditProductId(product._id);
    setName(product.name);
    setProductAddress(product.productAddress);
    setGender(product.gender);
    setCategory(product.category);
    setColor(product.color.join(', '));
    setDescription(product.description);
    setPrice(product.price.toString());
    setImageUrl1(product.imageUrl1);
    setImageUrl2(product.imageUrl2 || '');
    setImageUrl3(product.imageUrl3 || '');
    setImageUrl4(product.imageUrl4 || '');
    setImageUrl5(product.imageUrl5 || '');
    setJsonUrl(product.jsonUrl || '');
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!name || !productAddress || !gender || !category || !color || !price || !imageUrl1) {
      setError('Required fields are missing');
      return;
    }

    const numericPrice = parseFloat(price);
    const colorArray = color.split(',').map(c => c.trim());

    try {
      const response = await axios.put(`http://localhost:4000/api/products/${editProductId}`, {
        name,
        productAddress,
        gender,
        category,
        color: colorArray,
        description,
        price: numericPrice,
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
        setProducts(products.map(product => product._id === editProductId ? response.data : product));
        setEditProductId(null);
        setName('');
        setProductAddress('');
        setGender('');
        setCategory('');
        setColor('');
        setDescription('');
        setPrice('');
        setImageUrl1('');
        setImageUrl2('');
        setImageUrl3('');
        setImageUrl4('');
        setImageUrl5('');
        setJsonUrl('');
      } else {
        setError('Failed to update product');
      }
    } catch (err) {
      setError('Error updating product. Please try again.');
      console.error('Error updating product:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditProductId(null);
    setName('');
    setProductAddress('');
    setGender('');
    setCategory('');
    setColor('');
    setDescription('');
    setPrice('');
    setImageUrl1('');
    setImageUrl2('');
    setImageUrl3('');
    setImageUrl4('');
    setImageUrl5('');
    setJsonUrl('');
  };

  const handleImageUpload = (imageUrl: string, index: number) => {
    setUploadedImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = imageUrl;
      return newImages;
    });
  };

  const trimAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4" style={{ paddingTop: '70px' }}>
      <div className="w-full max-w-2xl space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Products</h2>
        {products.map((product: Product) => (
          <Card key={product._id} className="flex justify-between items-center p-4 border rounded">
            <div className="flex items-center space-x-4">
              <Image 
                src={product.imageUrl1} 
                alt={product.name} 
                width={200} 
                height={200} 
                className="object-cover rounded-md"
                loading="lazy"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Price:</strong> ${product.price}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Token:</strong> {trimAddress(product.productAddress)}</p>
                <Link href={`/studio/products/${product._id}`} className="text-blue-500 hover:underline">
                  View Product
                </Link>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>Edit</Button>
              <Button variant="destructive" size="sm" onClick={() => setDeleteProductId(product._id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 w-full max-w-lg mx-auto bg-white dark:bg-black p-6 rounded shadow-md border dark:border-white">
        <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Upload Images</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(5)].map((_, index) => (
            <ImageDropzone key={index} userId={userId} onUpload={handleImageUpload} index={index} />
          ))}
        </div>
        <JSONForm uploadedImages={uploadedImages} />
        <JSONUpload />
      </div>

      <div className="mt-8 w-full max-w-lg p-8 bg-white dark:bg-gray-800 rounded shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">{editProductId ? 'Edit Product' : 'Add New Product'}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={editProductId ? handleUpdateProduct : handleAddProduct} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Name</label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" required />
          </div>
          <div>
            <label htmlFor="productAddress" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Product Address</label>
            <Input id="productAddress" value={productAddress} onChange={(e) => setProductAddress(e.target.value)} placeholder="Product Address" required />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Gender</label>
            <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
              <option value="" disabled>Select Gender</option>
              {genderOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
              <option value="" disabled>Select Category</option>
              {gender && categoryOptions[gender]?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="color" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Color</label>
            <Input id="color" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Product Colors (comma separated)" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Description</label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product Description" />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Price</label>
            <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Product Price" required />
          </div>
          <div>
            <label htmlFor="imageUrl1" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Image URL 1</label>
            <select id="imageUrl1" value={imageUrl1} onChange={(e) => setImageUrl1(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
              <option value="" disabled>Select Image</option>
              {uploadedImages.map((url, index) => url && <option key={index} value={url}>{url}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="imageUrl2" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Image URL 2</label>
            <select id="imageUrl2" value={imageUrl2} onChange={(e) => setImageUrl2(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
              <option value="" disabled>Select Image</option>
              {uploadedImages.map((url, index) => url && <option key={index} value={url}>{url}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="imageUrl3" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Image URL 3</label>
            <select id="imageUrl3" value={imageUrl3} onChange={(e) => setImageUrl3(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
              <option value="" disabled>Select Image</option>
              {uploadedImages.map((url, index) => url && <option key={index} value={url}>{url}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="imageUrl4" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Image URL 4</label>
            <select id="imageUrl4" value={imageUrl4} onChange={(e) => setImageUrl4(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
              <option value="" disabled>Select Image</option>
              {uploadedImages.map((url, index) => url && <option key={index} value={url}>{url}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="imageUrl5" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Image URL 5</label>
            <select id="imageUrl5" value={imageUrl5} onChange={(e) => setImageUrl5(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
              <option value="" disabled>Select Image</option>
              {uploadedImages.map((url, index) => url && <option key={index} value={url}>{url}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="jsonUrl" className="block text-sm font-bold text-gray-700 dark:text-gray-300">JSON URL</label>
            <Input id="jsonUrl" value={jsonUrl} onChange={(e) => setJsonUrl(e.target.value)} placeholder="JSON URL" />
          </div>
          <Button type="submit" className="w-full">{editProductId ? 'Update Product' : 'Add Product'}</Button>
          {editProductId && (
            <Button type="button" className="w-full mt-2" onClick={handleCancelEdit}>Cancel Edit</Button>
          )}
        </form>
      </div>

      {deleteProductId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this product?</h3>
            <div className="flex space-x-4">
              <Button variant="destructive" onClick={() => handleDeleteProduct(deleteProductId)}>Yes, Delete</Button>
              <Button variant="outline" onClick={() => setDeleteProductId(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductPage;
