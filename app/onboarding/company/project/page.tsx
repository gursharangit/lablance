// app/onboarding/company/project/page.tsx
import { ProjectCreationForm } from "@/components/onboarding/project-creation-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Project - AI Data Labeling Platform",
  description: "Set up your first data labeling project",
};

export default function CompanyProjectPage() {
  return (
    <div className="container py-20 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Create Your First Project
        </h1>
        <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Describe your data labeling needs and set your project parameters
        </p>
        
        <ProjectCreationForm />
      </div>
    </div>
  );
}