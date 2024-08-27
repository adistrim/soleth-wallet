"use client";
import EthWallet from "./MultiWallet";
import { useState, useEffect, ChangeEvent } from "react";
import { generateAndSaveSeed, loadSavedSeed } from "@/lib/seedUtils";

export default function HomePage() {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [inputMnemonic, setInputMnemonic] = useState<string>("");

  useEffect(() => {
    const savedMnemonic = loadSavedSeed();
    if (savedMnemonic) {
      setMnemonic(savedMnemonic);
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputMnemonic(e.target.value);
  };

  const handleSaveSeed = () => {
    if (mnemonic) {
      const mnemonic = inputMnemonic.trim();
      localStorage.clear();
      localStorage.setItem("mnemonic", mnemonic);
      setMnemonic(mnemonic);
    } else {
      const mnemonic = generateAndSaveSeed();
      setMnemonic(mnemonic);
      setInputMnemonic(mnemonic);
    }
    setInputMnemonic("");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <textarea
        value={inputMnemonic}
        onChange={handleInputChange}
        placeholder="Enter your seed phrase here or leave it empty to generate new"
        className="w-64 h-24 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleSaveSeed}
        className="bg-[#497493] text-[#F5F5F5] rounded-md py-2 px-4"
      >
        Save/Generate Seed
      </button>
      {mnemonic && <p>Current Seed Phrase: {mnemonic}</p>}
      <EthWallet mnemonic={mnemonic} key={mnemonic} />
    </div>
  );
}
