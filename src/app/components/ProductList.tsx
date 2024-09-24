// src/app/components/ProductList.tsx

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  productAddress: string;
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

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="w-full max-w-2xl space-y-4">
      {products.map((product: Product) => (
        <Card key={product._id} className="flex justify-between items-center p-4 border rounded">
          <div className="flex items-center space-x-4">
            <Image src={product.imageUrl1} alt={product.name} width={80} height={80} className="object-cover rounded-md" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{product.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Price:</strong> ${product.price}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(product)}>Edit</Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(product._id)}>Delete</Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProductList;
