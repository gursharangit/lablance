"use client";
// components/onboarding/payment-form.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, DollarSign, Shield, BadgeCheck, Clock, Info, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { WalletConnectButton } from "@/components/solana/wallet-connect-button";
import { SolanaPayTransaction } from "@/components/solana/solana-pay-transaction";
import { useWallet } from "@solana/wallet-adapter-react";
import { fundProjectAction } from "@/actions/server-actions";

export function PaymentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [isFunded, setIsFunded] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>("");
  const [projectType, setProjectType] = useState<string>("");
  const [qualityRequirement, setQualityRequirement] = useState<string>("");
  const [estimatedItems, setEstimatedItems] = useState<number>(0);
  const [txSignature, setTxSignature] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("unknown");
  const { publicKey } = useWallet();
  const router = useRouter();
  
  // Estimated stats based on amount
  const pricePerItem = 0.12;
  const estimatedDays = Math.ceil(estimatedItems / 5000);
  
  // Get project details from cookies or state
  useEffect(() => {
    // Simple function to get a cookie value by name
    const getCookie = (name: string): string | undefined => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift();
      }
      return undefined;
    };

    // Get project ID from cookie
    const id = getCookie('project_id');
    if (id) {
      setProjectId(id);
    }
    
    // Fetch project details from API or session storage
    const fetchProjectDetails = async () => {
      try {
        // For demo, we'll get details from session storage
        // In production, you'd fetch from an API
        const projectDetails = sessionStorage.getItem('current_project_details');
        
        if (projectDetails) {
          const details = JSON.parse(projectDetails);
          setProjectName(details.name || "Skin Condition Detection");
          setProjectType(details.type || "Image Classification");
          setQualityRequirement(details.qualityRequirement || "High");
          
          // Set the estimated items from project details
          const items = details.estimatedItems || 0;
          setEstimatedItems(items);
          
          // Auto-calculate the amount based on the number of items
          const calculatedAmount = (items * pricePerItem).toFixed(2);
          setAmount(calculatedAmount);
        } else {
          // Fallback - check for individual items in session storage
          const name = sessionStorage.getItem('project_name');
          const type = sessionStorage.getItem('project_type');
          const quality = sessionStorage.getItem('quality_requirement');
          const items = sessionStorage.getItem('estimated_items');
          
          if (name) setProjectName(name);
          if (type) setProjectType(type);
          if (quality) setQualityRequirement(quality);
          
          if (items) {
            const itemCount = parseInt(items);
            setEstimatedItems(itemCount);
            const calculatedAmount = (itemCount * pricePerItem).toFixed(2);
            setAmount(calculatedAmount);
          }
        }
        
      } catch (error) {
        console.error("Error fetching project details:", error);
        // Fallback values
        setProjectName("Skin Condition Detection");
        setProjectType("Image Classification");
        setQualityRequirement("High");
        setEstimatedItems(11); // Default to 11 items as shown in your project form
        setAmount((11 * pricePerItem).toFixed(2));
      }
    };
    
    fetchProjectDetails();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form will only be submitted after successful payment
    if (isFunded) {
      setIsLoading(true);
      setFormError(null);
      
      try {
        const result = await fundProjectAction(amount, txSignature);
        
        if (result.success) {
          router.push("/onboarding/company/success");
        } else {
          throw new Error(result.error || "Failed to complete funding");
        }
      } catch (error) {
        setFormError((error as Error).message);
        setIsLoading(false);
      }
    }
  };

  const handlePaymentSuccess = (signature: string) => {
    setTxSignature(signature);
    setIsFunded(true);
  };

  const handlePaymentError = (error: Error) => {
    console.error("Payment error:", error);
    setFormError(error.message);
    setIsFunded(false);
  };

  // Format the quality requirement for display
  const formatQualityRequirement = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'standard': return 'Standard (90% accuracy)';
      case 'high': return 'High (95% accuracy)';
      case 'premium': return 'Premium (98% accuracy)';
      default: return quality;
    }
  };

  // Get accuracy percentage for display
  const getAccuracyPercentage = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'standard': return '90%';
      case 'high': return '95%';
      case 'premium': return '98%';
      default: return '95%';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-secondary">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <DollarSign className="mr-2 h-6 w-6 text-primary" />
            Project Funding
          </CardTitle>
          <CardDescription>
            Fund your project with USDC on Solana
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {formError && (
            <div className="bg-destructive/10 p-3 rounded-md border border-destructive/20 flex items-center">
              <AlertCircle className="h-5 w-5 text-destructive mr-2" />
              <p className="text-destructive text-sm">{formError}</p>
            </div>
          )}
          
          <div className="bg-muted/30 p-4 rounded-lg border border-muted-foreground/20">
            <h3 className="text-lg font-medium flex items-center">
              <Info className="mr-2 h-5 w-5 text-primary" />
              Project Summary
            </h3>
            <div className="grid grid-cols-1 gap-2 mt-3">
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Project Name:</span>
                <span className="font-medium">{projectName || "Loading..."}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Project Type:</span>
                <span className="font-medium">{projectType.replace(/-/g, ' ') || "Loading..."}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Quality Level:</span>
                <span className="font-medium">{formatQualityRequirement(qualityRequirement)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Price per Item:</span>
                <span className="font-medium text-primary">${pricePerItem.toFixed(2)} USDC</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Number of Items:</span>
                <span className="font-medium">{estimatedItems.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-muted-foreground/20 mt-2 pt-2">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-medium text-primary">${amount} USDC</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Fund (USDC)</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input 
                id="amount" 
                type="number" 
                className="pl-10" 
                placeholder="600" 
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setIsFunded(false); // Reset funded state when amount changes
                }}
                required 
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Automatically calculated based on your estimated items ({estimatedItems}) and price per item (${pricePerItem.toFixed(2)})
            </p>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <h3 className="text-lg font-medium mb-3">Estimated Project Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-3 bg-background rounded-md border border-muted-foreground/20">
                <BadgeCheck className="h-8 w-8 text-primary mb-2" />
                <span className="text-2xl font-bold">{estimatedItems.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">Items</span>
              </div>
              
              <div className="flex flex-col items-center p-3 bg-background rounded-md border border-muted-foreground/20">
                <Clock className="h-8 w-8 text-primary mb-2" />
                <span className="text-2xl font-bold">{estimatedDays}</span>
                <span className="text-sm text-muted-foreground">Est. Days</span>
              </div>
              
              <div className="flex flex-col items-center p-3 bg-background rounded-md border border-muted-foreground/20">
                <Shield className="h-8 w-8 text-primary mb-2" />
                <span className="text-2xl font-bold">{getAccuracyPercentage(qualityRequirement)}</span>
                <span className="text-sm text-muted-foreground">Accuracy</span>
              </div>
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-primary" />
              <Label>Connect Solana Wallet</Label>
            </div>
            
            {/* Wallet Connect Button */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <WalletConnectButton className="flex-1" />
              
              {publicKey && (
                <div className="bg-muted/30 p-3 rounded-md flex-1 text-sm flex items-center">
                  <BadgeCheck className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Wallet connected successfully</span>
                </div>
              )}
            </div>
            
            {publicKey && (
              <div className="mt-4">
                <h3 className="text-base font-medium mb-3">Make Payment</h3>
                <SolanaPayTransaction 
                  amount={amount} 
                  projectId={projectId}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            )}
            
            <div className="flex items-start space-x-2 bg-muted/50 p-3 rounded-md">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Your funds will be held in a secure escrow and only released to labelers as they complete verified work. You can monitor progress in real-time from your dashboard.
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6">
          <Button variant="outline" type="button" asChild>
            <Link href="/onboarding/company/project">
              Back
            </Link>
          </Button>
          
          <Button 
            type="submit" 
            disabled={isLoading || !isFunded}
          >
            {isLoading ? "Processing..." : isFunded ? "Complete Registration" : "Pay to Continue"}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
