// app/onboarding/company/payment/page.tsx
import { PaymentForm } from "@/components/onboarding/payment-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fund Your Project - AI Data Labeling Platform",
  description: "Fund your data labeling project with USDC on Solana",
};

export default function CompanyPaymentPage() {
  return (
    <div className="container py-20 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Fund Your Project
        </h1>
        <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Secure payment via Solana blockchain with instant processing
        </p>
        
        <PaymentForm />
      </div>
    </div>
  );
}