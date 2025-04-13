import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: "Wallet",
    title: "Instant Payments",
    description:
      "Receive or send payments immediately with USDC on Solana blockchain. No delays, no intermediaries, just instant transactions.",
  },
  {
    icon: "Globe",
    title: "Global Workforce",
    description:
      "Access a diverse pool of talented data labelers from around the world, ready to handle projects in multiple languages and domains.",
  },
  {
    icon: "BadgeCheck",
    title: "Quality Assurance",
    description:
      "Our platform implements rigorous quality control measures to ensure your data is labeled with high accuracy and consistency.",
  },
  {
    icon: "Shield",
    title: "Secure & Transparent",
    description:
      "Blockchain technology ensures all transactions are secure, traceable, and immutable, with full transparency for all parties.",
  },
];

export function BenefitsSection() {
  return (
    <section id="benefits" className="container py-24 sm:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute -z-10 inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/30 to-orange-400/30 blur-3xl"></div>
      </div>
      
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div className="order-2 lg:order-1">
          <h2 className="text-lg text-primary mb-2 tracking-wider font-medium">
            PLATFORM BENEFITS
          </h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Our Platform
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-lg">
            Our AI data labeling platform connects companies with skilled labelers worldwide, 
            powered by blockchain technology for secure, instant payments and high-quality results.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 w-full order-1 lg:order-2 mb-12 lg:mb-0">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-background/60 backdrop-blur-sm dark:bg-card/50 border border-muted hover:border-primary/20 transition-all duration-200 hover:shadow-md group"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="bg-primary/10 rounded-lg p-2.5 mb-2">
                    <Icon
                      name={icon as keyof typeof icons}
                      size={24}
                      color="hsl(var(--primary))"
                      className="text-primary"
                    />
                  </div>
                  <span className="text-5xl font-medium opacity-10 group-hover:opacity-20 transition-opacity">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle className="text-xl">{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
