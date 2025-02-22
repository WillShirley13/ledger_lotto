use crate::constants::{LOTTERY_VAULT_SEED, SECONDS_IN_A_WEEK};
use crate::custom_types::{LotteryStatus, RecentWinners};
use crate::errors::ErrorCode::CannotReinitialise;
use crate::state::LotteryVault;
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
    pub protocol_treasury: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

pub fn process_init_lottery_vault(ctx: Context<InitLotteryVault>, start_time: u32) -> Result<()> {
    let authority: &mut Signer = &mut ctx.accounts.authority;
    // Instruction to initialise the lottery vault
    require_keys_neq!(
        ctx.accounts.lottery_vault.authority.key(),
        authority.key(),
        CannotReinitialise
    );

    let lottery_vault: &mut Account<LotteryVault> = &mut ctx.accounts.lottery_vault;
    let bump = ctx.bumps.lottery_vault;

    lottery_vault.authority = ctx.accounts.authority.key();
    lottery_vault.protocol_treasury = ctx.accounts.protocol_treasury.key();
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
    lottery_vault.start_time = start_time;
    lottery_vault.finish_time = start_time + SECONDS_IN_A_WEEK;
    lottery_vault.status = LotteryStatus::NotStarted;
    lottery_vault.exists = true;
    lottery_vault.bump = bump;

    Ok(())
}
