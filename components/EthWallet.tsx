"use client";
import { mnemonicToSeed } from "bip39";
import { HDNodeWallet, Wallet } from "ethers";
import { useState, useEffect } from "react";

interface EthWalletProps {
  mnemonic: string;
}

interface WalletInfo {
  address: string;
  privateKey: string;
}

export default function EthWallet({ mnemonic }: EthWalletProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [wallets, setWallets] = useState<WalletInfo[]>([]);

  useEffect(() => {
    // Clearing wallets when mnemonic changes
    setWallets([]);
    setCurrentIndex(0);

    const savedWallets = localStorage.getItem("ethwallets");
    if (savedWallets) {
      setWallets(JSON.parse(savedWallets));
      setCurrentIndex(JSON.parse(savedWallets).length);
    }
  }, []);

  async function createWallet() {
    const seed = await mnemonicToSeed(mnemonic);
    const derivativePath = `m/44'/60'/${currentIndex}'/0'`;
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(derivativePath);
    const privateKey = child.privateKey;

    const wallet = new Wallet(privateKey);

    const newWallet: WalletInfo = {
      address: wallet.address,
      privateKey: privateKey,
    };

    const updatedWallets = [...wallets, newWallet];
    setWallets(updatedWallets);
    setCurrentIndex(currentIndex + 1);

    localStorage.setItem("ethwallets", JSON.stringify(updatedWallets));
  }

  return (
    <>
      <button
        className="bg-[#497493] text-[#F5F5F5] rounded-md py-1 px-2"
        onClick={createWallet}
      >
        Create Ethereum Wallet
      </button>
      {wallets.map((wallet, index) => (
        <div key={index}>
          <p>Wallet {index + 1}</p>
          <p>Public Address: {wallet.address}</p>
          <p>Private Key: {wallet.privateKey}</p>
        </div>
      ))}
    </>
  );
}
