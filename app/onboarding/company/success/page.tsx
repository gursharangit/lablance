"use client";
// app/onboarding/company/success/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CompanySuccessPage() {
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    itemsCount: 0,
    amount: 0,
    estimatedDays: 0,
    transactionId: ""
  });

  useEffect(() => {
    // Get project details from session storage
    const loadProjectDetails = () => {
      try {
        // Try to get the full project details object
        const detailsJson = sessionStorage.getItem('current_project_details');
        const paymentAmount = sessionStorage.getItem('payment_amount');
        const txSignature = sessionStorage.getItem('transaction_signature');
        
        if (detailsJson) {
          const details = JSON.parse(detailsJson);
          
          // Calculate estimated days - assuming 5000 items per day
          const itemsPerDay = 5000;
          const estDays = Math.ceil((details.estimatedItems || 0) / itemsPerDay);
          
          setProjectDetails({
            name: details.name || "",
            itemsCount: details.estimatedItems || 0,
            amount: paymentAmount ? parseFloat(paymentAmount) : ((details.estimatedItems || 0) * 0.12),
            estimatedDays: estDays || 0,
            transactionId: txSignature || ""
          });
        } else {
          // Fallback to individual items
          const name = sessionStorage.getItem('project_name');
          const items = sessionStorage.getItem('estimated_items');
          const itemsCount = items ? parseInt(items) : 0;
          const amount = paymentAmount ? parseFloat(paymentAmount) : (itemsCount * 0.12);
          const estDays = Math.ceil(itemsCount / 5000) || 0;
          
          setProjectDetails({
            name: name || "",
            itemsCount: itemsCount,
            amount: amount,
            estimatedDays: estDays,
            transactionId: txSignature || ""
          });
        }
      } catch (error) {
        console.error("Error loading project details:", error);
        // Fallback to zero values
        setProjectDetails({
          name: "",
          itemsCount: 0,
          amount: 0,
          estimatedDays: 0,
          transactionId: ""
        });
      }
    };

    loadProjectDetails();
  }, []);

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
            <CardTitle className="text-3xl text-center">Project Successfully Funded!</CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <p className="text-xl text-muted-foreground">
              Your data labeling project is now active and ready for our global workforce to begin labeling.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-bold text-lg">{projectDetails.itemsCount.toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground">Items to Label</p>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-bold text-lg">{projectDetails.amount.toLocaleString()} USDC</h3>
                <p className="text-sm text-muted-foreground">Project Budget</p>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-bold text-lg">~{projectDetails.estimatedDays} days</h3>
                <p className="text-sm text-muted-foreground">Est. Completion</p>
              </div>
            </div>
            
            <div className="bg-primary/5 p-6 rounded-md border border-primary/20 text-left">
              <h3 className="font-bold text-lg mb-2">What happens next?</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>Our global workforce will begin labeling your data immediately</li>
                <li>You can monitor progress in real-time from your dashboard</li>
                <li>Payments will be automatically released to labelers as they complete verified work</li>
                <li>You'll receive notifications when important milestones are reached</li>
                <li>Download your labeled data at any time during the process</li>
              </ul>
            </div>
            
            {projectDetails.transactionId && (
              <p className="text-muted-foreground">
                Transaction ID: <span className="font-mono text-sm">{projectDetails.transactionId}</span>
              </p>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center pb-6">
            <Button asChild>
              <Link href="/company/dashboard">
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
