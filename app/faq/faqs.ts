export function ledgerLottoFaqs() {
    const q1 = "Why did you choose to build on the Solana blockchain?";
    const a1 = "We chose Solana for its incredibly fast 400ms block times and consistently low transaction fees, making it perfect for a lottery application where users need quick results and minimal overhead costs.";

    const q2 = "How are the winning numbers generated?";
    const a2 = "The winning numbers are generated client-side using JavaScript's secure Crypto library. While this means the number generation is off-chain, we ensure transparency and fairness through our open-source code and cryptographically secure random number generation process.";

    const q3 = "Is it safe to participate in this lottery?";
    const a3 = "Yes! Our smart contracts have been thoroughly audited, and all transactions are publicly verifiable on the Solana blockchain. Your funds are handled securely, and the lottery logic is completely transparent.";

    const q4 = "How often are lottery draws conducted?";
    const a4 = "Lotterys run for 1 week, from midnight sunday, to the following sunday at midnight";

    const q5 = "Are there are multiple winners?";
    const a5 = "Yes! The total deposits are divided as so... 1st place receives 50%, 2d place 30%, 3rd place 15% and the remaining 5% to the team.";

    const q6 = "What happens if there is no 1st, 2nd or 3rd place at payout time?";
    const a6 = "All left over winnings are rolled over the the following week's lottery";

    const q7 = "How do I claim my winnings?";
    const a7 = "Winnings are automatically sent to your Solana wallet address that made the ticket purchase. There's no need to manually claim - our smart contract handles everything!";

    const q8 = "What percentage of the ticket sales goes to the prize pool?";
    const a8 = "A significant portion of all ticket sales (95%) goes directly to the prize pool. The remaining percentage covers operational costs and platform maintenance. All these allocations are transparently handled by our smart contract.";
    
    const q9 = "Is there a limit to how many tickets I can buy?";
    const a9 = "Yes, 10 tickets per wallet, per lottery";

    const q10 = "What currencies can I use to buy tickets?";
    const a10 = "Currently, tickets can only be purchased using SOL, the native currency of the Solana blockchain. Make sure you have enough SOL in your wallet to cover both the ticket price and the small transaction fee.";
    return [
        { question: q1, answer: a1 },
        { question: q2, answer: a2 },
        { question: q3, answer: a3 },
        { question: q4, answer: a4 },
        { question: q5, answer: a5 },
        { question: q6, answer: a6 },
        { question: q7, answer: a7 },
        { question: q8, answer: a8 },
        { question: q9, answer: a9 },
        { question: q10, answer: a10 },
    ];
}
