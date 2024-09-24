//src/utils/fetchAssetsByOwner.ts



import { Connection, PublicKey, ParsedAccountData } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, options: RequestInit, retries: number = 5, backoff: number = 500) => {
    for (let i = 0; i < retries; i++) {
        const response = await fetch(url, options);
        if (response.status === 429) {
            console.warn(`Server responded with 429. Retrying after ${backoff}ms delay...`);
            await delay(backoff);
            backoff *= 2; // Exponential backoff
        } else {
            return response;
        }
    }
    throw new Error('Max retries reached');
};

export const fetchAssetsByOwner = async (ownerAddress: string, connection: Connection) => {
    try {
        const ownerPublicKey = new PublicKey(ownerAddress);

        const [tokenAccounts, token2022Accounts] = await Promise.all([
            connection.getParsedTokenAccountsByOwner(ownerPublicKey, {
                programId: TOKEN_PROGRAM_ID,
            }),
            connection.getParsedTokenAccountsByOwner(ownerPublicKey, {
                programId: TOKEN_2022_PROGRAM_ID,
            }),
        ]);

        const assets = [...tokenAccounts.value, ...token2022Accounts.value];

        console.log('Number of assets retrieved:', assets.length);

        return assets.map((asset) => {
            const parsedInfo = (asset.account.data as ParsedAccountData).parsed.info;
            return {
                pubkey: asset.pubkey.toString(),
                mint: parsedInfo.mint,
            };
        });
    } catch (error) {
        console.error('Error fetching assets:', error);
        throw error;
    }
};
