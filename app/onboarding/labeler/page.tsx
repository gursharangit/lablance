// app/onboarding/labeler/page.tsx
import { LabelerRegistrationForm } from "@/components/onboarding/labeler-registration-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Labeler Registration - AI Data Labeling Platform",
  description: "Join our global workforce and earn by labeling data",
};

export default function LabelerOnboardingPage() {
  return (
    <div className="container py-20 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Join Our Global Workforce
        </h1>
        <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Start earning by labeling data and get paid instantly with USDC
        </p>
        
        <LabelerRegistrationForm />
      </div>
    </div>
  );
}
