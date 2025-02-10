use anchor_lang::{constant, prelude::Pubkey, pubkey};

#[constant]
pub const AUTHORITY_PUBKEY: Pubkey = pubkey!("HSePyKSEBLs6F4F4G1z6P9nnqQpj6jBN6ScLSAmhygo");

#[constant]
pub const LOTTERY_VAULT_SEED: &[u8] = "LotteryVault".as_bytes();
#[constant]
pub const PROTOCOL_TREASURY_SEED: &[u8] = "ProtocolTreasury".as_bytes();

#[constant]
pub const SECONDS_IN_A_WEEK: u32 = 604800;

// Using basis points (1 bp = 0.01%) for precision
#[constant]
pub const BASIS_POINTS: u64 = 10000; // Our denominator

// Convert percentages to basis points
#[constant]
pub const FIRST_PLACE_REWARD_BP: u64 = 5000; // 50% = 5000/10000
#[constant]
pub const SECOND_PLACE_REWARD_BP: u64 = 3000; // 30% = 3000/10000
#[constant]
pub const THIRD_PLACE_REWARD_BP: u64 = 1500; // 15% = 1500/10000
#[constant]
pub const PROTOCOL_REVENUE_SHARE_BP: u64 = 500; // 5%  = 500/10000

#[constant]
pub const LOTTERY_VAULT_MIN_BALANCE: u64 = (0.1 * LAMPORTS_PER_SOL as f64) as u64;

#[constant]
pub const LAMPORTS_PER_SOL: u64 = 1_000_000_000;
#[constant]
pub const LAMPORTS_PER_LOTTERY_TICKET: u64 = (0.01 * LAMPORTS_PER_SOL as f64) as u64;
