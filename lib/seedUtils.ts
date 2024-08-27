import { generateMnemonic } from "bip39";

export function generateAndSaveSeed(): string {
  const mnemonic = generateMnemonic();
  localStorage.clear(); // removing all (Wallets & Seed phrase) the data from localStorage when new seed phrase is generated
  localStorage.setItem("mnemonic", mnemonic);
  return mnemonic;
}

export function loadSavedSeed(): string | null {
  return localStorage.getItem("mnemonic");
}
