"use client";
import { useState, useEffect } from "react";
import {
  WalletInfo,
  createEthereumWallet,
  createSolanaWallet,
} from "@/lib/walletUtils";

interface WalletProps {
  mnemonic: string;
}

export default function MultiWallet({ mnemonic }: WalletProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [wallets, setWallets] = useState<WalletInfo[]>([]);

  useEffect(() => {
    const savedWallets = localStorage.getItem("multiwallets");
    if (savedWallets) {
      const parsedWallets = JSON.parse(savedWallets);
      setWallets(parsedWallets);
      setCurrentIndex(parsedWallets.length);
    }
  }, []);

  async function handleCreateEthereumWallet() {
    const newWallet = await createEthereumWallet(mnemonic, currentIndex);
    updateWallets(newWallet);
  }

  async function handleCreateSolanaWallet() {
    const newWallet = await createSolanaWallet(mnemonic, currentIndex);
    updateWallets(newWallet);
  }

  function updateWallets(newWallet: WalletInfo) {
    const updatedWallets = [...wallets, newWallet];
    setWallets(updatedWallets);
    setCurrentIndex(currentIndex + 1);
    localStorage.setItem("multiwallets", JSON.stringify(updatedWallets));
  }

  return (
    <>
      <div className="flex">
        <button
          className="bg-[#497493] text-[#F5F5F5] rounded-md py-1 px-2 mr-2"
          onClick={handleCreateEthereumWallet}
        >
          Create Ethereum Wallet
        </button>
        <button
          className="bg-[#497493] text-[#F5F5F5] rounded-md py-1 px-2"
          onClick={handleCreateSolanaWallet}
        >
          Create Solana Wallet
        </button>
      </div>
      {wallets.map((wallet, index) => (
        <div key={index} className="wallet-info">
          <p>
            Wallet {index + 1} - {wallet.type}
          </p>
          <p>Public Address: {wallet.address}</p>
          <p>Private Key: {wallet.privateKey}</p>
        </div>
      ))}
    </>
  );
}
