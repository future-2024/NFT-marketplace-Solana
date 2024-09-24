//src/app/studio/mint/page.tsx

"use client";

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { RequestAirdrop } from './components/RequestAirdrop';
import useUserSOLBalanceStore from './stores/useUserSOLBalanceStore';
import { TextInput } from './components/TextInput';
import { MintNFT as MintNFTComponent } from './components/MintNFT';

const MintNFT: FC = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [name, setName] = useState<string>('');
    const [symbol, setSymbol] = useState<string>('');
    const [groupAddr, setGroupAddr] = useState<string>('');
    const [jsonURI, setJsonURI] = useState<string>('');

    const balance = useUserSOLBalanceStore((s) => s.balance);
    const { getUserSOLBalance } = useUserSOLBalanceStore();

    useEffect(() => {
        const fetchBalance = async () => {
            if (wallet.publicKey) {
                try {
                    console.log(wallet.publicKey.toBase58());
                    await getUserSOLBalance(wallet.publicKey, connection);
                } catch (error) {
                    console.error("Error getting balance:", error);
                }
            }
        };

        fetchBalance();
    }, [wallet.publicKey, connection, getUserSOLBalance]);

    return (
        <div className="md:hero mx-auto p-4">
            <div className="md:hero-content flex flex-col">
                <div className='mt-6'>
                    <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
                        NFT Mint
                    </h1>
                </div>
                <div className="flex flex-col mt-2">
                    <RequestAirdrop />
                    <h4 className="md:w-full text-2xl text-slate-300 my-2">
                        {wallet &&
                            <div className="flex flex-row justify-center">
                                <div>
                                    {(balance || 0).toLocaleString()}
                                </div>
                                <div className='text-slate-600 ml-2'>
                                    SOL
                                </div>
                            </div>
                        }
                    </h4>
                </div>
                <div className="flex flex-col items-center space-y-4">
                    <TextInput label="Name" placeholder={"Input the name"} value={name} onChange={setName} />
                    <TextInput label="Symbol" placeholder={"Input the Symbol"} value={symbol} onChange={setSymbol} />
                    <TextInput label="Group Address" placeholder={"Input the Group address"} value={groupAddr} onChange={setGroupAddr} />
                    <TextInput label="JSON URI" placeholder={"Input the Json URI"} value={jsonURI} onChange={setJsonURI} />
                </div>
                <MintNFTComponent name={name} symbol={symbol} groupAddr={groupAddr} jsonURI={jsonURI} />
                <div className="mt-4">
                    <Link href="/studio/account">
                        <span className="text-blue-500 hover:text-blue-700">Go to Account Page</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MintNFT;
