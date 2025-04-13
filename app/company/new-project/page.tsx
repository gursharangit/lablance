"use client";
// app/company/new-project/page.tsx
import { ProjectCreationForm } from "@/components/onboarding/project-creation-form";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NewProjectPage() {
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkWalletRegistration = async () => {
      if (!publicKey || !connected) {
        setError("Please connect your wallet to create a new project");
        setIsChecking(false);
        return;
      }

      try {
        // Check if company exists for this wallet
        const response = await fetch(`/api/company?wallet=${encodeURIComponent(publicKey.toString())}`);
        const data = await response.json();

        if (!response.ok || !data.found) {
          setError("No company found for this wallet. Please register your company first.");
          setIsChecking(false);
          return;
        }

        // Store company ID
        setCompanyId(data.company.id);
        setIsChecking(false);
      } catch (error) {
        console.error("Error checking company registration:", error);
        setError("Failed to verify company registration. Please try again.");
        setIsChecking(false);
      }
    };

    checkWalletRegistration();
  }, [publicKey, connected]);

  if (isChecking) {
    return (
      <div className="container py-20 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Verifying your company account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/20 text-center mb-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button asChild>
              <Link href="/company/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-20 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Create New Project
        </h1>
        <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Describe your data labeling needs and set project parameters
        </p>
        
        <ProjectCreationForm 
          companyId={companyId || ""} 
          redirectPath="/company/dashboard"
          isExistingCompany={true}
        />
      </div>
    </div>
  );
}