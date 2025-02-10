use crate::constants::{AUTHORITY_PUBKEY, LOTTERY_VAULT_SEED};
use crate::custom_types::PlayerInfo;
use crate::errors::ErrorCode::{NumericOverflow, UnauthorisedSigner};
use crate::state::LotteryVault;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct ReallocLotteryVault<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [LOTTERY_VAULT_SEED],
        bump,
        realloc = lottery_vault.to_account_info().data_len() + (PlayerInfo::INIT_SPACE * 100),
        realloc::payer = authority,
        realloc::zero = false,
        has_one = authority,
    )]
    pub lottery_vault: Account<'info, LotteryVault>,
    pub system_program: Program<'info, System>,
}

pub fn process_realloc_lottery_vault(ctx: Context<ReallocLotteryVault>) -> Result<()> {
    // The realloc constraint handles the size increase automatically
    let lottery_vault = &mut ctx.accounts.lottery_vault;

    lottery_vault.max_participants = lottery_vault
        .max_participants
        .checked_add(100)
        .ok_or(NumericOverflow)?;

    msg!("Lottery vault reallocated to extended size");
    Ok(())
}
