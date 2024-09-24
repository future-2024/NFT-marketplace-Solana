// STRAIGHT SOLANA DEVNET FETCH TOKEN 

import { Connection, PublicKey } from '@solana/web3.js';
import { getMint, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';

const SOLANA_RPC_ENDPOINT = 'https://api.devnet.solana.com'; // Use the appropriate RPC endpoint
const TOKEN_MINT_ADDRESS = 'EGVotg1ePDkG7k2Z738YSjuUDwnPQvMK8vdkaQy9xxfU'; // Replace with your token mint address

async function getTokenDetails() {
    try {
        // Create a connection to the Solana devnet
        const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed');

        // Convert the token mint address to a PublicKey
        const mintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);

        // Fetch the token mint account details using TOKEN_2022_PROGRAM_ID
        const mintInfo = await getMint(connection, mintPublicKey, undefined, TOKEN_2022_PROGRAM_ID);

        // Print token details
        console.log('Token Mint Address:', mintPublicKey.toBase58());
        console.log('Decimals:', mintInfo.decimals);
        console.log('Supply:', mintInfo.supply.toString());
        console.log('Mint Authority:', mintInfo.mintAuthority?.toBase58() ?? 'None');
        console.log('Freeze Authority:', mintInfo.freezeAuthority?.toBase58() ?? 'None');
    } catch (error) {
        console.error('Error fetching token details:', error);
    }
}

getTokenDetails();
