use crate::constants::{
    BASIS_POINTS, FIRST_PLACE_REWARD_BP, LOTTERY_VAULT_MIN_BALANCE, LOTTERY_VAULT_SEED,
    PROTOCOL_REVENUE_SHARE_BP, SECONDS_IN_A_WEEK, SECOND_PLACE_REWARD_BP, THIRD_PLACE_REWARD_BP,
};
use crate::custom_types::{LotteryStatus, PlayerInfo, RecentWinners};
use crate::errors::ErrorCode;
use crate::state::{LotteryVault, ProtocolTreasury};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct SelectWinners<'info> {
    #[account(mut, constraint = lottery_vault.authority == authority.key() @ErrorCode::UnauthorisedSigner)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [LOTTERY_VAULT_SEED],
        bump = lottery_vault.bump,
        constraint = Clock::get()?.unix_timestamp >= lottery_vault.finish_time as i64 @ErrorCode::LotteryNotFinished
    )]
    pub lottery_vault: Account<'info, LotteryVault>,
}

pub fn process_select_winners(ctx: Context<SelectWinners>, winning_numbers: [u8; 3]) -> Result<()> {
    let lottery_vault: &mut Account<'_, LotteryVault> = &mut ctx.accounts.lottery_vault;
    let participants: &Vec<PlayerInfo> = &lottery_vault.participants;

    let mut winners: [Option<Pubkey>; 3] = [None, None, None];
    for (i, num) in winning_numbers.iter().enumerate() {
        for p in participants {
            if p.ticket_numbers.contains(num) {
                winners[i] = Some(p.pubkey);
                break;
            }
        }
    }

    lottery_vault.latest_loto_winners = RecentWinners {
        first_place: winners[0],
        first_place_amount: None,
        second_place: winners[1],
        second_place_amount: None,
        third_place: winners[2],
        third_place_amount: None,
    };
    msg!("Selected winners: {:?}", lottery_vault.latest_loto_winners);
    lottery_vault.status = LotteryStatus::Finished;

    Ok(())
}

#[derive(Accounts)]
pub struct LotteryPayout<'info> {
    #[account(
        mut,
        seeds = [LOTTERY_VAULT_SEED],
        bump = lottery_vault.bump,
        constraint = lottery_vault.status == LotteryStatus::Finished @ErrorCode::LotteryNotFinished,
        constraint = lottery_vault.authority == authority.key() @ErrorCode::UnauthorisedSigner
    )]
    pub lottery_vault: Account<'info, LotteryVault>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut, constraint = protocol_treasury.key() == lottery_vault.protocol_treasury.key() @ErrorCode::InvalidProtocolTreasury)]
    pub protocol_treasury: SystemAccount<'info>,

    #[account(mut, constraint = lottery_vault.latest_loto_winners.first_place.is_none() || first_winner.key() == lottery_vault.latest_loto_winners.first_place.unwrap() @ErrorCode::InvalidWinner)]
    pub first_winner: Option<SystemAccount<'info>>,

    #[account(mut, constraint = lottery_vault.latest_loto_winners.second_place.is_none() || second_winner.key() == lottery_vault.latest_loto_winners.second_place.unwrap() @ErrorCode::InvalidWinner)]
    pub second_winner: Option<SystemAccount<'info>>,

    #[account(mut, constraint = lottery_vault.latest_loto_winners.third_place.is_none() || third_winner.key() == lottery_vault.latest_loto_winners.third_place.unwrap() @ErrorCode::InvalidWinner)]
    pub third_winner: Option<SystemAccount<'info>>,

    pub system_program: Program<'info, System>,
}

pub fn process_lottery_payout(ctx: Context<LotteryPayout>) -> Result<()> {
    let lottery_vault: &mut Account<LotteryVault> = &mut ctx.accounts.lottery_vault;
    let protocol_treasury: &mut SystemAccount = &mut ctx.accounts.protocol_treasury;
    let first_winner: &mut Option<SystemAccount> = &mut ctx.accounts.first_winner;
    let second_winner: &mut Option<SystemAccount> = &mut ctx.accounts.second_winner;
    let third_winner: &mut Option<SystemAccount> = &mut ctx.accounts.third_winner;

    let prize_pool: u64 = lottery_vault.prize_pool; //Measured in lamports

    // Calculate rewards
    let first_place_reward: u64 = (prize_pool * FIRST_PLACE_REWARD_BP) / BASIS_POINTS;
    msg!("First place reward: {}", first_place_reward);
    let second_place_reward: u64 = (prize_pool * SECOND_PLACE_REWARD_BP) / BASIS_POINTS;
    msg!("Second place reward: {}", second_place_reward);
    let third_place_reward: u64 = (prize_pool * THIRD_PLACE_REWARD_BP) / BASIS_POINTS;
    msg!("Third place reward: {}", third_place_reward);
    let protocol_treasury_revenue: u64 = (prize_pool * PROTOCOL_REVENUE_SHARE_BP) / BASIS_POINTS;
    msg!("Protocol treasury revenue: {}", protocol_treasury_revenue);

    // Ensure prize pool matches the sum of rewards and protocol revenue
    require!(
        (first_place_reward + second_place_reward + third_place_reward + protocol_treasury_revenue)
            <= (lottery_vault.get_lamports() - LOTTERY_VAULT_MIN_BALANCE),
        ErrorCode::PrizePoolMismatch
    );

    // First place winner payout
    if let Some(winner) = &first_winner {
        transfer_lamports(
            &lottery_vault.to_account_info(),
            &winner.to_account_info(),
            first_place_reward,
        )?;
        // Update prize pool
        lottery_vault.prize_pool -= first_place_reward;
        lottery_vault.latest_loto_winners.first_place_amount = Some(first_place_reward);

        msg!("First place reward transferred to {}", winner.key);
    } else {
        msg!("First place winner not found");
    }

    // Second place winner payout
    if let Some(winner) = &second_winner {
        transfer_lamports(
            &lottery_vault.to_account_info(),
            &winner.to_account_info(),
            second_place_reward,
        )?;
        // Update prize pool
        lottery_vault.prize_pool -= second_place_reward;
        lottery_vault.latest_loto_winners.second_place_amount = Some(second_place_reward);

        msg!("Second place reward transferred to {}", winner.key);
    } else {
        msg!("Second place winner not found");
    }

    // Third place winner payout
    if let Some(winner) = &third_winner {
        transfer_lamports(
            &lottery_vault.to_account_info(),
            &winner.to_account_info(),
            third_place_reward,
        )?;
        // Update prize pool
        lottery_vault.prize_pool -= third_place_reward;
        lottery_vault.latest_loto_winners.third_place_amount = Some(third_place_reward);
        msg!("Third place reward transferred to {}", winner.key);
    } else {
        msg!("Third place winner not found");
    }

    // Protocol treasury revenue payout
    transfer_lamports(
        &lottery_vault.to_account_info(),
        &protocol_treasury.to_account_info(),
        protocol_treasury_revenue,
    )?;

    // Update prize pool
    lottery_vault.prize_pool -= protocol_treasury_revenue;

    // Reset lottery vault
    lottery_vault.participants = Vec::new();
    lottery_vault.total_tickets_sold = 0;
    lottery_vault.next_ticket_id = 1;
    lottery_vault.start_time = lottery_vault.finish_time;
    lottery_vault.finish_time = lottery_vault.start_time + SECONDS_IN_A_WEEK;
    lottery_vault.status = LotteryStatus::InProgress;

    msg!("Lottery payout completed and lottery restarted");

    Ok(())
}

//helper function to transfer lamports from one account to another
fn transfer_lamports<'info>(
    lottery_vault: &AccountInfo<'info>,
    to: &AccountInfo<'info>,
    amount: u64,
) -> Result<()> {
    **lottery_vault.try_borrow_mut_lamports()? -= amount;
    **to.try_borrow_mut_lamports()? += amount;

    Ok(())
}
