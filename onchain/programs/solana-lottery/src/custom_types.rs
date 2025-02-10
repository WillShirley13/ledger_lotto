use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct PlayerInfo {
    pub pubkey: Pubkey,
    #[max_len(10)]
    pub ticket_numbers: Vec<u8>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, Debug)]
pub struct RecentWinners {
    pub first_place: Option<Pubkey>,
    pub first_place_amount: Option<u64>,
    pub second_place: Option<Pubkey>,
    pub second_place_amount: Option<u64>,
    pub third_place: Option<Pubkey>,
    pub third_place_amount: Option<u64>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq, Eq)]
pub enum LotteryStatus {
    NotStarted,
    InProgress,
    Finished,
}
