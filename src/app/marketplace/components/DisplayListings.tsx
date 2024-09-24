// src/app/marketplace/components/DisplayListings.tsx
import { useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface Product {
  name: string;
  productAddress: string;
  price: number;
  imageUrl1: string;
}

const DisplayListings: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchListedProducts = async () => {
      const response = await fetch('/api/products/listed');
      const data = await response.json();
      setProducts(data);
    };

    fetchListedProducts();
  }, []);

  return (
    <div>
      <h2>Listed Products</h2>
      {products.map((product, index) => (
        <div key={index}>
          <img src={product.imageUrl1} alt={product.name} />
          <p>Name: {product.name}</p>
          <p>Price: {product.price / LAMPORTS_PER_SOL} SOL</p>
        </div>
      ))}
    </div>
  );
};

export default DisplayListings;
