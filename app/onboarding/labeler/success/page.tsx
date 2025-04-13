// app/onboarding/labeler/success/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, ArrowRight, Wallet, SearchCheck, Clock } from "lucide-react";
import Link from "next/link";

export default function LabelerSuccessPage() {
  return (
    <div className="container py-20 md:py-24">
      <div className="max-w-3xl mx-auto">
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 rounded-full p-3">
                <BadgeCheck className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl text-center">You're Ready to Start!</CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <p className="text-xl text-muted-foreground">
              Your account has been successfully created. You can now start labeling data and earning USDC with instant payments!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-muted/30 p-5 rounded-md flex flex-col items-center">
                <SearchCheck className="h-10 w-10 text-primary mb-2" />
                <h3 className="font-bold text-lg">Find Projects</h3>
                <p className="text-sm text-muted-foreground">Browse and accept projects</p>
              </div>
              
              <div className="bg-muted/30 p-5 rounded-md flex flex-col items-center">
                <Clock className="h-10 w-10 text-primary mb-2" />
                <h3 className="font-bold text-lg">Work Anytime</h3>
                <p className="text-sm text-muted-foreground">Flexible hours, no commitments</p>
              </div>
              
              <div className="bg-muted/30 p-5 rounded-md flex flex-col items-center">
                <Wallet className="h-10 w-10 text-primary mb-2" />
                <h3 className="font-bold text-lg">Get Paid</h3>
                <p className="text-sm text-muted-foreground">Instant payments for your work</p>
              </div>
            </div>
            
            <div className="bg-primary/5 p-6 rounded-md border border-primary/20 text-left">
              <h3 className="font-bold text-lg mb-2">What happens next?</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>Browse available projects that match your skills and interests</li>
                <li>Complete the required qualification tasks for projects you're interested in</li>
                <li>Start labeling data and receive instant payments for each completed task</li>
                <li>Build your reputation with high-quality work to unlock premium projects</li>
                <li>Withdraw your earnings to any exchange or use them directly as USDC</li>
              </ul>
            </div>
            
            <p className="text-muted-foreground">
              Wallet connected: <span className="font-mono text-sm">7YQb...K4xF</span>
            </p>
          </CardContent>
          
          <CardFooter className="flex justify-center pb-6">
            <Button asChild>
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}