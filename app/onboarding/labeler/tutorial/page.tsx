// app/onboarding/labeler/tutorial/page.tsx
import { TutorialSteps } from "@/components/onboarding/tutorial-steps";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tutorial - AI Data Labeling Platform",
  description: "Learn how to use our platform to label data and earn",
};

export default function LabelerTutorialPage() {
  return (
    <div className="container py-20 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Quick Tutorial
        </h1>
        <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Learn how to use our platform to label data and earn
        </p>
        
        <TutorialSteps />
      </div>
    </div>
  );
}