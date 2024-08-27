"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateAndSaveSeed, loadSavedSeed } from "@/lib/seedUtils";
import EthWallet from "./MultiWallet";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";

export default function HomePage() {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [inputMnemonic, setInputMnemonic] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    const savedMnemonic = loadSavedSeed();
    if (savedMnemonic) {
      setMnemonic(savedMnemonic);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMnemonic(e.target.value);
  };

  const handleSaveSeed = () => {
    if (inputMnemonic) {
      const trimmedMnemonic = inputMnemonic.trim();
      localStorage.clear();
      localStorage.setItem("mnemonic", trimmedMnemonic);
      setMnemonic(trimmedMnemonic);
    } else {
      const newMnemonic = generateAndSaveSeed();
      setMnemonic(newMnemonic);
      setInputMnemonic(newMnemonic);
    }
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-6 max-w-4xl">
        {showAlert && (
          <Alert className="mb-6">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Seed phrase has been saved/generated successfully.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seed Phrase Management</CardTitle>
              <CardDescription>
                Generate or enter your seed phrase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={inputMnemonic}
                onChange={handleInputChange}
                placeholder="Enter your seed phrase here or leave it empty to generate new"
                className="mb-4"
              />
              <Button onClick={handleSaveSeed} className="w-full">
                Save/Generate Seed
              </Button>
            </CardContent>
            {mnemonic && (
              <CardFooter>
                <Alert variant="default">
                  <AlertTitle>Current Seed Phrase</AlertTitle>
                  <AlertDescription className="break-all">
                    {mnemonic}
                  </AlertDescription>
                </Alert>
              </CardFooter>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Multi-Wallet Management</CardTitle>
            </CardHeader>
            <CardContent>
              <EthWallet mnemonic={mnemonic} key={mnemonic} />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
