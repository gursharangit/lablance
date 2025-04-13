"use client";
// components/solana/simplified-wallet-button.tsx
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export function SimpleWalletButton({ className = "" }: { className?: string }) {
  const { publicKey, connecting } = useWallet();
  
  return (
    <div className={className}>
      <WalletMultiButton />
      
      {publicKey && (
        <div className="text-xs text-muted-foreground mt-2">
          Connected: {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
        </div>
      )}
    </div>
  );
}