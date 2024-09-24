//src/app/studio/mint/components/MintNFT.tsx
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { FC, useCallback, useState } from 'react';
import { createTokenAndMint, generateExplorerUrl, createTokenMetadata } from '../extension-nft/nftmint';
import { Keypair } from '@solana/web3.js';
import TransactionModal from './TransactionModal';
import CopyLink from './CopyLink';
import axios from 'axios';

interface MetaDataType {
    name: string;
    symbol: string;
    groupAddr: string;
    jsonURI: string;
}

export const MintNFT: FC<MetaDataType> = ({ name, symbol, groupAddr, jsonURI }: MetaDataType) => {
    const { publicKey, sendTransaction, signTransaction } = useWallet();
    const { connection } = useConnection();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nftlink, setNftlink] = useState("");
    const [mintAddress, setMintAddress] = useState("");

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const saveNFTToDB = async (mintAddress: string) => {
        try {
            const token = localStorage.getItem('token'); // Assuming you store the token in local storage
            const response = await axios.post('http://localhost:4000/api/saveNFT', {
                tokenAddress: mintAddress,
                walletAddress: publicKey?.toString(),
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                console.log('NFT saved successfully:', response.data.nft);
            } else {
                console.error('Failed to save NFT:', response.data.message);
            }
        } catch (error) {
            console.error('Error saving NFT:', error);
        }
    };

    const onClick = useCallback(async () => {
        if (!publicKey) {
            console.error("Wallet not connected");
            return;
        }

        const mintKeyPair = Keypair.generate();
        const mint = mintKeyPair.publicKey;
        const authority = publicKey;
        const owner = publicKey;

        const tokenMetadata = createTokenMetadata(publicKey, mint, name, symbol, jsonURI, groupAddr);

        try {
            const [initSig, mintSig] = await createTokenAndMint(publicKey, mint, authority, tokenMetadata, mintKeyPair, owner, sendTransaction, signTransaction, connection);

            console.log(`Token created and minted:`);
            console.log(`   ${generateExplorerUrl(initSig)}`);
            console.log(`   ${generateExplorerUrl(mintSig)}`);
            
            console.log(`New NFT:`);
            console.log(`   ${generateExplorerUrl(mint.toBase58(), true)}`);
            setNftlink(generateExplorerUrl(mint.toBase58(), true));
            setMintAddress(mint.toBase58());

            await saveNFTToDB(mint.toBase58());

            openModal();
        } catch (error) {
            console.error("Minting failed", error);
        }
    }, [publicKey, name, symbol, groupAddr, jsonURI, sendTransaction, signTransaction, connection]);

    return (
        <div className="flex flex-row justify-center">
            <div className="relative group items-center">
                <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <button
                    className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                    onClick={onClick} disabled={!publicKey}
                >
                    <div className="hidden group-disabled:block">
                        Wallet not connected
                    </div>
                    <span className="block group-disabled:hidden">
                        Mint NFT
                    </span>
                </button>
            </div>
            <TransactionModal isOpen={isModalOpen} onClose={closeModal}>
                <h2 className="text-xl font-semibold text-gray-900">NFT minted successfully</h2>
                <CopyLink value={mintAddress} explorerLink={nftlink} />
            </TransactionModal>
        </div>
    );
};
