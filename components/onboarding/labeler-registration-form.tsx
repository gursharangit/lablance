"use client";
// components/onboarding/labeler-registration-form.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, User, Wallet, Info, Globe, ChevronDown, Languages, BadgeCheck, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { WalletConnectButton } from "@/components/solana/wallet-connect-button";

export function LabelerRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletExpanded, setIsWalletExpanded] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [primaryLanguage, setPrimaryLanguage] = useState('');
  const [englishProficiency, setEnglishProficiency] = useState('');
  
  const { publicKey } = useWallet();
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey) {
      setFormError("Please connect your wallet to continue");
      return;
    }
    
    setIsLoading(true);
    setFormError(null);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('wallet_address', publicKey.toString());
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('email', email);
      formData.append('country', country);
      formData.append('primary_language', primaryLanguage);
      formData.append('english_proficiency', englishProficiency);
      
      // Submit to API
      const response = await fetch('/api/labeler/register', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      if (data.already_registered) {
        // If already registered, redirect to dashboard
        router.push('/labeler/dashboard');
        return;
      }
      
      // Save labeler ID in cookie
      document.cookie = `labeler_id=${data.labeler.id}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
      document.cookie = `wallet_address=${publicKey.toString()}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
      
      // Go to skills page
      router.push('/onboarding/labeler/skills');
    } catch (error) {
      console.error('Error in labeler registration:', error);
      setFormError((error as Error).message || "Failed to register. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-secondary">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <User className="mr-2 h-6 w-6 text-primary" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Tell us about yourself to get started as a labeler
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
              <Label htmlFor="first-name">First Name</Label>
              <Input 
                id="first-name" 
                placeholder="Mei" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input 
                id="last-name" 
                placeholder="Suwannakit" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="mei@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select 
                value={country}
                onValueChange={setCountry}
                required
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="th">Thailand</SelectItem>
                  <SelectItem value="ph">Philippines</SelectItem>
                  <SelectItem value="in">India</SelectItem>
                  <SelectItem value="ng">Nigeria</SelectItem>
                  <SelectItem value="br">Brazil</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center" htmlFor="languages">
                <Languages className="mr-2 h-4 w-4 text-primary" />
                Primary Language
              </Label>
              <Select
                value={primaryLanguage}
                onValueChange={setPrimaryLanguage}
                required
              >
                <SelectTrigger id="languages">
                  <SelectValue placeholder="Select primary language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="th">Thai</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="english-proficiency">English Proficiency</Label>
              <Select
                value={englishProficiency}
                onValueChange={setEnglishProficiency}
                required
              >
                <SelectTrigger id="english-proficiency">
                  <SelectValue placeholder="Select proficiency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="native">Native/Fluent</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Collapsible 
            open={isWalletExpanded} 
            onOpenChange={setIsWalletExpanded} 
            className="border rounded-lg p-4 bg-primary/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wallet className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Solana Wallet (Required)</h3>
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
                  You&apos;ll receive instant payments in USDC directly to your Solana wallet for each task you complete.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <WalletConnectButton className="flex-1" />
                
                {publicKey && (
                  <div className="bg-muted/30 p-3 rounded-md flex-1 text-sm flex items-center">
                    <BadgeCheck className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>Wallet connected successfully</span>
                  </div>
                )}
              </div>
              
              {!publicKey && (
                <div className="text-sm text-destructive">
                  * You must connect a Solana wallet to receive payments
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
