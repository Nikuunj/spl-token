import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import wallet from "C:/Users/Nikunj/.config/solana/id.json";
import type { Commitment } from "@solana/web3.js";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const commitement: Commitment = "confirmed";

const connection = new Connection("https://api.testnet.solana.com", commitement);

const mint = new PublicKey("D9hgi7xRkukiafErRcPqtHw3zeydWFXsbzFPgguRw9jR");

console.log(mint.toString());

