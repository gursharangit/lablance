import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

enum ServiceTier {
  STANDARD = 0,
  PREMIUM = 1,
}

interface ServiceProps {
  title: string;
  price: string;
  tier: ServiceTier;
  description: string;
  features: string[];
  recommended?: boolean;
}

const serviceList: ServiceProps[] = [
  {
    title: "Standard Labeling",
    price: "$0.10",
    tier: ServiceTier.STANDARD,
    description: "Perfect for startups and smaller AI projects",
    features: [
      "90% accuracy guarantee",
      "Basic quality validation",
      "Image classification",
      "Text annotation",
      "Standard support",
      "5-day turnaround time",
    ],
  },
  {
    title: "Premium Labeling",
    price: "$0.18",
    tier: ServiceTier.PREMIUM,
    description: "For enterprise-grade AI training needs",
    features: [
      "98% accuracy guarantee",
      "Multi-level validation",
      "All labeling types supported",
      "Custom annotation guidelines",
      "Priority support",
      "3-day turnaround time",
      "Custom export formats"
    ],
    recommended: true,
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="container py-24 sm:py-32 relative">
      <div className="absolute -z-10 right-0 top-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
      
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-lg text-primary mb-2 tracking-wider font-medium">
          DATA LABELING SERVICES
        </h2>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Flexible Plans for Your AI Needs
        </h2>
        
        <p className="text-xl text-muted-foreground mb-8">
          Choose the right service level for your project requirements,
          with transparent per-task pricing and no hidden fees.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {serviceList.map(({ title, price, tier, description, features, recommended }) => (
          <Card
            key={title}
            className={`relative h-full flex flex-col ${
              recommended 
                ? "border-primary shadow-lg shadow-primary/10" 
                : "border-muted-foreground/20"
            }`}
          >
            {recommended && (
              <div className="absolute top-0 right-0">
                <Badge className="m-4 py-1 px-3 bg-primary text-white">
                  Recommended
                </Badge>
              </div>
            )}
            
            <CardHeader>
              <div className="space-y-1">
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
              <div className="mt-4 flex items-baseline text-primary">
                <span className="text-4xl font-bold tracking-tight">{price}</span>
                <span className="ml-1 text-muted-foreground text-xl">/task</span>
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <div className="space-y-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <p className="ml-3 text-base">{feature}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            
            <div className="p-6 pt-0 mt-auto">
              <Button 
                asChild 
                className={`w-full ${recommended ? "" : "variant-outline"}`}
                variant={recommended ? "default" : "outline"}
              >
                <Link href="/onboarding/company">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Additional Services */}
      <div className="mt-16 text-center max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">Additional Services</h3>
        <p className="text-muted-foreground mb-8">
          Need specialized data labeling? We offer custom solutions for unique AI training requirements.
        </p>
        
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Custom Annotation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Specialized annotation schemas for domain-specific AI models</p>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Expert Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Domain expert validation for specialized fields like healthcare or legal</p>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Data Enrichment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Additional metadata tagging and attribute enhancement for your datasets</p>
            </CardContent>
          </Card>
        </div>
        
        <Button variant="outline" className="mt-8">
          <Link href="/contact">
            Contact for Custom Solutions
          </Link>
        </Button>
      </div>
    </section>
  );
};
