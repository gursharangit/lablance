"use client";
// components/onboarding/user-type-selection.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, User, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";

type UserType = "company" | "labeler" | null;

export function UserTypeSelection() {
  const [selectedType, setSelectedType] = useState<UserType>(null);
  const [isChecking, setIsChecking] = useState(false);
  const { publicKey, connected } = useWallet();
  const router = useRouter();

  // Check wallet when component mounts or wallet connects
  useEffect(() => {
    const checkWalletRegistration = async () => {
      // Only check if wallet is connected
      if (!publicKey || !connected) return;
      
      try {
        setIsChecking(true);
        
        // Check if company exists with this wallet
        const response = await fetch(`/api/company?wallet=${encodeURIComponent(publicKey.toString())}`);
        const data = await response.json();
        
        if (response.ok && data.found === true) {
          // If company exists, redirect to dashboard
          console.log('Wallet already registered, redirecting to dashboard');
          router.push('/company/dashboard');
        } else {
          // Continue with onboarding
          setIsChecking(false);
        }
      } catch (error) {
        console.error('Error checking wallet registration:', error);
        setIsChecking(false);
      }
    };
    
    checkWalletRegistration();
  }, [publicKey, connected, router]);
  
  const handleCompanyClick = async (e: React.MouseEvent) => {
    if (selectedType !== "company") {
      setSelectedType("company");
      return;
    }
    
    // If wallet connected, check registration before proceeding
    if (publicKey && connected) {
      e.preventDefault();
      
      try {
        setIsChecking(true);
        
        // Check if company exists with this wallet
        const response = await fetch(`/api/company?wallet=${encodeURIComponent(publicKey.toString())}`);
        const data = await response.json();
        
        if (response.ok && data.found === true) {
          // If company exists, redirect to dashboard
          router.push('/company/dashboard');
        } else {
          // Proceed to company registration
          router.push('/onboarding/company');
        }
      } catch (error) {
        console.error('Error checking wallet registration:', error);
        // Proceed to company registration on error
        router.push('/onboarding/company');
      } finally {
        setIsChecking(false);
      }
    }
  };

  // Show loading indicator while checking
  if (isChecking) {
    return (
      <div className="max-w-4xl mx-auto flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Checking wallet registration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card 
        className={`cursor-pointer border-2 transition-all ${
          selectedType === "company" 
            ? "border-primary shadow-md scale-[1.02]" 
            : "hover:border-primary/50"
        }`}
        onClick={() => setSelectedType("company")}
      >
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">I'm a Company</CardTitle>
          <CardDescription className="text-base mt-2">
            I need data labeled for my AI projects
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <ul className="text-left space-y-3 mb-6">
            <li className="flex items-start">
              <div className="mr-2 mt-1 bg-primary/20 rounded-full p-1">
                <ArrowRight className="h-3 w-3 text-primary" />
              </div>
              <span>Access a global workforce for data labeling</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-1 bg-primary/20 rounded-full p-1">
                <ArrowRight className="h-3 w-3 text-primary" />
              </div>
              <span>Pay only for completed, quality-verified work</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-1 bg-primary/20 rounded-full p-1">
                <ArrowRight className="h-3 w-3 text-primary" />
              </div>
              <span>Scale your AI training data instantly</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Link 
            href="/onboarding/company" 
            className="w-full"
            onClick={handleCompanyClick}
          >
            <Button 
              className={`w-full ${selectedType === "company" ? "" : "opacity-70"}`}
              size="lg"
            >
              Continue as Company
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Card 
        className={`cursor-pointer border-2 transition-all ${
          selectedType === "labeler" 
            ? "border-primary shadow-md scale-[1.02]" 
            : "hover:border-primary/50"
        }`}
        onClick={() => setSelectedType("labeler")}
      >
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <User className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">I'm a Data Labeler</CardTitle>
          <CardDescription className="text-base mt-2">
            I want to earn money by labeling data
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <ul className="text-left space-y-3 mb-6">
            <li className="flex items-start">
              <div className="mr-2 mt-1 bg-primary/20 rounded-full p-1">
                <ArrowRight className="h-3 w-3 text-primary" />
              </div>
              <span>Get paid instantly for each task you complete</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-1 bg-primary/20 rounded-full p-1">
                <ArrowRight className="h-3 w-3 text-primary" />
              </div>
              <span>Work from anywhere with flexible hours</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-1 bg-primary/20 rounded-full p-1">
                <ArrowRight className="h-3 w-3 text-primary" />
              </div>
              <span>Receive payments directly to your Solana wallet</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Link href="/onboarding/labeler" className="w-full">
            <Button 
              className={`w-full ${selectedType === "labeler" ? "" : "opacity-70"}`}
              size="lg"
            >
              Continue as Labeler
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}