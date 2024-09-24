//src/utils/getNFTs.ts

const NFTURL = `https://devnet.helius-rpc.com/?api-key=ebe57d8c-01ae-4317-957e-d350790af639`;

export const getAssetsByOwnerNFT = async (ownerAddress: string) => {
    const response = await fetch(NFTURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'my-id',
            method: 'getAssetsByOwner',
            params: {
                ownerAddress,
                page: 1, // Starts at 1
                limit: 1000,
            },
        }),
    });

    const data = await response.json();
    if (data.result && data.result.items) {
        return data.result.items.map((item: any) => item.id);
    } else {
        throw new Error('Failed to fetch NFTs');
    }
};
