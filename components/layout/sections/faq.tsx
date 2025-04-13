import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "How does the payment system work?",
    answer:
      "Our platform uses Solana blockchain technology to facilitate instant payments in USDC stablecoin. Companies fund their projects upfront, and labelers receive payment immediately upon successful completion of tasks. All transactions are secure, transparent, and have minimal fees.",
    value: "item-1",
  },
  {
    question: "What types of data labeling projects are supported?",
    answer:
      "We support a wide range of data labeling projects including image classification, object detection, text annotation, audio transcription, data cleaning, sentiment analysis, and more. Our platform is designed to handle diverse AI training needs across various domains.",
    value: "item-2",
  },
  {
    question: "How is quality assured for labeled data?",
    answer:
      "We implement multi-level quality control mechanisms including validation checks, consistency scoring, and performance tracking. For premium-tier projects, we also provide expert reviews and validation by multiple labelers to ensure the highest accuracy standards.",
    value: "item-3",
  },
  {
    question: "Can I join as a labeler from any country?",
    answer:
      "Yes, our platform welcomes labelers from around the world. You only need a Solana wallet, reliable internet connection, and the relevant skills for the projects you want to work on. We support multiple languages and have a truly global workforce.",
    value: "item-4",
  },
  {
    question: "What are the requirements to get started as a company?",
    answer:
      "To get started as a company, you need to create an account, connect your Solana wallet for payments, provide basic company information, and have your data ready for labeling. Our onboarding process is simple and only takes a few minutes.",
    value: "item-5",
  },
  {
    question: "How long does it take to complete a labeling project?",
    answer:
      "Project completion times vary based on the complexity and volume of the data. Small projects can be completed within days, while larger ones might take weeks. Our platform provides real-time progress tracking and estimated completion dates based on project size and labeler availability.",
    value: "item-6",
  },
  {
    question: "Is my data secure on the platform?",
    answer:
      "Absolutely. We implement industry-standard security measures to protect your data. Files are encrypted during storage and transfer, and only assigned labelers have access to the specific data they need to work on. We never share your data with third parties.",
    value: "item-7",
  },
  {
    question: "Do I need technical knowledge to use the platform?",
    answer:
      "No, our platform is designed to be user-friendly for both companies and labelers. While basic familiarity with wallets is helpful, our intuitive interfaces guide you through every step of the process, from project creation to task completion.",
    value: "item-8",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="container py-24 sm:py-32 relative">
      <div className="absolute -z-10 transform -translate-y-1/2 left-0 w-36 h-36 bg-primary/20 rounded-full blur-2xl opacity-60"></div>
      <div className="absolute -z-10 right-0 w-36 h-36 bg-primary/20 rounded-full blur-2xl opacity-60"></div>
      
      <div className="text-center mb-12">
        <h2 className="text-lg text-primary mb-2 tracking-wider font-medium">
          FAQ
        </h2>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Common Questions
        </h2>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to frequently asked questions about our AI data labeling platform.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {FAQList.map(({ question, answer, value }) => (
            <AccordionItem key={value} value={value} className="border-b border-muted-foreground/20">
              <AccordionTrigger className="text-left text-lg font-medium py-4">
                {question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="mt-12 text-center bg-muted/30 p-8 rounded-lg border border-muted-foreground/10">
          <h3 className="text-xl font-bold mb-3">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">
            If you couldn't find the answer to your question, feel free to reach out to our support team.
          </p>
          <Button asChild>
            <Link href="mailto:gurusharanworks1@gmail.com">
              Contact Support
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};