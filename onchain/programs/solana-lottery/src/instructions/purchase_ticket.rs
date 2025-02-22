use crate::constants::{LAMPORTS_PER_LOTTERY_TICKET, LOTTERY_VAULT_SEED};
use crate::custom_types::PlayerInfo;
use crate::errors::ErrorCode;
use crate::state::LotteryVault;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction::transfer;

#[derive(Accounts)]
pub struct PurchaseTicket<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(
        mut,
        seeds = [LOTTERY_VAULT_SEED],
        bump = lottery_vault.bump,
    )]
    pub lottery_vault: Account<'info, LotteryVault>,
    pub system_program: Program<'info, System>,
}

pub fn process_purchase_ticket(
    ctx: Context<PurchaseTicket>,
    quantity_of_tickets: u64,
) -> Result<()> {
    let lottery_vault: &mut Account<'_, LotteryVault> = &mut ctx.accounts.lottery_vault;
    // let authority: &mut Signer<'_> = &mut ctx.accounts.authority;
    let player: &mut Signer<'_> = &mut ctx.accounts.player;
    let system_program: &Program<'_, System> = &ctx.accounts.system_program;

    // Ensure player has enough funds to cover rent and purchase tickets
    let total_cost: u64 = quantity_of_tickets * LAMPORTS_PER_LOTTERY_TICKET;
    let player_lamports = player.lamports();
    msg!("Player lamports: {}", player_lamports);
    require!(player_lamports >= total_cost, ErrorCode::InsufficientFunds);
    require!(
        Rent::get()?.is_exempt(player_lamports - total_cost, player.data_len()),
        ErrorCode::InsufficientFunds
    );
    // Ensure ticket quantity is valid
    require!(
        quantity_of_tickets > 0 && quantity_of_tickets <= 10,
        ErrorCode::InvalidTicketQuantity
    );

    // Create new ticket ids
    let new_ticket_ids: Vec<u8> = (0..quantity_of_tickets)
        .map(|i: u64| lottery_vault.next_ticket_id + i as u8)
        .collect();

    //Retrieve player info if exists
    let current_player_info: Option<&mut PlayerInfo> = lottery_vault
        .participants
        .iter_mut()
        .find(|player_info| player_info.pubkey == player.key());

    if let Some(player_info) = current_player_info {
        require!(
            (player_info.ticket_numbers.len() + quantity_of_tickets as usize) <= 10,
            ErrorCode::InvalidTicketQuantity
        );
        msg!("New ticket ids: {:?}", new_ticket_ids);
        // Add new ticket ids to player info
        for ticket_id in new_ticket_ids {
            player_info.ticket_numbers.push(ticket_id);
        }
        msg!("Player info: {:?}", player_info.ticket_numbers);
    } else {
        // Create new player info
        msg!("New ticket ids: {:?}", new_ticket_ids);
        let new_player_info = PlayerInfo {
            pubkey: player.key(),
            ticket_numbers: new_ticket_ids,
        };
        msg!("New player info: {:?}", &new_player_info.ticket_numbers);
        lottery_vault.participants.push(new_player_info);
    }

    let transfer_instruction = transfer(&player.key(), &lottery_vault.key(), total_cost);
    invoke(
        &transfer_instruction,
        &[
            player.to_account_info(),
            lottery_vault.to_account_info(),
            system_program.to_account_info(),
        ],
    )?;

    // Increment next ticket ids
    lottery_vault.next_ticket_id = lottery_vault
        .next_ticket_id
        .checked_add(quantity_of_tickets as u8)
        .ok_or(ErrorCode::NumericOverflow)?;

    // Increment total tickets sold
    lottery_vault.total_tickets_sold = lottery_vault
        .total_tickets_sold
        .checked_add(quantity_of_tickets)
        .ok_or(ErrorCode::NumericOverflow)?;

    // Update prize pool
    lottery_vault.prize_pool = lottery_vault
        .prize_pool
        .checked_add(total_cost)
        .ok_or(ErrorCode::NumericOverflow)?;
    msg!("Prize pool: {}", lottery_vault.prize_pool);

    Ok(())
}
