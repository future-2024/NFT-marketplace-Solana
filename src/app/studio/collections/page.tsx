// src/app/studio/collections/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface Collection {
  _id: string;
  name: string;
  collectionAddress: string;
  imageUrl: string;
  jsonUrl: string;
  designerId: string;
  designerUsername: string;
  products: string[];
}

const CollectionsPage = () => {
  const [name, setName] = useState('');
  const [collectionAddress, setCollectionAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [jsonUrl, setJsonUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editCollectionId, setEditCollectionId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      axios.get('http://localhost:4000/api/collections', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        setCollections(response.data);
      }).catch(error => {
        console.error('Error fetching collections:', error);
      });
    }
  }, [router]);

  const handleAddCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!name || !collectionAddress || !imageUrl || !jsonUrl) {
      setError('All fields are required');
      return;
    }

    console.log('Sending data:', { name, collectionAddress, imageUrl, jsonUrl });

    try {
      const response = await axios.post('http://localhost:4000/api/collections', {
        name,
        collectionAddress,
        imageUrl,
        jsonUrl,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        setSuccess('Collection added successfully');
        setCollections([...collections, response.data]);
        setName('');
        setCollectionAddress('');
        setImageUrl('');
        setJsonUrl('');
      } else {
        setError('Failed to add collection');
      }
    } catch (err) {
      setError('Error adding collection. Please try again.');
      console.error('Error adding collection:', err);
    }
  };

  const handleEditCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!name || !collectionAddress || !imageUrl || !jsonUrl) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:4000/api/collections/${editCollectionId}`, {
        name,
        collectionAddress,
        imageUrl,
        jsonUrl,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setSuccess('Collection edited successfully');
        setCollections(collections.map(collection =>
          collection._id === editCollectionId ? response.data : collection
        ));
        setEditMode(false);
        setEditCollectionId('');
        setName('');
        setCollectionAddress('');
        setImageUrl('');
        setJsonUrl('');
      } else {
        setError('Failed to edit collection');
      }
    } catch (err) {
      setError('Error editing collection. Please try again.');
      console.error('Error editing collection:', err);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.delete(`http://localhost:4000/api/collections/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setCollections(collections.filter(collection => collection._id !== id));
      } else {
        setError('Failed to delete collection');
      }
    } catch (err) {
      setError('Error deleting collection. Please try again.');
      console.error('Error deleting collection:', err);
    }
  };

  const startEditCollection = (collection: Collection) => {
    setEditMode(true);
    setEditCollectionId(collection._id);
    setName(collection.name);
    setCollectionAddress(collection.collectionAddress);
    setImageUrl(collection.imageUrl);
    setJsonUrl(collection.jsonUrl);
  };

  const navigateToProductsPage = (id: string) => {
    router.push(`/studio/collections/${id}/products`);
  };

  const trimAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-background p-4">
      <div className="w-full max-w-lg p-8 bg-card dark:bg-card rounded shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-foreground dark:text-foreground">
          {editMode ? 'Edit Collection' : 'Add New Collection'}
        </h2>
        {error && <p className="text-destructive dark:text-destructive-foreground mb-4">{error}</p>}
        {success && <p className="text-green-500 dark:text-green-400 mb-4">{success}</p>}
        <form onSubmit={editMode ? handleEditCollection : handleAddCollection} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground dark:text-foreground">Name</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Collection Name"
              required
            />
          </div>
          <div>
            <label htmlFor="collectionAddress" className="block text-sm font-medium text-foreground dark:text-foreground">Collection Address</label>
            <Input
              id="collectionAddress"
              value={collectionAddress}
              onChange={(e) => setCollectionAddress(e.target.value)}
              placeholder="Collection Address"
              required
            />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-foreground dark:text-foreground">Image URL</label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL"
              required
            />
          </div>
          <div>
            <label htmlFor="jsonUrl" className="block text-sm font-medium text-foreground dark:text-foreground">JSON URL</label>
            <Input
              id="jsonUrl"
              value={jsonUrl}
              onChange={(e) => setJsonUrl(e.target.value)}
              placeholder="JSON URL"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {editMode ? 'Save Changes' : 'Add Collection'}
          </Button>
          {editMode && (
            <Button type="button" className="w-full" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          )}
        </form>
      </div>
      <div className="w-full max-w-2xl space-y-4">
        {collections.map((collection: Collection) => (
          <Card key={collection._id} className="flex flex-col p-4 border rounded bg-card dark:bg-card text-foreground dark:text-foreground">
            <div className="flex items-center mb-4">
              <Image src={collection.imageUrl} alt={collection.name} width={80} height={80} className="object-cover rounded-md" />
              <div className="flex flex-col ml-4">
                <h3 className="text-lg font-semibold text-foreground dark:text-foreground">{collection.name}</h3>
                <p className="text-sm text-foreground dark:text-foreground">
                  <strong>Collection Address:</strong> 
                  <Link href={`/explorer/collections/${collection.collectionAddress}`} className="flex items-center space-x-1 hover:underline">
                    <span>{trimAddress(collection.collectionAddress)}</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Button variant="default" onClick={() => navigateToProductsPage(collection._id)}>Add Products</Button>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => startEditCollection(collection)}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteCollection(collection._id)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
);

  
};

export default CollectionsPage;
