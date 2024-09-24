use anchor_lang::prelude::*;

use anchor_spl::token::{ self};

use anchor_spl::token_2022::{self,Token2022,Transfer};
use anchor_spl::token_interface::{ TokenAccount, Mint};

//use spl_token_2022::instruction::*;


use anchor_lang::AccountsClose;

use crate::constant::{ PREFIX };

declare_id!("GfLfsgUP5dQ2gGN4DAPSGZErKSCVZzsVBtof7ZafUP3n");

#[program]
pub mod solana_nft_marketplace {
    use super::*;
    use anchor_lang::solana_program::{
        program::{ invoke },
        system_instruction,
    };

    pub fn list_nft(ctx: Context<ListNFT>, price: u64) -> Result<()> {
        let seller = &mut ctx.accounts.seller;

        let vault = &mut ctx.accounts.vault;

        //let nft_account = &mut ctx.accounts.nft_account;

        // Transfer the NFT to PDA account

        let ix = spl_token_2022::instruction::transfer_checked(
                &ctx.accounts.token_program.key(),
                &ctx.accounts.nft_account.key(), 
		&ctx.accounts.mint.key(),
                &vault.key(),
                &seller.key(),
                &[],
                1,
		0
            )?;

        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.seller.to_account_info(),
                ctx.accounts.vault.to_account_info(),
                ctx.accounts.token_program.to_account_info(),
		ctx.accounts.mint.to_account_info(),
		ctx.accounts.nft_account.to_account_info(),
            ],
        )?;

        let listing = &mut ctx.accounts.listing;

        listing.seller = *ctx.accounts.seller.key;

        listing.mint = ctx.accounts.mint.key();

        listing.price = price;

        listing.is_active = true;

        Ok(())
    }

    pub fn remove_listed_nft(ctx: Context<RemoveListedNFT>) -> Result<()> {
        let seller = &mut ctx.accounts.seller;

        let vault = &mut ctx.accounts.vault;

        let nft_account = &mut ctx.accounts.nft_account;

        // Transfer the NFT back to user from PDA account

        let seeds = &[
            PREFIX.as_bytes(),

            "vault".as_bytes(),

            nft_account.mint.as_ref(),

            &[ctx.bumps.vault],
        ];

        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: vault.to_account_info(),

            to: nft_account.to_account_info(),

            authority: vault.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),

            cpi_accounts,

            signer
        );

        token_2022::transfer(cpi_ctx, 1)?;

        ctx.accounts.listing.close(seller.to_account_info())?;

        Ok(())
    }

    pub fn buy_nft(ctx: Context<BuyNFT>, vault_bump:u8) -> Result<()> {
        let listing = &mut ctx.accounts.listing;

        require!(listing.is_active, ErrorCode::InactiveListing);

        let vault = &mut ctx.accounts.vault;

        let nft_account = &mut ctx.accounts.nft_account;

        // Transfer funds from the buyer to the seller
	
	let ix = system_instruction::transfer(
	    &ctx.accounts.buyer.key(),
	    &ctx.accounts.seller.key(),
	    listing.price*1_000_000_000,
	);
	invoke(
	    &ix,
	    &[
		ctx.accounts.buyer.to_account_info(),
		ctx.accounts.seller.to_account_info(),
		ctx.accounts.system_program.to_account_info(),
	    ],
	)?;
        
        // Transfer the NFT to buyer from PDA account

        let seeds = &[
            PREFIX.as_bytes(),

            "vault".as_bytes(),

            nft_account.mint.as_ref(),

            &[vault_bump],
        ];

        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: vault.to_account_info(),

            to: ctx.accounts.buyer_token_account.to_account_info(),

            authority: vault.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),

            cpi_accounts,

            signer
        );

        token_2022::transfer(cpi_ctx, 1)?;
       listing.is_active = false;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct ListNFT<'info> {
    #[account(init, payer = seller, space = 80 + 8)]
    pub listing: Account<'info, Listing>,

    #[account(mut)]
    pub seller: Signer<'info>,

    #[account(mut , owner = token_program.key())]
    pub nft_account: InterfaceAccount<'info, TokenAccount>,

    #[account(constraint = mint.key() == nft_account.mint)]
    mint: InterfaceAccount<'info, Mint>,

    #[account(
        init_if_needed,

        token::mint = mint,
	payer = seller,
        token::authority = vault,
	
        seeds = [PREFIX.as_bytes(), "vault".as_bytes(), nft_account.mint.as_ref()],

        bump,
	
    )]
    vault: InterfaceAccount<'info, TokenAccount>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token2022>,

    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct RemoveListedNFT<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,

    #[account(mut)]
    pub nft_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut, has_one = seller, constraint = nft_account.mint == listing.mint)]
    pub listing: Account<'info, Listing>,

    #[account(constraint = mint.key() == nft_account.mint)]
    mint: InterfaceAccount<'info, Mint>,

    #[account(mut, seeds = [PREFIX.as_bytes(), "vault".as_bytes(), nft_account.mint.as_ref()], bump)]
    vault: InterfaceAccount<'info, TokenAccount>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token2022>,

    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct BuyNFT<'info> {
    #[account(mut)]
    pub listing: Account<'info, Listing>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(mut)]
    /// CHECK: It is seller account
    pub seller: AccountInfo<'info>,

    #[account(mut)]
    pub nft_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut, seeds = [PREFIX.as_bytes(), "vault".as_bytes(), nft_account.mint.as_ref()], bump)]
    vault: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token2022>,

    pub system_program: Program<'info, System>,

    #[account(mut)]
    pub buyer_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub seller_token_account: InterfaceAccount<'info, TokenAccount>,
}

#[account]
pub struct Listing {
    pub seller: Pubkey,

    pub price: u64,

    pub mint: Pubkey,

    pub is_active: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Listing is not active")]
    InactiveListing,
}

pub mod constant {
    pub const PREFIX: &str = "MARKETPLACE";
}
