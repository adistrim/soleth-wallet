"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

  async function handleCreateWallet(type: "ethereum" | "solana") {
    const newWallet =
      type === "ethereum"
        ? await createEthereumWallet(mnemonic, currentIndex)
        : await createSolanaWallet(mnemonic, currentIndex);
    updateWallets(newWallet);
  }

  function updateWallets(newWallet: WalletInfo) {
    const updatedWallets = [...wallets, newWallet];
    setWallets(updatedWallets);
    setCurrentIndex(currentIndex + 1);
    localStorage.setItem("multiwallets", JSON.stringify(updatedWallets));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Wallet</CardTitle>
        <CardDescription>Choose the type of wallet to create</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button onClick={() => handleCreateWallet("ethereum")}>
          Create Ethereum Wallet
        </Button>
        <Button onClick={() => handleCreateWallet("solana")}>
          Create Solana Wallet
        </Button>
      </CardContent>
      <CardFooter>
        <Tabs defaultValue="ethereum" className="w-full">
          <TabsList className="grid w-full grid-cols-2 ">
            <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
            <TabsTrigger value="solana">Solana</TabsTrigger>
          </TabsList>
          <TabsContent value="ethereum">
            {wallets
              .filter((w) => w.type === "ethereum")
              .map((wallet, index) => (
                <WalletCard key={index} wallet={wallet} index={index} />
              ))}
          </TabsContent>
          <TabsContent value="solana">
            {wallets
              .filter((w) => w.type === "solana")
              .map((wallet, index) => (
                <WalletCard key={index} wallet={wallet} index={index} />
              ))}
          </TabsContent>
        </Tabs>
      </CardFooter>
    </Card>
  );
}

function WalletCard({ wallet, index }: { wallet: WalletInfo; index: number }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          {wallet.type} Wallet {index + 1}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertTitle>Public Address</AlertTitle>
          <AlertDescription className="break-all">
            {wallet.address}
          </AlertDescription>
        </Alert>
        <Alert className="mt-2">
          <AlertTitle>Private Key</AlertTitle>
          <AlertDescription className="break-all">
            {wallet.privateKey}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
