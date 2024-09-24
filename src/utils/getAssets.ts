// src/utils/getAssets.ts

const assetURL = `https://devnet.helius-rpc.com/?api-key=ebe57d8c-01ae-4317-957e-d350790af639`;

export const getAssetsByOwner = async (ownerAddress: string) => {
  try {
    const response = await fetch(assetURL, {
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
          page: 1,
          limit: 1000,
          displayOptions: {
            showFungible: true,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched assets data:', data);

    if (data.result && data.result.items) {
      return data.result.items;
    } else {
      throw new Error('Failed to fetch assets: No result or items field in response');
    }
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

export const fetchNFTDetails = async (jsonUri: string) => {
  try {
    const response = await fetch(jsonUri);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return {
      image: data.image,
    };
  } catch (error) {
    console.error('Error fetching NFT details:', error);
    return {
      image: '',
    };
  }
};

export const extractGroupAddress = (asset: any) => {
  try {
    // Check the additional_metadata array
    const metadata = asset.mint_extensions?.metadata?.additional_metadata;
    if (metadata && Array.isArray(metadata) && metadata.length > 0) {
      for (let item of metadata) {
        if (item[0] === 'Group address') {
          return item[1];
        }
      }
    }

    // Check the group_pointer object
    const groupPointer = asset.mint_extensions?.group_pointer;
    if (groupPointer && groupPointer.group_address) {
      return groupPointer.group_address;
    }
  } catch (error) {
    console.error('Error extracting group address:', error);
  }
  return '';
};
