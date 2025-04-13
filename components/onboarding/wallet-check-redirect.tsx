"use client";
// components/onboarding/wallet-check-redirect.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2 } from "lucide-react";

interface WalletCheckRedirectProps {
  children: React.ReactNode;
  redirectToDashboard?: boolean;
}

export default function WalletCheckRedirect({ 
  children, 
  redirectToDashboard = true 
}: WalletCheckRedirectProps) {
  const [isChecking, setIsChecking] = useState(false);
  const { publicKey, connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    const checkWalletRegistration = async () => {
      // Only run check if wallet is connected and we're not already checking
      if (!publicKey || !connected || isChecking) return;
      
      try {
        setIsChecking(true);
        
        // Call API to check if wallet is registered
        const response = await fetch(`/api/company?wallet=${encodeURIComponent(publicKey.toString())}`);
        const data = await response.json();
        
        // If company exists, redirect to dashboard
        if (response.ok && data.found === true) {
          console.log('Wallet already registered, redirecting to dashboard');
          
          if (redirectToDashboard) {
            router.push('/company/dashboard');
          }
        } else {
          console.log('Wallet not registered or API error');
          // Continue with onboarding flow
          setIsChecking(false);
        }
      } catch (error) {
        console.error('Error checking wallet registration:', error);
        setIsChecking(false);
      }
    };
    
    checkWalletRegistration();
  }, [publicKey, connected, router, isChecking, redirectToDashboard]);

  // Show loading indicator while checking
  if (isChecking) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Return children if no redirect happened
  return <>{children}</>;
}