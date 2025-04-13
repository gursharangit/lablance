// app/onboarding/company/page.tsx
import { CompanyRegistrationForm } from "@/components/onboarding/company-registration-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Registration - AI Data Labeling Platform",
  description: "Register your company to get your data labeled",
};

export default function CompanyOnboardingPage() {
  return (
    <div className="container py-20 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Set Up Your Company Account
        </h1>
        <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Register your company to start getting your data labeled by our global workforce
        </p>
        
        <CompanyRegistrationForm />
      </div>
    </div>
  );
}