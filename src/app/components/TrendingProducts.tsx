// src/app/components/TrendingProducts.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

const TrendingProducts = ({ productIds }: { productIds: string[] }) => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await Promise.all(
          productIds.map(async (id) => {
            const response = await axios.get(`/api/public/products/${id}`);
            return response.data;
          })
        );
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      }
    };

    fetchProducts();
  }, [productIds]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Trending Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <Card key={product._id} className="p-4 border rounded">
            <div className="flex items-center space-x-4">
              <Image src={product.imageUrl1} alt={product.name} width={80} height={80} className="object-cover rounded-md" />
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600"><strong>Price:</strong> ${product.price}</p>
                <Link href={`/discover/products/${product._id}`} className="text-blue-500 hover:underline">
                  View Product
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrendingProducts;