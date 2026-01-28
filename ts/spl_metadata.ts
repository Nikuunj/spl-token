import {
  createInitializeInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  ExtensionType,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE
} from "@solana/spl-token";
import { pack } from "@solana/spl-token-metadata";
import {
  Keypair,
  Connection,
  PublicKey,
  Transaction,
  SystemProgram
} from "@solana/web3.js";
import type { Commitment } from "@solana/web3.js";
import wallet from "C:/Users/Nikunj/.config/solana/id.json";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const commitement: Commitment = "confirmed";
const connection = new Connection("https://api.testnet.solana.com", commitement);

async function metadata_2022() {

  const mintkeyPair = Keypair.generate();
  const metadata = {
    mint: mintkeyPair.publicKey,
    name: "N Turbine3",
    symbol: "NT3",
    uri: "",
    additionalMetadata: [],
  };

  const mintLen = getMintLen([ExtensionType.MetadataPointer]);

  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

  const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);


  const transaction = new Transaction();

  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: keypair.publicKey,
      newAccountPubkey: mintkeyPair.publicKey,
      space: mintLen,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMetadataPointerInstruction(
      mintkeyPair.publicKey,
      keypair.publicKey,
      mintkeyPair.publicKey,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeMintInstruction(
      mintkeyPair.publicKey,
      6,
      keypair.publicKey,
      null,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      mint: mintkeyPair.publicKey,
      metadata: mintkeyPair.publicKey,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      mintAuthority: keypair.publicKey,
      updateAuthority: keypair.publicKey,
    }),

  )
  const sign = await connection.sendTransaction(transaction, [keypair, mintkeyPair]);
  console.log(mintkeyPair.publicKey.toBase58());

  console.log("sign ", sign);

}

metadata_2022()
