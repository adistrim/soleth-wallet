import { mnemonicToSeed } from "bip39";
import { HDNodeWallet, Wallet } from "ethers";
import { Keypair } from "@solana/web3.js";
import * as ed25519 from "ed25519-hd-key";

export interface WalletInfo {
  type: "ethereum" | "solana";
  address: string;
  privateKey: string;
}

export async function createEthereumWallet(
  mnemonic: string,
  currentIndex: number,
): Promise<WalletInfo> {
  const seed = await mnemonicToSeed(mnemonic);
  const derivativePath = `m/44'/60'/${currentIndex}'/0'`;
  const hdNode = HDNodeWallet.fromSeed(seed);
  const child = hdNode.derivePath(derivativePath);
  const privateKey = child.privateKey;
  const wallet = new Wallet(privateKey);
  return {
    type: "ethereum",
    address: wallet.address,
    privateKey: privateKey,
  };
}

export async function createSolanaWallet(
  mnemonic: string,
  currentIndex: number,
): Promise<WalletInfo> {
  const seed = await mnemonicToSeed(mnemonic);
  const derivativePath = `m/44'/501'/${currentIndex}'/0'`;
  const derivedSeed = ed25519.derivePath(
    derivativePath,
    seed.toString("hex"),
  ).key;
  const keypair = Keypair.fromSeed(derivedSeed);
  return {
    type: "solana",
    address: keypair.publicKey.toString(),
    privateKey: Buffer.from(keypair.secretKey).toString("hex"),
  };
}
