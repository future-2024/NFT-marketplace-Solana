import { extractGroupAddress } from "./getAssets";

//src/utils/getToken.ts
const url = `https://devnet.helius-rpc.com/?api-key=ebe57d8c-01ae-4317-957e-d350790af639`;

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

export const getAsset = async (tokenAddress: string) => {
    try {
        console.log(`Fetching asset details for token: ${tokenAddress}`);
        const response = await fetchWithRetry(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'my-id',
                method: 'getAsset',
                params: {
                    id: tokenAddress
                },
            }),
        });

        const { result } = await response.json();

        if (!result || !result.content || !result.content.metadata) {
            throw new Error('Invalid response structure');
        }
        const groupAddress = extractGroupAddress(result)
        
        const dataProfile = {
            name: result.content.metadata.name || 'Unknown',
            description: result.content.metadata.description || 'No description',
            imageURI: result.content.links.image || '',
            jsonURI: result.content.json_uri || '',
            groupAddress
        };

        console.log("Data Profile: ", dataProfile);
        return dataProfile;
    } catch (error) {
        console.error('Error fetching asset data:', error);
        return {
            name: 'Unknown',
            description: 'No description',
            imageURI: '',
            jsonURI: '',
            groupAddress: '',
        };
    }
};
