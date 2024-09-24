//src/studio/mint/components/nftmint.ts

import {
    Connection,
    Keypair,
    SystemProgram,
    Transaction,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction,
    clusterApiUrl,
    PublicKey
} from '@solana/web3.js';
import {
    TOKEN_2022_PROGRAM_ID,
    createInitializeMintInstruction,
    mintTo,
    createAssociatedTokenAccountIdempotent,
    AuthorityType,
    createInitializeMetadataPointerInstruction,
    createAssociatedTokenAccountIdempotentInstruction,
    TYPE_SIZE,
    LENGTH_SIZE,
    getMintLen,
    ExtensionType,
    getMint,
    getMetadataPointerState,
    getTokenMetadata,
    createSetAuthorityInstruction,
    getOrCreateAssociatedTokenAccount,
    getAssociatedTokenAddressSync,
    createMintToInstruction,
    ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
    createInitializeInstruction,
    createUpdateFieldInstruction,
    createRemoveKeyInstruction,
    pack,
    TokenMetadata,
} from '@solana/spl-token-metadata';
import bs58 from 'bs58'
import { SignerWalletAdapterProps, WalletAdapterProps } from '@solana/wallet-adapter-base';


export const createTokenMetadata = (authority: PublicKey, mint: PublicKey, name: string, symbol: string, uri: string, address: string): TokenMetadata => {
    const tokenMetadata: TokenMetadata = {
        updateAuthority: authority,
        mint: mint,
        name: name,
        symbol: symbol,
        uri: uri,
        additionalMetadata: [
            ["Group address", address]
        ],
    };
    return tokenMetadata;
}

export function generateExplorerUrl(identifier: string, isAddress: boolean = false): string {
    if (!identifier) return '';
    const baseUrl = 'https://solana.fm';
    const slug = isAddress ? 'address' : 'token';
    return `${baseUrl}/${slug}/${identifier}`;
}

export async function createTokenAndMint(
    payer: PublicKey,
    mint: PublicKey,
    authority: PublicKey,
    tokenMetadata: TokenMetadata,
    mintKeypair: Keypair,
    owner: PublicKey,
    sendTransaction: WalletAdapterProps["sendTransaction"],
    signTransaction: SignerWalletAdapterProps["signTransaction"] | undefined,
    connection: Connection
): Promise<[string, string]> {
    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const metadataLen = 64 + pack(tokenMetadata).length; // Adjust the metadata length calculation
    const mintLamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

    const latestBlockhash = await connection.getLatestBlockhash();
    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: mint,
            space: mintLen,
            lamports: mintLamports,
            programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMetadataPointerInstruction(mint, authority, mint, TOKEN_2022_PROGRAM_ID),
        createInitializeMintInstruction(mint, 0, authority, null, TOKEN_2022_PROGRAM_ID),
        createInitializeInstruction({
            programId: TOKEN_2022_PROGRAM_ID,
            metadata: mint,
            updateAuthority: authority,
            mint: mint,
            mintAuthority: authority,
            name: tokenMetadata.name,
            symbol: tokenMetadata.symbol,
            uri: tokenMetadata.uri,
        }),
        createUpdateFieldInstruction({
            programId: TOKEN_2022_PROGRAM_ID,
            metadata: mint,
            updateAuthority: authority,
            field: tokenMetadata.additionalMetadata[0][0],
            value: tokenMetadata.additionalMetadata[0][1],
        })
    );

    const signature = await sendTransaction(transaction, connection, { signers: [mintKeypair] });
    await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');

    const sourceAccount = await createAssociatedTokenAccount(mint, owner, payer, connection, sendTransaction);
    const mintTransaction = new Transaction().add(
        createMintToInstruction(mint, sourceAccount, authority, 1, [], TOKEN_2022_PROGRAM_ID)
    );

    const mintSig = await sendTransaction(mintTransaction, connection);
    await connection.confirmTransaction({ signature: mintSig, ...latestBlockhash }, 'confirmed');

    return [signature, mintSig];
}

const createAssociatedTokenAccount = async (
    mint: PublicKey,
    owner: PublicKey,
    payer: PublicKey,
    connection: Connection,
    sendTransaction: WalletAdapterProps["sendTransaction"]
) => {
    const sourceAccount = await getAssociatedTokenAddressSync(mint, owner, false, TOKEN_2022_PROGRAM_ID);
    const associatedTokenAccountTransaction = new Transaction().add(
        createAssociatedTokenAccountIdempotentInstruction(payer, sourceAccount, owner, mint, TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID)
    );

    const latestBlockhash = await connection.getLatestBlockhash();
    const tokenSign = await sendTransaction(associatedTokenAccountTransaction, connection);
    await connection.confirmTransaction({ signature: tokenSign, ...latestBlockhash }, 'confirmed');

    return sourceAccount;
}
