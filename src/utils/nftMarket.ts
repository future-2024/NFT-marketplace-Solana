import * as anchor from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Keypair,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  getTokenMetadata,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";
import { WalletAdapterProps } from "@solana/wallet-adapter-base";
import { readFileSync } from "fs";
import { resolve } from "path";
import { SolanaNftMarketplace, IDL } from "./types/solana_nft_marketplace";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { NFTDetail } from "@/app/marketplace/page";

const PREFIX = "MARKETPLACE";
const programId = new PublicKey("FX2TuF4AsoxvbkNC95CK5RGdkpdMWFsPszULZy68Kexp");

async function loadProgram(connection: Connection, provider: any) {
  //const provider = new anchor.AnchorProvider(connection, wallet, {});
  anchor.setProvider(provider);

  const program = new anchor.Program<SolanaNftMarketplace>(IDL, programId);

  return program;
}

export async function listNFT(
  seller: PublicKey,
  nftAccount: PublicKey,
  mint: PublicKey,
  price: number,
  connection: Connection,
  sendTransaction: WalletAdapterProps["sendTransaction"],
  wallet: any,
  provider: anchor.AnchorProvider
) {
  const program = await loadProgram(connection, provider);
  const [vault, vaultBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(PREFIX), Buffer.from("vault"), mint.toBytes()],
    programId
  );

  const listing = anchor.web3.Keypair.generate();
  console.log("PRICE:", price);
  const data = new BN(price * 1000000);
  let latestBlock = (await provider.connection.getLatestBlockhash("finalized"))
    .blockhash;

  console.log("vault:", vault.toBase58());
  const instruction: TransactionInstruction = await program.methods
    .listNft(data)
    .accounts({
      listing: listing.publicKey,
      seller: seller,
      nftAccount: nftAccount,
      mint: mint,
      vault: vault,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    })
    .instruction();

  const transaction = new Transaction().add(instruction);

  transaction.recentBlockhash = latestBlock;
  transaction.feePayer = seller;

  transaction.partialSign(listing);
  console.log("signed with listing");

  const signedTransaction = await provider.wallet.signTransaction(transaction);

  console.log("signed", signedTransaction);

  const signature = await connection.sendRawTransaction(
    signedTransaction.serialize()
  );
  await provider.connection.confirmTransaction(signature);

  console.log("NFT listed successfully", listing.publicKey.toString());
}

export async function withdrawNFT() {}

export async function buyNFT(
  mint: PublicKey,
  seller: PublicKey,
  listing: PublicKey,
  buyer: PublicKey,
  provider: anchor.AnchorProvider,
  sendTransaction: WalletAdapterProps["sendTransaction"],
  connection: Connection
) {
  const program = await loadProgram(connection, provider);
  console.log("seller:", seller.toBase58());
  const sellerNFTTokenAccount = await getAssociatedTokenAddress(
    mint,
    seller,
    false,
    TOKEN_2022_PROGRAM_ID
  );
  const SOLANA_USDC_PUBKEY = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";
  const usdcMint = new PublicKey(SOLANA_USDC_PUBKEY);

  let buyerUSDCAccount = await getAssociatedTokenAddress(
    usdcMint,
    buyer,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  console.log(buyer.toBase58());

  const buyerUSDCAccountInfo = await connection.getAccountInfo(
    buyerUSDCAccount
  );
  if (buyerUSDCAccountInfo == null) {
    console.log("creating usdc associated token account");
    await createAssociatedAccount(
      buyer,
      buyerUSDCAccount,
      buyer,
      usdcMint,
      provider,
      sendTransaction,
      connection
    );
    console.log("created usdc account");
  }

  let sellerUSDCAccount = await getAssociatedTokenAddress(
    usdcMint,
    seller,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const sellerUSDCAccountInfo = await connection.getAccountInfo(
    sellerUSDCAccount
  );
  if (sellerUSDCAccountInfo == null) {
    console.log("creating usdc associated token account");
    await createAssociatedAccount(
      buyer,
      sellerUSDCAccount,
      seller,
      usdcMint,
      provider,
      sendTransaction,
      connection
    );
    console.log("created usdc account");
  }

  const buyerTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    buyer,
    usdcMint,
    buyer
  );
  console.log(buyerTokenAccount);

  const buyerTokenAccountInfo = await getAccount(
    connection,
    buyerTokenAccount.address,
    "confirmed",
    TOKEN_PROGRAM_ID
  );
  console.log(
    "buyer associated account Info address:",
    buyerTokenAccount.address.toBase58()
  );
  console.log("buyer accountInfo:", buyerTokenAccountInfo.amount);

  const sellerTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    buyer,
    usdcMint,
    seller
  );
  console.log(sellerTokenAccount);

  const sellerTokenAccountInfo = await getAccount(
    connection,
    sellerTokenAccount.address,
    "confirmed",
    TOKEN_PROGRAM_ID
  );
  console.log(
    "seller associated account Info address:",
    sellerTokenAccount.address.toBase58()
  );
  console.log("seller accountInfo:", sellerTokenAccountInfo.amount);

  // const [listing, listingBump] = PublicKey.findProgramAddressSync(
  //   [Buffer.from(PREFIX), Buffer.from("vault"), mint.toBytes()],
  //   programId
  // );
  const listingInfo = await connection.getAccountInfo(listing);
  console.log("owner of listing:", listingInfo?.owner.toBase58());

  let buyerNFTTokenAccount = await getAssociatedTokenAddress(
    mint,
    buyer,
    false,
    TOKEN_2022_PROGRAM_ID
  );
  let buyerNFTTokenAccountInfo = await provider.connection.getAccountInfo(
    buyerNFTTokenAccount
  );
  //Create associated token account for the buyer
  if (buyerNFTTokenAccountInfo == null) {
    console.log("Creating buyer associated account");
    const associatedTokenAccountTransaction = new Transaction().add(
      createAssociatedTokenAccountIdempotentInstruction(
        buyer,
        buyerNFTTokenAccount,
        buyer,
        mint,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );
    const latestBlockhash = await provider.connection.getLatestBlockhash();
    const tokenSign = await sendTransaction(
      associatedTokenAccountTransaction,
      connection
    );
    await provider.connection.confirmTransaction(
      { signature: tokenSign, ...latestBlockhash },
      "confirmed"
    );
    console.log("Buyer associated account created");
  }
  const [vault, vaultBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(PREFIX), Buffer.from("vault"), mint.toBytes()],
    programId
  );

  console.log("listing:", listing.toBase58());

  console.log("vault", vault);
  const data = new BN(vaultBump);
  console.log(data);
  console.log("nftAccount:", sellerNFTTokenAccount.toBase58());
  const instruction: TransactionInstruction = await program.methods
    .buyNft(vaultBump)
    .accounts({
      listing: listing,
      vault: vault,
      buyer: buyer,
      seller: sellerTokenAccount.address,
      nftAccount: sellerNFTTokenAccount,
      buyerTokenAccount: buyerTokenAccount.address,
      buyerNftAccount: buyerNFTTokenAccount,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      tokenProgramUsdc: TOKEN_PROGRAM_ID,
    })
    .instruction();
  console.log("Instruction to buy:", instruction);

  console.log("buyer token account:", buyerTokenAccount.address.toBase58());
  const transaction = new Transaction().add(instruction);
  let latestBlock = (await provider.connection.getLatestBlockhash("finalized"))
    .blockhash;
  transaction.recentBlockhash = latestBlock;
  transaction.feePayer = buyer;
  console.log("transaction:", transaction);
  const signedTransaction = await provider.wallet.signTransaction(transaction);

  console.log("transaction signed");
  const signature = await connection.sendRawTransaction(
    signedTransaction.serialize()
  );
  await provider.connection.confirmTransaction(signature);
  console.log("NFT sold");
}

export async function RemoveNFTList(
  seller: PublicKey,
  mint: PublicKey,
  listing: PublicKey,
  provider: anchor.AnchorProvider,
  connection: Connection
) {
  const program = await loadProgram(connection, provider);

  const sellerNFTTokenAccount = await getAssociatedTokenAddress(
    mint,
    seller,
    false,
    TOKEN_2022_PROGRAM_ID
  );
  const [vault, vaultBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(PREFIX), Buffer.from("vault"), mint.toBytes()],
    programId
  );

  const instruction: TransactionInstruction = await program.methods
    .removeListedNft()
    .accounts({
      seller: seller,
      listing: listing,
      nftAccount: sellerNFTTokenAccount,
      mint: mint,
      vault: vault,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    })
    .instruction();

  let latestBlock = (await provider.connection.getLatestBlockhash("finalized"))
    .blockhash;
  const transaction = new Transaction().add(instruction);
  transaction.recentBlockhash = latestBlock;
  transaction.feePayer = seller;

  const signedTransaction = await provider.wallet.signTransaction(transaction);

  const signature = await connection.sendRawTransaction(
    signedTransaction.serialize()
  );
  await provider.connection.confirmTransaction(signature);
  console.log("List removed");
}

export async function getNFTList(
  provider: anchor.AnchorProvider,
  connection: Connection
) {
  const program = await loadProgram(connection, provider);
  const listingAccounts = await provider.connection.getProgramAccounts(
    programId,
    {
      filters: [
        {
          dataSize: 80 + 8,
        },
      ],
    }
  );
  console.log(listingAccounts);
  const listings = listingAccounts.map((account) => {
    const listingData = program.account.listing.coder.accounts.decode(
      "listing",
      account.account.data
    );
    console.log(listingData);
    return {
      pubkey: account.pubkey.toString(),
      seller: listingData.seller.toString(),
      price: listingData.price.toNumber(),
      mint: listingData.mint.toString(),
      isActive: listingData.isActive,
    };
  });
  console.log(listings);
  return listings;
}
export async function getNFTDetail(
  mint: PublicKey,
  connection: Connection,
  seller: string,
  price: string,
  listing: string
) {
  const metadata = await getTokenMetadata(
    connection,
    mint,
    "confirmed",
    TOKEN_2022_PROGRAM_ID
  );
  let image_url = "";
  console.log(metadata);
  if (metadata?.uri.includes("jpeg" || "png" || "jpg"))
    image_url = metadata?.uri || "";
  else {
    const response = await fetch(metadata?.uri || "");
    if (response.ok) {
      const res_data = await response.json();
      image_url = res_data.image;
      console.log(res_data);
    }
  }
  const NFTItem: NFTDetail = {
    name: metadata?.name || "",
    symbol: metadata?.symbol || "",
    mint: mint.toString(),
    group: metadata?.additionalMetadata[0][1],
    image: image_url,
    seller: seller,
    price: price,
    listing: listing,
  };
  return NFTItem;
}

async function createAssociatedAccount(
  payer: PublicKey,
  associatedToken: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
  provider: anchor.AnchorProvider,
  sendTransaction: WalletAdapterProps["sendTransaction"],
  connection: Connection
) {
  const usdcTransaction = new Transaction().add(
    createAssociatedTokenAccountIdempotentInstruction(
      payer,
      associatedToken,
      owner,
      mint,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  );
  const latestBlockhash = await provider.connection.getLatestBlockhash();
  const tokenSign = await sendTransaction(usdcTransaction, connection);
  await provider.connection.confirmTransaction(
    { signature: tokenSign, ...latestBlockhash },
    "confirmed"
  );
}
