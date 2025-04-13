import { UserTypeSelection } from "@/components/onboarding/user-type-selection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started - AI Data Labeling Platform",
  description: "Join our global workforce or get your data labeled today",
};

export default function OnboardingPage() {
  return (
    <div className="container py-20 md:py-32">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Get Started with AI Data Labeling
      </h1>
      <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-12">
        Choose how you want to use our platform
      </p>
      
      <UserTypeSelection />
    </div>
  );
}