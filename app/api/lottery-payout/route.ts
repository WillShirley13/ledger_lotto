import { NextResponse } from "next/server";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey} from "@solana/web3.js";
import type { SolanaLottery} from "../../../onchain/target/types/solana_lottery";
import idl from "../../../onchain/target/idl/solana_lottery.json";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
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
        const wallet = new Wallet(authority);
        const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });

        // Initialize program
        const program = new Program<SolanaLottery>(idl as SolanaLottery, provider)

        // Get lottery vault PDA
        const [lotteryVaultPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("LotteryVault")],
            program.programId
        );

        // Fetch lottery vault data
        let lotteryVault = await program.account.lotteryVault.fetch(lotteryVaultPda);

        // Generate winning tickets
        const winningTickets = Array.from({ length: 3 }, () =>
            Math.floor(Math.random() * lotteryVault.totalTicketsSold.toNumber())
        );

        // Select winners
        const selectWinnersTx = await program.methods
            .selectWinners(winningTickets)
            .accounts({
                authority: authority.publicKey,
            })
            .signers([authority])
            .rpc();

        await connection.confirmTransaction(selectWinnersTx);

        // Fetch updated lottery vault data
        lotteryVault = await program.account.lotteryVault.fetch(lotteryVaultPda);

        // Process payout
        const payoutTx = await program.methods
            .lotteryPayout()
            .accounts({
                authority: authority.publicKey,
                firstWinner: lotteryVault.latestLotoWinners.firstPlace,
                secondWinner: lotteryVault.latestLotoWinners.secondPlace,
                thirdWinner: lotteryVault.latestLotoWinners.thirdPlace,
            })
            .signers([authority])
            .rpc();

        await connection.confirmTransaction(payoutTx);

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