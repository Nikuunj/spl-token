import { Keypair, Connection, PublicKey, Transaction } from "@solana/web3.js";
import wallet from "C:/Users/Nikunj/.config/solana/id.json";
import type { Commitment } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createTransferInstruction, getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const commitement: Commitment = "confirmed";

const connection = new Connection("https://api.testnet.solana.com", commitement);

const mint = new PublicKey("59xzWKF8LbmGweS1TU91F2T8o1wnUjFfThsrCNdMU8nB");
const pub = new PublicKey("C81XCoS1VToRzYYQ35N5Afow5iTRsZmZLrpXdYV61eeZ");

async function main() {
   const ataSender = getAssociatedTokenAddressSync(mint, keypair.publicKey, false, TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
   const ataRec = getAssociatedTokenAddressSync(mint, pub, false, TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);

   console.log(keypair.publicKey.toBase58());
   
   const createAtaAccTx = createAssociatedTokenAccountInstruction(
      keypair.publicKey, 
      ataRec, 
      pub,
      mint, 
      TOKEN_2022_PROGRAM_ID, 
      ASSOCIATED_TOKEN_PROGRAM_ID
   );
   const sendTokenTx = createTransferInstruction(
      ataSender,
      ataRec,
      keypair.publicKey,
      200 * 1e6,
      [],
      TOKEN_2022_PROGRAM_ID
   );

   const ataAcc = await connection.getAccountInfo(ataRec);
   // console.log(ataAcc);
   
   
   const tx = new Transaction();
   if(!ataAcc) {
      tx.add(createAtaAccTx, sendTokenTx);
   } else {
      tx.add(sendTokenTx);
   }
   tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
   tx.feePayer = keypair.publicKey;
   const sign = await connection.sendTransaction(tx, [keypair]);
   
   console.log("Transfer Token : ", sign);
   
}

main();