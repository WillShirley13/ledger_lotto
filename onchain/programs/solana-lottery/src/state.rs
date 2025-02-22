use crate::custom_types::{LotteryStatus, PlayerInfo, RecentWinners};
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct LotteryVault {
    // The authority of the lottery vault.
    pub authority: Pubkey,
    // The protocol treasury.
    pub protocol_treasury: Pubkey,
    // The total amount of lamports in the prize pool.
    pub prize_pool: u64,
    // A vector to store information about all participants, limited to a maximum of 100.
    #[max_len(200)]
    pub participants: Vec<PlayerInfo>,
    // Max permitted participants
    pub max_participants: u64,
    // The total number of tickets sold.
    pub total_tickets_sold: u64,
    // The next ticket id to be sold. Increments by 1 each time a ticket is sold.
    pub next_ticket_id: u8,
    // The most recent winners of the lottery.
    pub latest_loto_winners: RecentWinners,
    // The start time of the lottery.
    pub start_time: u32,
    // The finish time of the lottery.
    pub finish_time: u32,
    // The status of the lottery.
    pub status: LotteryStatus,
    // Flag denoting if LotteryVault exists
    pub exists: bool,
    //bump for pda
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct ProtocolTreasury {
    // The authority of the protocol treasury.
    pub authority: Pubkey,
    // The total amount of revenue collected.
    pub revenue: u64,
    // Flag denoting if ProtocolTreasury exists
    pub exists: bool,
    //bump for pda
    pub bump: u8,
}
