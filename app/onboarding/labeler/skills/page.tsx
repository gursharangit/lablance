// app/onboarding/labeler/skills/page.tsx
import { LabelerSkillsForm } from "@/components/onboarding/labeler-skills-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Skills - AI Data Labeling Platform",
  description: "Tell us about your skills and experience for data labeling",
};

export default function LabelerSkillsPage() {
  return (
    <div className="container py-20 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Tell Us About Your Skills
        </h1>
        <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          This helps us match you with suitable projects
        </p>
        
        <LabelerSkillsForm />
      </div>
    </div>
  );
}