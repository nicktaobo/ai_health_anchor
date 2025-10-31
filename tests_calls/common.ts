import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Program } from "@coral-xyz/anchor";
import type { AiHealthAnchor } from "../target/types/ai_health_anchor";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import fs from "fs";
import * as anchor from "@coral-xyz/anchor";
import { BUYER_PATH, DEPLOYER_PATH } from "../.env/env";


// local env variables
const entryPoint = "http://localhost:8899";
// devnet env variables
// const entryPoint = clusterApiUrl("devnet");
const deployer_path = DEPLOYER_PATH;
const buyer_path = BUYER_PATH;



const { deployer } = initUsers();

export function covertStringToUint8array(str: string): Uint8Array {
    let hex = bs58.decode(str);
    return new Uint8Array(hex);
}


export function initUsers(): { deployer: Keypair, buyer: Keypair } {
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
  const usdt_mint = new PublicKey("CFeicP7hjQWMn92M6UGJQ15S2nwUVcx1xvPRHBbPVsaB");
  const han_mint = new PublicKey("7Rf8RpW2Xsur5jtqSSxKzVe8JTXtPLMadck26pbdPQuL");
  return { usdt_mint, han_mint };
}


