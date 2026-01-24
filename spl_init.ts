import { Connection, Keypair } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import wallet from "C:/Users/Nikunj/.config/solana/id.json";
import type { Commitment } from "@solana/web3.js";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const commitement: Commitment = "confirmed";

const connection = new Connection("https://api.testnet.solana.com", commitement);

async function main() {
  try {
    const mint = await createMint(
      connection,
      keypair,
      keypair.publicKey,
      null,
      6
    )

    console.log(`minted pub key is ${mint.toString()}`);

  } catch (e) {
    console.log(e);

  }
}

main();
