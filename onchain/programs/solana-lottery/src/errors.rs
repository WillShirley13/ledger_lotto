use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized signer")]
    UnauthorisedSigner,
    #[msg("Cannot reinitialize the lottery vault or protocol treasury")]
    CannotReinitialise,
    #[msg("Lottery is not in progress")]
    LotteryNotInProgress,
    #[msg("Lottery is not finished")]
    LotteryNotFinished,
    #[msg("Invalid winner passed. Must match data held in LotteryVault")]
    InvalidWinner,
    #[msg("Insufficient funds to purchase tickets")]
    InsufficientFunds,
    #[msg("Invalid ticket quantity. Must be between 1 and 10. Total tickets per player is capped at 10")]
    InvalidTicketQuantity,
    #[msg("Numeric overflow")]
    NumericOverflow,
    #[msg("Prize pool does not match the sum of rewards and protocol revenue")]
    PrizePoolMismatch,
}
