import { Keypair, Connection, PublicKey, Transaction } from "@solana/web3.js";
import wallet from "C:/Users/Nikunj/.config/solana/id.json";
import type { Commitment } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createMintToInstruction, getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const commitement: Commitment = "confirmed";

const connection = new Connection("https://api.testnet.solana.com", commitement);

const mint = new PublicKey("59xzWKF8LbmGweS1TU91F2T8o1wnUjFfThsrCNdMU8nB");
// const pub = new PublicKey("2FvMsMY1DKpnJL3FUk4HBPVffzK4iF55rZHKPNgikef1");

async function main() {
  const ata = getAssociatedTokenAddressSync(mint, keypair.publicKey, false, TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);

  const createAtaAccTx = createAssociatedTokenAccountInstruction(
    keypair.publicKey, 
    ata, 
    keypair.publicKey,
    mint, 
    TOKEN_2022_PROGRAM_ID, 
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const mintTokenTx = createMintToInstruction(
    mint,
    ata,
    keypair.publicKey,
    200 * 1e6,
    [],
    TOKEN_2022_PROGRAM_ID
  );

  const ataAcc = await connection.getAccountInfo(ata);

  const tx = new Transaction();
  if(ataAcc) {
    tx.add(mintTokenTx);
  } else {
    tx.add(createAtaAccTx, mintTokenTx);
  }

  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  tx.feePayer = keypair.publicKey;

  const sign = await connection.sendTransaction(tx, [keypair]);

  console.log(sign);
  
}

main();
