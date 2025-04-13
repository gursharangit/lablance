import { BenefitsSection } from "@/components/layout/sections/benefits";
import { FAQSection } from "@/components/layout/sections/faq";
import { FeaturesSection } from "@/components/layout/sections/features";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";
import { ServicesSection } from "@/components/layout/sections/services";
import { TeamSection } from "@/components/layout/sections/team";

export const metadata = {
  title: "Lablance - AI Data Labeling Platform",
  description: "Connect global talent with AI training needs through blockchain technology",
  openGraph: {
    type: "website",
    url: "https://github.com/gursharangit/lablance", // Update with your actual domain when available
    title: "Lablance - AI Data Labeling Platform",
    description: "Blockchain-powered platform connecting companies with global workforce for AI data labeling",
    images: [
      {
        url: "https://github.com/gursharangit.png", 
        width: 1200,
        height: 630,
        alt: "Lablance - AI Data Labeling Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://github.com/gursharangit/lablance", // Update with your actual domain when available
    title: "Lablance - AI Data Labeling Platform",
    description: "Blockchain-powered platform connecting companies with global workforce for AI data labeling",
    images: [
      "https://github.com/gursharangit.png",
    ],
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection />
      <ServicesSection />
      <TeamSection />
      <FAQSection />
      <FooterSection />
    </>
  );
}