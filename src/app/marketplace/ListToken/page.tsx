// src/app/marketplace/ListToken/page.tsx

"use client";


import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { notify } from '@/utils/notifications';

interface NFT {
  mintAddress: string;
  uiAmount: number;
  name: string;
}

const ListToken: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<string>('');
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!connected || !publicKey) return;

      const connection = new Connection('https://api.devnet.solana.com');
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      });

      const nftList: NFT[] = await Promise.all(
        tokenAccounts.value.map(async (accountInfo) => {
          const mintAddress = accountInfo.account.data.parsed.info.mint;
          const uiAmount = accountInfo.account.data.parsed.info.tokenAmount.uiAmount;
          // Fetch metadata (e.g., name) for the NFT here if needed
          const name = `NFT ${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`; // Placeholder name
          return { mintAddress, uiAmount, name };
        })
      );

      setNfts(nftList);
    };

    fetchNFTs();
  }, [connected, publicKey]);

  const handleListNFT = async () => {
    if (!connected) {
      notify({ type: 'error', message: 'Please connect your wallet' });
      return;
    }

    if (!selectedNFT) {
      notify({ type: 'error', message: 'Please select an NFT to list' });
      return;
    }

    try {
      // Replace with your blockchain listing logic here
      // For now, we just log the selected NFT and price
      console.log('Listing NFT:', selectedNFT, 'for price:', price * LAMPORTS_PER_SOL);
      
      notify({ type: 'success', message: 'NFT listed for sale' });
    } catch (error) {
      if (error instanceof Error) {
        notify({ type: 'error', message: error.message });
      } else {
        notify({ type: 'error', message: 'An unknown error occurred' });
      }
    }
  };

  return (
    <div>
      <h2>List NFT for Sale</h2>
      <div>
        <h3>Select an NFT</h3>
        {nfts.map((nft) => (
          <div key={nft.mintAddress}>
            <label>
              <input
                type="radio"
                name="nft"
                value={nft.mintAddress}
                onChange={(e) => setSelectedNFT(e.target.value)}
              />
              {nft.name} - {nft.uiAmount} units
            </label>
          </div>
        ))}
      </div>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="Price in SOL"
      />
      <button onClick={handleListNFT}>List NFT</button>
    </div>
  );
};

export default ListToken;
