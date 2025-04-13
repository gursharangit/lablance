"use client";
// components/solana/solana-pay-transaction.tsx
import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  VersionedTransaction,
  TransactionMessage,
  TransactionSignature
} from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, AlertCircle, Loader2, ExternalLink } from "lucide-react";

// For production, use the actual USDC token address
const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

// Use an environment variable for the recipient address in production
const RECIPIENT_ADDRESS = process.env.NEXT_PUBLIC_PLATFORM_WALLET || "7YQbJcSKJJkXVSDrYs8ghRuGVh6qNrt7XLKMioQCpzqZ";

// Maximum number of confirmation attempts
const MAX_CONFIRMATION_ATTEMPTS = 20;

interface SolanaPayTransactionProps {
  amount: string;
  onSuccess?: (signature: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  projectId?: string;
}

enum TransactionStatus {
  IDLE = "idle",
  CREATING = "creating",
  SENDING = "sending",
  CONFIRMING = "confirming",
  SUCCESS = "success",
  ERROR = "error",
  TIMEOUT = "timeout"
}

export function SolanaPayTransaction({ 
  amount, 
  onSuccess, 
  onError,
  className = "",
  projectId = "default-project"
}: SolanaPayTransactionProps) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [status, setStatus] = useState<TransactionStatus>(TransactionStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [txSignature, setTxSignature] = useState<string>("");
  const [confirmationAttempts, setConfirmationAttempts] = useState(0);
  
  // Helper function to create explorer URL
  const getExplorerUrl = (signature: string) => {
    // Use mainnet-beta for production, devnet for testing
    const cluster = "devnet"; // Change to mainnet-beta for production
    return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
  };

  // Effect to check transaction status if we have a timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkTransaction = async () => {
      if (status === TransactionStatus.CONFIRMING && txSignature) {
        try {
          // Check if transaction is confirmed
          const result = await connection.getSignatureStatus(txSignature, {
            searchTransactionHistory: true,
          });
          
          if (result.value?.confirmationStatus === 'confirmed' || 
              result.value?.confirmationStatus === 'finalized') {
            // Transaction is confirmed
            setStatus(TransactionStatus.SUCCESS);
            if (onSuccess) onSuccess(txSignature);
            return;
          }
          
          // Increment attempt counter
          const newAttempts = confirmationAttempts + 1;
          setConfirmationAttempts(newAttempts);
          
          if (newAttempts >= MAX_CONFIRMATION_ATTEMPTS) {
            // We've tried enough times, notify the user but don't treat as error
            setStatus(TransactionStatus.TIMEOUT);
            setErrorMessage(`Transaction sent but confirmation is taking longer than expected. You can check the status on Solana Explorer.`);
          } else {
            // Try again in 3 seconds
            timeoutId = setTimeout(checkTransaction, 3000);
          }
        } catch (error) {
          console.error("Error checking transaction:", error);
          // Keep trying if there's an error checking the transaction
          timeoutId = setTimeout(checkTransaction, 3000);
        }
      }
    };
    
    if (status === TransactionStatus.CONFIRMING && txSignature) {
      timeoutId = setTimeout(checkTransaction, 3000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [status, txSignature, confirmationAttempts, connection, onSuccess]);

  const handlePayment = async () => {
    if (!publicKey) {
      setErrorMessage("Please connect your wallet first");
      setStatus(TransactionStatus.ERROR);
      return;
    }

    try {
      setStatus(TransactionStatus.CREATING);
      
      // Get the latest blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      
      // In a real implementation, you would:
      // 1. Call your backend to create a proper USDC transfer instruction
      // 2. Get the transaction from your backend
      // 3. Sign and send it
      
      // For demo purposes, we'll create a SOL transfer (simulating USDC)
      const amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Invalid amount");
      }

      // Create a transaction for SOL transfer
      const instructions = [
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(RECIPIENT_ADDRESS),
          lamports: amountValue * LAMPORTS_PER_SOL / 100, // Divide by 100 for testing amounts
        })
      ];
      
      // Add a memo with the project ID
      // In production you'd use the proper SPL Memo Program
      instructions.push({
        keys: [],
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        data: Buffer.from(`Project: ${projectId}`, "utf8"),
      });
      
      // Create transaction message
      const messageV0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions
      }).compileToV0Message();
      
      // Create transaction
      const transaction = new VersionedTransaction(messageV0);
      
      // Send transaction
      setStatus(TransactionStatus.SENDING);
      const signature = await sendTransaction(transaction, connection);
      setTxSignature(signature);
      setConfirmationAttempts(0);
      setStatus(TransactionStatus.CONFIRMING);

      // The confirmation check will happen in the useEffect

    } catch (error) {
      console.error("Transaction error:", error);
      setErrorMessage((error as Error).message || "An error occurred during the transaction");
      setStatus(TransactionStatus.ERROR);
      if (onError) onError(error as Error);
    }
  };

  // Handle manual check for transaction
  const handleCheckTransaction = async () => {
    if (!txSignature) return;
    
    try {
      setStatus(TransactionStatus.CONFIRMING);
      setConfirmationAttempts(0); // Reset attempts
      
      // This will trigger the useEffect to check the transaction
    } catch (error) {
      console.error("Error initiating transaction check:", error);
    }
  };

  // Accept transaction as successful even if confirmation timed out
  const handleAcceptTransaction = () => {
    if (onSuccess && txSignature) {
      onSuccess(txSignature);
    }
    setStatus(TransactionStatus.SUCCESS);
  };

  return (
    <div className={`${className} space-y-4`}>
      {status === TransactionStatus.CREATING && (
        <Card className="bg-muted/30 p-4">
          <CardContent className="p-0 flex items-center">
            <Loader2 className="h-5 w-5 text-primary mr-2 animate-spin" />
            <span>Creating transaction...</span>
          </CardContent>
        </Card>
      )}

      {status === TransactionStatus.SENDING && (
        <Card className="bg-muted/30 p-4">
          <CardContent className="p-0 flex items-center">
            <Loader2 className="h-5 w-5 text-primary mr-2 animate-spin" />
            <span>Sending transaction...</span>
          </CardContent>
        </Card>
      )}

      {status === TransactionStatus.CONFIRMING && (
        <Card className="bg-muted/30 p-4">
          <CardContent className="p-0 flex flex-col gap-2">
            <div className="flex items-center">
              <Loader2 className="h-5 w-5 text-primary mr-2 animate-spin" />
              <span>Confirming transaction... (Attempt {confirmationAttempts}/{MAX_CONFIRMATION_ATTEMPTS})</span>
            </div>
            {txSignature && (
              <p className="text-xs text-muted-foreground">
                Transaction ID: <span className="font-mono">{txSignature.slice(0, 8)}...{txSignature.slice(-8)}</span>
                <a 
                  href={getExplorerUrl(txSignature)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline ml-2"
                >
                  View on Explorer <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {status === TransactionStatus.SUCCESS && (
        <Card className="bg-primary/10 p-4 border-primary/20">
          <CardContent className="p-0 space-y-2">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-primary mr-2" />
              <span className="font-medium">Transaction successful!</span>
            </div>
            {txSignature && (
              <p className="text-xs text-muted-foreground">
                Transaction ID: <span className="font-mono">{txSignature.slice(0, 8)}...{txSignature.slice(-8)}</span>
                <a 
                  href={getExplorerUrl(txSignature)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline ml-2"
                >
                  View on Explorer <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {status === TransactionStatus.ERROR && (
        <Card className="bg-destructive/10 p-4 border-destructive/20">
          <CardContent className="p-0 flex items-center">
            <AlertCircle className="h-5 w-5 text-destructive mr-2" />
            <span className="text-destructive">{errorMessage || "Transaction failed"}</span>
          </CardContent>
        </Card>
      )}

      {status === TransactionStatus.TIMEOUT && (
        <Card className="bg-yellow-100/50 dark:bg-yellow-900/20 p-4 border-yellow-500/20">
          <CardContent className="p-0 space-y-3">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <span className="font-medium text-yellow-700 dark:text-yellow-300">Transaction sent but confirmation is taking longer than expected</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The transaction has been submitted to the network but is taking longer than expected to confirm. This is sometimes normal during network congestion.
            </p>
            {txSignature && (
              <p className="text-xs text-muted-foreground">
                Transaction ID: <span className="font-mono">{txSignature.slice(0, 8)}...{txSignature.slice(-8)}</span>
                <a 
                  href={getExplorerUrl(txSignature)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline ml-2"
                >
                  View on Explorer <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </p>
            )}
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCheckTransaction}
              >
                Check Again
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAcceptTransaction}
              >
                Accept & Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {status !== TransactionStatus.SUCCESS && (
        <Button
          type="button"
          className="w-full"
          onClick={handlePayment}
          disabled={!publicKey || status === TransactionStatus.CREATING || status === TransactionStatus.SENDING || status === TransactionStatus.CONFIRMING}
        >
          {!publicKey ? "Connect Wallet First" : 
           status === TransactionStatus.CREATING || status === TransactionStatus.SENDING || status === TransactionStatus.CONFIRMING ? 
           "Processing Payment..." : 
           status === TransactionStatus.TIMEOUT ? 
           "Try Again" : 
           "Pay with Solana"}
        </Button>
      )}
    </div>
  );
}
