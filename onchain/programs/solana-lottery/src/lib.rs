use anchor_lang::prelude::*;
use instructions::*;

mod constants;
mod custom_types;
mod errors;
mod instructions;
mod state;

declare_id!("vurfHgSuomn9PEPK7a4eRjw288n8GaeSwub3pCweKfq");

#[program]
pub mod solana_lottery {
    use super::*;

    pub fn init_lottery_vault(ctx: Context<InitLotteryVault>) -> Result<()> {
        process_init_lottery_vault(ctx)
    }

    pub fn init_protocol_treasury(ctx: Context<InitProtocolTreasury>) -> Result<()> {
        process_init_protocol_treasury(ctx)
    }

    pub fn lottery_payout(ctx: Context<LotteryPayout>) -> Result<()> {
        process_lottery_payout(ctx)
    }

    pub fn select_winners(ctx: Context<SelectWinners>, winning_numbers: [u8; 3]) -> Result<()> {
        process_select_winners(ctx, winning_numbers)
    }

    pub fn realloc_lottery_vault(ctx: Context<ReallocLotteryVault>) -> Result<()> {
        process_realloc_lottery_vault(ctx)
    }

    pub fn purchase_ticket(ctx: Context<PurchaseTicket>, quantity_of_tickets: u64) -> Result<()> {
        process_purchase_ticket(ctx, quantity_of_tickets)
    }
}
