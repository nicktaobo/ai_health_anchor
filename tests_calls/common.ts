import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Program } from "@coral-xyz/anchor";
import type { AiHealthAnchor } from "../target/types/ai_health_anchor";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import fs from "fs";
import * as anchor from "@coral-xyz/anchor";
import { BUYER_PATH, DEPLOYER_PATH } from "../.env/env";

// load env variables
let ENV = "localhost"
// let ENV = "dev"

const deployer_path = DEPLOYER_PATH;
const buyer_path = BUYER_PATH;
const { deployer } = initUsers();

export function covertStringToUint8array(str: string): Uint8Array {
  let hex = bs58.decode(str);
  return new Uint8Array(hex);
}

export function LoadConfig() {
  if (ENV === "localhost") {
    const entryPoint = "http://localhost:8899";
    const usdt_mint = new PublicKey("ABBRX5RwjTbPkzNBfQLVzvcsXzQCE9mFfhELWzBnxepM");
    const han_mint = new PublicKey("Gq5zzGUEV9rXaBfXgkdgvbY8StvGJLWhfWQaB5ZXWyDZ");
    return { entryPoint, usdt_mint, han_mint };
  } else if (ENV === "dev") {
    const entryPoint = clusterApiUrl("devnet");
    const usdt_mint = new PublicKey("4Q1mWwJoEcBY3REVnXCMGGHf5avYBxWAWT7jybNHUicx");
    const han_mint = new PublicKey("7U8qShkYTDfJVQGcoPzTgMXygQTuGDu9RxF5ZA3UX581");
    return { entryPoint, usdt_mint, han_mint };
  }
}


export function initUsers(): { deployer: Keypair, buyer: Keypair } {
  const deployer = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(deployer_path, "utf8"))));
  const buyer = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(buyer_path, "utf8"))));

  return { deployer, buyer };
}

export function init() {
  const connection = new Connection(LoadConfig().entryPoint, "confirmed");
  const wallet = new anchor.Wallet(deployer);
  const provider = new anchor.AnchorProvider(connection, wallet, {});
  anchor.setProvider(provider);

  const idl = require("../target/idl/ai_health_anchor.json");
  // const program = new Program(idl, provider) as Program<AiHealthAnchor>;
  // 获取program 通过id
  // const program = anchor.workspace.aiHealthAnchor as Program<AiHealthAnchor>;
  const program = new Program(idl, provider) as Program<AiHealthAnchor>;

  return { connection, wallet, provider, program };
}



