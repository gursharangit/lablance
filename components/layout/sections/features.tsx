import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "Tags",
    title: "Multiple Project Types",
    description:
      "Support for various labeling tasks including image classification, object detection, text annotation, and more.",
  },
  {
    icon: "TabletSmartphone",
    title: "Responsive Platform",
    description:
      "Work from any device with our mobile-friendly interface designed for labelers on the go.",
  },
  {
    icon: "BarChart",
    title: "Real-time Progress Tracking",
    description:
      "Monitor project completion, quality metrics, and spending in real-time through intuitive dashboards.",
  },
  {
    icon: "Wallet",
    title: "Blockchain Payments",
    description:
      "Secure, transparent payments via Solana blockchain with instant USDC transfers for completed work.",
  },
  {
    icon: "Users",
    title: "Global Talent Pool",
    description:
      "Access skilled labelers worldwide with expertise across multiple languages and domains.",
  },
  {
    icon: "ShieldCheck",
    title: "Quality Control",
    description:
      "Built-in quality assurance mechanisms that ensure accurate and consistent data labeling.",
  },
];

// Workflow steps with enhanced visual presentation
const workflowSteps = [
  {
    icon: "UserPlus",
    title: "Simple Onboarding",
    description: "Quick setup for both companies and labelers with wallet connection",
  },
  {
    icon: "LayoutGrid",
    title: "Task Distribution",
    description: "Automatic assignment of tasks based on labeler skills and availability",
  },
  {
    icon: "Coins",
    title: "Instant Payments",
    description: "Automated payments in USDC as soon as tasks are completed and verified",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="container py-24 sm:py-32 relative">
      {/* Background decoration */}
      <div className="absolute -z-10 top-1/3 -right-64 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute -z-10 bottom-0 -left-64 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl"></div>
      
      <div className="relative mb-12 text-center">
        <h2 className="text-lg text-primary mb-2 tracking-wider font-medium">
          PLATFORM FEATURES
        </h2>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Everything You Need for AI Data Labeling
        </h2>

        <p className="md:w-3/4 lg:w-2/3 mx-auto text-xl text-muted-foreground">
          Our comprehensive platform provides all the tools necessary for efficient data labeling, 
          connecting companies with skilled labelers through blockchain technology.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featureList.map(({ icon, title, description }) => (
          <Card key={title} className="bg-muted/30 border-muted-foreground/10 hover:border-primary/20 hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-2">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Icon
                  name={icon as keyof typeof icons}
                  size={24}
                  color="hsl(var(--primary))"
                  className="text-primary"
                />
              </div>

              <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>

            <CardContent className="text-muted-foreground">
              {description}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Improved Workflow Section - Full width with better visual flow */}
      <div className="mt-24 bg-gradient-to-br from-muted/50 via-muted/30 to-background rounded-xl p-8 lg:p-12 border border-muted">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold mb-4">Streamlined Labeling Workflow</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our intuitive interface makes it easy for labelers to complete tasks efficiently 
            while ensuring companies get high-quality labeled data for their AI models.
          </p>
        </div>
        
        {/* Timeline-style workflow steps */}
        <div className="relative">
          {/* Connecting line for the timeline */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/20 hidden md:block"></div>
          
          <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-8 relative z-10">
            {workflowSteps.map((step, index) => (
              <div key={index} className="relative">
                {/* Circular connector for timeline */}
                <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                  </div>
                </div>
                
                <Card className="bg-background border-primary/10 h-full shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                        <Icon
                          name={step.icon as keyof typeof icons}
                          size={28}
                          color="hsl(var(--primary))"
                          className="text-primary"
                        />
                      </div>
                      <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
