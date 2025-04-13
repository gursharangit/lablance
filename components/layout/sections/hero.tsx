// components/layout/sections/hero.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-28">
        <div className="text-center space-y-8">
          <Badge variant="outline" className="text-sm py-2 px-4">
            <span className="mr-2 text-primary">
              <Badge>New</Badge>
            </span>
            <span>Blockchain-Powered AI Data Labeling</span>
          </Badge>

          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
            <h1>
              Accelerate AI with
              <span className="text-transparent px-2 bg-gradient-to-r from-primary to-orange-400 bg-clip-text">
                Global Talent
              </span>
              on Solana
            </h1>
          </div>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            Our Solana-powered platform connects companies with a global workforce for AI data labeling. Get high-quality labeled data fast with instant payments using blockchain technology.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button 
              asChild 
              className="w-full md:w-auto px-8 py-6 text-lg font-bold group"
            >
              <Link href="/onboarding">
                Get Started
                <ArrowRight className="size-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full md:w-auto px-8 py-6 text-lg font-bold"
            >
              <Link href="#features">
                Learn More
              </Link>
            </Button>
          </div>
          
          <div className="pt-6">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                <span>Instant Payments</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                <span>Global Workforce</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                <span>High Quality Data</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                <span>Blockchain Security</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
