use crate::constants::{LOTTERY_VAULT_SEED, PROTOCOL_TREASURY_SEED, SECONDS_IN_A_WEEK};
use crate::custom_types::{LotteryStatus, PlayerInfo, RecentWinners};
use crate::errors::ErrorCode::{CannotReinitialise, UnauthorisedSigner};
use crate::state::{LotteryVault, ProtocolTreasury};
use anchor_lang::prelude::*;

// CONTROL WHO CAN INIT THE LOTTERY VAULT AND PROTOCOL TREASURY!!!!

#[derive(Accounts)]
pub struct InitLotteryVault<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init_if_needed,
        space = 8 + LotteryVault::INIT_SPACE,
        payer = authority,
        seeds = [LOTTERY_VAULT_SEED],
        bump,
        constraint = !lottery_vault.exists @CannotReinitialise,
    )]
    pub lottery_vault: Account<'info, LotteryVault>,
    pub system_program: Program<'info, System>,
}

pub fn process_init_lottery_vault(ctx: Context<InitLotteryVault>) -> Result<()> {
    let authority = &mut ctx.accounts.authority;
    // Instruction to initialise the lottery vault
    require_keys_neq!(
        ctx.accounts.lottery_vault.authority.key(),
        authority.key(),
        CannotReinitialise
    );

    let lottery_vault: &mut Account<'_, LotteryVault> = &mut ctx.accounts.lottery_vault;
    let bump = ctx.bumps.lottery_vault;

    lottery_vault.authority = ctx.accounts.authority.key();
    lottery_vault.prize_pool = 0;
    lottery_vault.participants = Vec::new();
    lottery_vault.max_participants = 200;
    lottery_vault.total_tickets_sold = 0;
    lottery_vault.next_ticket_id = 1;
    lottery_vault.latest_loto_winners = RecentWinners {
        first_place: None,
        first_place_amount: None,
        second_place: None,
        second_place_amount: None,
        third_place: None,
        third_place_amount: None,
    };
    lottery_vault.start_time = 1737806400;
    lottery_vault.finish_time = 1737806400 + SECONDS_IN_A_WEEK;
    lottery_vault.status = LotteryStatus::NotStarted;
    lottery_vault.exists = true;
    lottery_vault.bump = bump;

    Ok(())
}

#[derive(Accounts)]
pub struct InitProtocolTreasury<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init_if_needed,
        space = 8 + ProtocolTreasury::INIT_SPACE,
        payer = authority,
        seeds = [PROTOCOL_TREASURY_SEED],
        bump,
        constraint = !protocol_treasury.exists @CannotReinitialise,
    )]
    pub protocol_treasury: Account<'info, ProtocolTreasury>,
    pub system_program: Program<'info, System>,
}

pub fn process_init_protocol_treasury(ctx: Context<InitProtocolTreasury>) -> Result<()> {
    let authority = &mut ctx.accounts.authority;
    require_keys_neq!(
        ctx.accounts.protocol_treasury.authority.key(),
        authority.key(),
        CannotReinitialise
    );

    let protocol_treasury: &mut Account<'_, ProtocolTreasury> = &mut ctx.accounts.protocol_treasury;
    let bump = ctx.bumps.protocol_treasury;
    protocol_treasury.authority = ctx.accounts.authority.key();
    protocol_treasury.revenue = 0;
    protocol_treasury.exists = true;
    protocol_treasury.bump = bump;

    Ok(())
}
