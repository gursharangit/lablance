"use client";
// components/solana/wallet-provider.tsx
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  // Remove problematic wallet adapters
  // SlopeWalletAdapter, // This one is causing the error
  // BackpackWalletAdapter,
  // TorusWalletAdapter,
  // LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { FC, ReactNode, useMemo } from "react";

// Import the wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css";

interface WalletContextProviderProps {
  children: ReactNode;
  network?: WalletAdapterNetwork;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ 
  children,
  network = WalletAdapterNetwork.Devnet, // Use Devnet by default for testing
}) => {
  // Define the wallet adapters for different wallet providers
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      // Remove the problematic wallet adapters
    ],
    []
  );

  // Get the Solana connection endpoint based on the selected network
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};