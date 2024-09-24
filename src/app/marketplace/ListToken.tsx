// src/app/marketplace/ListToken/page.tsx
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { notify } from '@/utils/notifications';

const ListToken: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [tokenMintAddress, setTokenMintAddress] = useState<string>('');
  const [price, setPrice] = useState<number>(0);

  const handleListToken = async () => {
    if (!connected) {
      notify({ type: 'error', message: 'Please connect your wallet' });
      return;
    }

    const connection = new Connection('https://api.devnet.solana.com');
    const tokenMint = new PublicKey(tokenMintAddress);

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey!, {
      mint: tokenMint,
    });

    if (tokenAccounts.value.length === 0) {
      notify({ type: 'error', message: 'Token account not found' });
      return;
    }

    const tokenAccountInfo = tokenAccounts.value[0];
    const tokenAmount = tokenAccountInfo.account.data.parsed.info.tokenAmount.uiAmount;

    if (tokenAmount === 0) {
      notify({ type: 'error', message: 'You do not own this token' });
      return;
    }

    try {
      const response = await fetch('/api/products/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenMint: tokenMintAddress,
          price: price * LAMPORTS_PER_SOL,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to list token');
      }

      notify({ type: 'success', message: 'Token listed for sale' });
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
      <h2>List Token for Sale</h2>
      <input
        type="text"
        value={tokenMintAddress}
        onChange={(e) => setTokenMintAddress(e.target.value)}
        placeholder="Token Mint Address"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="Price in SOL"
      />
      <button onClick={handleListToken}>List Token</button>
    </div>
  );
};

export default ListToken;
