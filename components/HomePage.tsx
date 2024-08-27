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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { generateAndSaveSeed, loadSavedSeed } from "@/lib/seedUtils";
import EthWallet from "./MultiWallet";

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
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Wallet Seed Management</CardTitle>
          <CardDescription>Generate or enter your seed phrase</CardDescription>
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
        <CardFooter>
          {mnemonic && (
            <Alert>
              <AlertTitle>Current Seed Phrase</AlertTitle>
              <AlertDescription>{mnemonic}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>

      {showAlert && (
        <Alert className="mb-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Seed phrase has been saved/generated successfully.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Multi-Wallet Management</CardTitle>
        </CardHeader>
        <CardContent>
          <EthWallet mnemonic={mnemonic} key={mnemonic} />
        </CardContent>
      </Card>
    </div>
  );
}
