import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Program } from "@coral-xyz/anchor";
import type { AiHealthAnchor } from "../target/types/ai_health_anchor";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import fs from "fs";
import * as anchor from "@coral-xyz/anchor";


// local 环境变量
// const entryPoint = "http://localhost:8899";
// const { usdt_mint, han_mint} = localAccount();


// devnet 环境变量
const entryPoint = clusterApiUrl("devnet");
// const entryPoint = "https://devnet.helius-rpc.com/?api-key=4ed07482-2788-48a1-8a22-a99cce9fd98e"

const { deployer } = initUsers();

export function covertStringToUint8array(str: string): Uint8Array {
    let hex = bs58.decode(str);
    return new Uint8Array(hex);
}


export function initUsers(): { deployer: Keypair, buyer: Keypair } {
  const deployer_path = "/Users/tim/.config/solana/ANU1sBoytR2a8tpvMFygMXg5M6XZipyiZVwrhwUmKvQV.json";
  const buyer_path = "/Users/tim/.config/solana/TimMVWPtXAAgnZpSVG2oQkznfknRtMiXJdcqhFfLXWd.json";

  const deployer = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(deployer_path, "utf8"))));
  const buyer = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(buyer_path, "utf8"))));

  return { deployer, buyer };
}

export function init() {
  const connection = new Connection(entryPoint, "confirmed");
  const wallet = new anchor.Wallet(deployer);
  const provider = new anchor.AnchorProvider(connection, wallet, {});
  anchor.setProvider(provider);
  
  const idl = require("../target/idl/ai_health_anchor.json");
  const program = new Program(idl, provider) as Program<AiHealthAnchor>;
 
  return { connection, wallet, provider, program};
}

export function devAccount(){
  const usdt_mint = new PublicKey("4Q1mWwJoEcBY3REVnXCMGGHf5avYBxWAWT7jybNHUicx");
  const han_mint = new PublicKey("7U8qShkYTDfJVQGcoPzTgMXygQTuGDu9RxF5ZA3UX581");
  return { usdt_mint, han_mint };
}

export function localAccount(){
  const usdt_mint = new PublicKey("CwYkX2jsy7sqMsZSbzDeoqNykfUh5XmcSY8PnUoPZnfr");
  const han_mint = new PublicKey("BPvog6H5wDep8zbgULCatGcAUkfKXryvzdDigpbaDJqo");
  return { usdt_mint, han_mint };
}


