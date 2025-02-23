// export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { Connection, Keypair, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import type { SolanaLottery} from "../../../onchain/target/types/solana_lottery";
import idl from "../../../onchain/target/idl/solana_lottery.json";
import * as anchor from "@coral-xyz/anchor";

export async function GET() {
    console.log("Cron job started: Processing lottery payout...");
    try {
        if (!process.env.LOTTERY_AUTHORITY_KEYPAIR) {
            throw new Error('LOTTERY_KEYPAIR environment variable is required');
        }
        if (!process.env.SOLANA_RPC_URL) {
            throw new Error('SOLANA_RPC_URL environment variable is required');
        }

        // Configure connection
        const connection = new Connection(process.env.SOLANA_RPC_URL);
        const authority = Keypair.fromSecretKey(
            new Uint8Array(JSON.parse(process.env.LOTTERY_AUTHORITY_KEYPAIR))
        );
        const wallet = {
            payer: authority,
            publicKey: authority.publicKey,
            signTransaction: async <T extends Transaction | VersionedTransaction>(tx: T): Promise<T> => {
                if (tx instanceof Transaction) {
                    tx.partialSign(authority);
                } else {
                    tx.sign([authority]);
                }
                return tx;
            },
            signAllTransactions: async <T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> => {
                txs.forEach(tx => {
                    if (tx instanceof Transaction) {
                        tx.partialSign(authority);
                    } else {
                        tx.sign([authority]);
                    }
                });
                return txs;
            }
        };
        const provider = new anchor.AnchorProvider(connection, wallet, { commitment: "confirmed" });

        console.log(`Authority: ${wallet.publicKey.toBase58()}`);

        // Initialize program
        const program = new anchor.Program<SolanaLottery>(idl as SolanaLottery, provider)

        // Get lottery vault PDA
        const [lotteryVaultPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("LotteryVault")],
            program.programId
        );

        // Fetch lottery vault data
        let lotteryVault = await program.account.lotteryVault.fetch(lotteryVaultPda);
        console.log("Lottery vault data:", lotteryVault.finishTime);

        // Generate winning tickets
        const winningTickets = Array.from({ length: 3 }, () =>
            Math.floor(Math.random() * lotteryVault.totalTicketsSold.toNumber())
        );
        console.log("Generated winning tickets:", winningTickets);

        // Select winners
        const selectWinnersTx = await program.methods
            .selectWinners(winningTickets)
            .accounts({
                authority: authority.publicKey,
            })
            .signers([authority])
            .rpc();

        await connection.confirmTransaction(selectWinnersTx);
        console.log("Winners selected, transaction confirmed:", selectWinnersTx);

        // Fetch updated lottery vault data
        lotteryVault = await program.account.lotteryVault.fetch(lotteryVaultPda);

        const protocolTreasury = new anchor.web3.PublicKey("ADPYX1FrWLgKwVQ1k2TndirR9nFJGRJWMifT8eoCxU9D");
        // Process payout
        const payoutTx = await program.methods
            .lotteryPayout()
            .accounts({
                authority: authority.publicKey,
                firstWinner: lotteryVault.latestLotoWinners.firstPlace,
                secondWinner: lotteryVault.latestLotoWinners.secondPlace,
                thirdWinner: lotteryVault.latestLotoWinners.thirdPlace,
                protocolTreasury: protocolTreasury,
            })
            .rpc();

        await connection.confirmTransaction(payoutTx);
        console.log("Payout completed, transaction confirmed:", payoutTx);

        return NextResponse.json({ 
            success: true, 
            message: "Lottery payout completed successfully" 
        });

    } catch (error) {
        console.error("Error processing lottery payout:", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
} 