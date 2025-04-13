"use client";
// components/onboarding/tutorial-steps.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Image, DollarSign, ClipboardList } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// Sample Image Classification Task
const SampleTask = () => (
  <div className="border rounded-md p-4 mb-4">
    <div className="flex justify-center mb-4">
      <div className="bg-muted/30 p-1 rounded-md border border-muted-foreground/20 relative w-full max-w-md aspect-video">
        {/* Sample image placeholder */}
        <div className="w-full h-full flex items-center justify-center bg-muted/50">
          <Image className="h-10 w-10 text-muted-foreground" />
          <span className="sr-only">Sample image</span>
        </div>
        
        {/* Bounding box placeholder */}
        <div className="absolute border-2 border-primary top-1/4 left-1/4 w-1/2 h-1/2 rounded-sm"></div>
      </div>
    </div>
    
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-medium">Classify this vehicle:</span>
        <div className="space-x-2">
          <Button variant="outline" size="sm">Car</Button>
          <Button variant="outline" size="sm">Truck</Button>
          <Button variant="outline" size="sm" className="bg-primary/10 border-primary">Motorcycle</Button>
          <Button variant="outline" size="sm">Bicycle</Button>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button size="sm">Submit & Next</Button>
      </div>
    </div>
  </div>
);

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
}

const Step = ({ icon, title, description, isActive, isCompleted }: StepProps) => (
  <div className={`flex items-start p-4 rounded-md transition-all ${isActive ? 'bg-primary/5 border border-primary/20' : ''}`}>
    <div className={`mr-3 ${isCompleted ? 'text-primary' : isActive ? 'text-primary' : 'text-muted-foreground'}`}>
      {isCompleted ? <CheckCircle className="h-6 w-6" /> : icon}
    </div>
    <div>
      <h3 className={`font-medium ${isActive ? 'text-primary' : ''}`}>{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export function TutorialSteps() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const steps = [
    {
      icon: <ClipboardList className="h-6 w-6" />,
      title: "Find Available Projects",
      description: "Browse and select from available projects in the marketplace that match your skills and interests.",
    },
    {
      icon: <Image className="h-6 w-6" />,
      title: "Label Data",
      description: "Follow project instructions to accurately label data items. Projects may include image classification, object detection, text annotation, and more.",
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Get Paid Instantly",
      description: "Receive USDC payments directly to your Solana wallet as soon as your work is verified. No waiting for payment processing!",
    }
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    } else {
      // Tutorial completed, redirect to success
      window.location.href = "/onboarding/labeler/success";
    }
  };

  return (
    <Card className="border-secondary">
      <CardHeader>
        <CardTitle className="text-2xl">How It Works</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {steps.map((step, index) => (
            <Step 
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              isActive={currentStep === index}
              isCompleted={completedSteps.includes(index)}
            />
          ))}
        </div>
        
        {currentStep === 1 && (
          <div className="mt-6 border-t pt-6">
            <h3 className="font-medium mb-3">Try a Sample Task</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Here's an example of a simple image classification task. In this case, you'd need to identify and classify the vehicle in the image.
            </p>
            
            <SampleTask />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          type="button"
          onClick={() => {
            if (currentStep > 0) {
              setCurrentStep(currentStep - 1);
              setCompletedSteps(completedSteps.filter(step => step !== currentStep - 1));
            } else {
              window.location.href = "/onboarding/labeler/skills";
            }
          }}
        >
          Back
        </Button>
        
        <Button onClick={handleNext}>
          {currentStep < steps.length - 1 ? "Next" : "Complete Tutorial"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}