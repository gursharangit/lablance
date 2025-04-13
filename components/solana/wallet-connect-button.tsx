"use client";
// components/solana/wallet-connect-button.tsx
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState } from "react";
import { Wallet } from "lucide-react";

export function WalletConnectButton({ className = "" }: { className?: string }) {
  const { publicKey, connecting, connected, wallet } = useWallet();
  const [showAddress, setShowAddress] = useState(false);
  
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Custom styling to override wallet-adapter default styles with red button style
  const customStyles = `
    .wallet-adapter-button-trigger {
      background-color: #FF0000 !important;
      border-radius: 0.5rem !important;
      height: 2.5rem !important;
      padding: 0 1rem !important;
      font-family: inherit !important;
      font-size: 0.875rem !important;
      font-weight: 500 !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border: none !important;
      outline: none !important;
      transition: background-color 0.2s ease !important;
      color: white !important;
    }
    
    .wallet-adapter-button-trigger:hover {
      background-color: #E00000 !important;
    }
    
    .wallet-adapter-button.wallet-adapter-button-trigger {
      height: auto !important;
      padding: 0.5rem 1rem !important;
    }

    .wallet-adapter-button .wallet-adapter-button-start-icon,
    .wallet-adapter-button .wallet-adapter-button-end-icon {
      margin: 0 0.3rem !important;
    }
    
    .wallet-adapter-dropdown {
      font-family: inherit !important;
    }
    
    .wallet-adapter-dropdown-list {
      background: #252525 !important;
      border: 1px solid #333333 !important;
      border-radius: 0.5rem !important;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important;
      font-family: inherit !important;
    }
    
    .wallet-adapter-dropdown-list-item {
      color: white !important;
      font-size: 0.875rem !important;
      transition: background-color 0.2s ease !important;
    }
    
    .wallet-adapter-dropdown-list-item:hover {
      background-color: #333333 !important;
    }

    .connected-wallet-button {
      background-color: #FF0000;
      color: white;
      border: none;
      border-radius: 0.5rem;
      height: 2.5rem;
      padding: 0 1rem;
      font-family: inherit;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s ease;
    }

    .connected-wallet-button:hover {
      background-color: #E00000;
    }
    
    .wallet-adapter-modal-wrapper {
      background: #252525 !important;
      border: 1px solid #333333 !important;
      border-radius: 0.75rem !important;
    }
    
    .wallet-adapter-modal-button-close {
      background: #333333 !important;
    }
    
    .wallet-adapter-modal-title {
      color: white !important;
    }
    
    .wallet-adapter-modal-content {
      color: #CCC !important;
    }
    
    .wallet-adapter-modal-list .wallet-adapter-button {
      background-color: #333333 !important;
      color: white !important;
    }
    
    .wallet-adapter-modal-list .wallet-adapter-button:hover {
      background-color: #444444 !important;
    }
    
    .wallet-adapter-modal-list .wallet-adapter-button-end-icon,
    .wallet-adapter-modal-list .wallet-adapter-button-start-icon,
    .wallet-adapter-modal-list .wallet-adapter-button-end-icon img,
    .wallet-adapter-modal-list .wallet-adapter-button-start-icon img {
      color: white !important;
      width: 24px !important;
      height: 24px !important;
    }
  `;

  // If wallet is connected, show a custom button with the wallet info
  if (connected && publicKey) {
    return (
      <div className={className}>
        <style>{customStyles}</style>
        <button
          className="connected-wallet-button"
          onClick={() => setShowAddress(!showAddress)}
        >
          <Wallet className="h-4 w-4 mr-2" />
          <span>
            {wallet?.adapter.name}: {truncateAddress(publicKey.toString())}
          </span>
        </button>
        
        {showAddress && (
          <div className="absolute mt-1 bg-[#252525] border border-[#333333] p-2 rounded-md shadow-lg text-xs">
            <p className="font-mono whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] text-white">
              {publicKey.toString()}
            </p>
          </div>
        )}
      </div>
    );
  }

  // If wallet is connecting, show loading state
  if (connecting) {
    return (
      <div className={className}>
        <style>{customStyles}</style>
        <button className="connected-wallet-button" disabled>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connecting...
        </button>
      </div>
    );
  }

  // Default state: not connected
  return (
    <div className={`${className}`}>
      <style>{customStyles}</style>
      <div className="wallet-adapter-container">
        <WalletMultiButton 
          className="wallet-adapter-button wallet-adapter-button-trigger"
          startIcon={<Wallet className="h-4 w-4" />}
        >
          Select Wallet
        </WalletMultiButton>
      </div>
    </div>
  );
}
