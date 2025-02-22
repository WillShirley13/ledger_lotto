// import * as dotenv from 'dotenv';
// import { resolve } from 'path';

// // npm run init-lottery
// // Configure dotenv to look in the correct directory

// dotenv.config({ path: resolve(__dirname, '.env') });

// import { AnchorProvider, Program, Wallet, web3 } from "@coral-xyz/anchor";
// import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
// import type { SolanaLottery } from "../target/types/solana_lottery";
// import idl from "../target/idl/solana_lottery.json";

// async function initLotteryAdmin() {
// 	// Configure connection
// 	const connection = new Connection(clusterApiUrl("devnet"));
// 	const authority = Keypair.fromSecretKey(
// 		new Uint8Array(JSON.parse(process.env.ADMIN_KEYPAIR))
// 	);
// 	const wallet = new Wallet(authority);
// 	const provider = new AnchorProvider(connection, wallet, {
// 		commitment: "confirmed",
// 	});

// 	const program = new Program<SolanaLottery>(idl as SolanaLottery, provider);

// 	const protocolTreasury = new web3.PublicKey(
// 		"ADPYX1FrWLgKwVQ1k2TndirR9nFJGRJWMifT8eoCxU9D"
// 	);

// 	const [lotteryVaultPda] = web3.PublicKey.findProgramAddressSync(
// 		[Buffer.from("LotteryVault")],
// 		program.programId
// 	);

// 	// const lotteryVaultTx = await program.methods
// 	// 	.initLotteryVault(1740268800)
// 	// 	.accounts({
// 	// 		authority: provider.wallet.publicKey,
// 	// 		protocolTreasury: protocolTreasury,
// 	// 	})
// 	// 	.signers([])
// 	// 	.rpc();
// 	// console.log("Lottery vault init tx: ", lotteryVaultTx);

// 	// Add confirmation wait
// 	// await connection.confirmTransaction(lotteryVaultTx);
	
// 	// Add a small delay to ensure account is available
// 	await new Promise(resolve => setTimeout(resolve, 2000));

// 	// Add error handling
// 	const accountInfo = await program.account.lotteryVault.getAccountInfo(lotteryVaultPda);
// 	if (!accountInfo) {
// 		throw new Error("Failed to fetch lottery vault account info");
// 	}
	
// 	console.log(
// 		`lotteryVault initial size: ${accountInfo.data.byteLength}\n`
// 	);
// 	// for (let i = 0; i < 5; i++) {
// 	// 	await program.methods
// 	// 		.reallocLotteryVault()
// 	// 		.accounts({
// 	// 			authority: provider.wallet.publicKey,
// 	// 		})
// 	// 		.rpc();
// 	// }
// 	console.log(
// 		`lotteryVault size after realloc: ${
// 			(await program.account.lotteryVault.getAccountInfo(lotteryVaultPda))
// 				.data.byteLength
// 		}\n`
// 	);
// }

// initLotteryAdmin()
// 	.then(() => {
// 		console.log("Lottery initialization completed successfully");
// 		process.exit(0);
// 	})
// 	.catch((error) => {
// 		console.error("Error initializing lottery:", error);
// 		process.exit(1);
// 	});
