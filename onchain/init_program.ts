import web3 from "@solana/web3.js";
import { SolanaLottery } from "./target/types/solana_lottery";
import idl from "./target/idl/solana_lottery.json";
import { Program } from "@coral-xyz/anchor";
import anchor from "@coral-xyz/anchor";

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

const connection = new web3.Connection("http://127.0.0.1:8899");

const program = new Program<SolanaLottery>(idl as SolanaLottery, { connection });

console.log(program.programId);
console.log(provider.publicKey);