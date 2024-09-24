//src/app/studio/account/components/TokenModal.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { getAsset } from '@/utils/getToken';

interface TokenModalProps {
  tokenAddress: string;
  isOpen: boolean;
  onClose: () => void;
}

const TokenModal: React.FC<TokenModalProps> = ({ tokenAddress, isOpen, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenDetails, setTokenDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      getAsset(tokenAddress)
        .then((details) => {
          setTokenDetails(details);
        })
        .catch((err) => {
          setError('Failed to fetch token details');
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, tokenAddress]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <button onClick={onClose} className="float-right">X</button>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          tokenDetails && (
            <div>
              <h2>{tokenDetails.name}</h2>
              <img src={tokenDetails.imageURI} alt={tokenDetails.name} />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TokenModal;
