"use client";
// components/onboarding/company-registration-form.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Wallet, Info, ChevronDown, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { WalletConnectButton } from "@/components/solana/wallet-connect-button";
import { registerCompanyAction } from "@/actions/server-actions";

export function CompanyRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletExpanded, setIsWalletExpanded] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  
  useEffect(() => {
    // Reset form error when wallet connects/disconnects
    setFormError(null);
  }, [publicKey, connected]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!publicKey) {
      setFormError("Please connect your wallet to continue");
      return;
    }
    
    setIsLoading(true);
    setFormError(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      formData.append('wallet_address', publicKey.toString());
      
      // Check that industry is selected
      if (!selectedIndustry) {
        throw new Error("Please select an industry");
      }
      
      // Print form data for debugging
      console.log("Form data:", {
        company_name: formData.get('company_name'),
        industry: formData.get('industry'),
        contact_name: formData.get('contact_name'),
        email: formData.get('email'),
        description: formData.get('description'),
        wallet_address: formData.get('wallet_address')
      });
      
      await registerCompanyAction(formData);
      
      // The redirect is handled in the server action
    } catch (error: any) {
      console.error("Error in company registration:", error);
      setFormError(error.message || "Failed to register company. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-secondary">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Building2 className="mr-2 h-6 w-6 text-primary" />
            Company Information
          </CardTitle>
          <CardDescription>
            Tell us about your company to get started
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {formError && (
            <div className="bg-destructive/10 p-3 rounded-md border border-destructive/20 flex items-center">
              <AlertCircle className="h-5 w-5 text-destructive mr-2" />
              <p className="text-destructive text-sm">{formError}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input id="company_name" name="company_name" placeholder="TechVision Inc." required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select 
                name="industry" 
                value={selectedIndustry} 
                onValueChange={setSelectedIndustry}
                required
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai-ml">AI/Machine Learning</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact_name">Contact Name</Label>
              <Input id="contact_name" name="contact_name" placeholder="John Smith" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="john@techvision.com" required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            <Textarea 
              id="description" 
              name="description"
              placeholder="Tell us a bit about your company and your AI projects..."
              className="min-h-[100px]"
            />
          </div>
          
          <Collapsible 
            open={isWalletExpanded} 
            onOpenChange={setIsWalletExpanded} 
            className="border rounded-lg p-4 bg-primary/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wallet className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Connect Solana Wallet (Required)</h3>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown className={`h-4 w-4 transition-transform ${isWalletExpanded ? "transform rotate-180" : ""}`} />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="mt-4 space-y-4">
              <div className="flex items-start space-x-2 bg-muted/50 p-3 rounded-md">
                <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Connecting a Solana wallet is required to deposit funds for data labeling projects and make payments securely using USDC.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <WalletConnectButton className="flex-1" />
                
                {publicKey && (
                  <div className="bg-muted/30 p-3 rounded-md flex-1 text-sm flex items-center overflow-hidden">
                    <Info className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="font-mono overflow-hidden text-ellipsis">
                      {publicKey.toString()}
                    </span>
                  </div>
                )}
              </div>
              
              {!publicKey && (
                <div className="text-sm text-destructive">
                  * You must connect a Solana wallet to continue
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6">
          <Button variant="outline" type="button" asChild>
            <Link href="/onboarding">
              Back
            </Link>
          </Button>
          
          <Button 
            type="submit" 
            disabled={isLoading || !publicKey}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
