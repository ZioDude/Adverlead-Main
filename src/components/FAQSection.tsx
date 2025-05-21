'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    id: "faq-1",
    question: "What is Adverlead?",
    answer: "Adverlead is a platform designed to manage and optimize Meta (Facebook/Instagram) lead generation campaigns. It provides tools for creating, managing, and analyzing advertising campaigns, as well as tracking and managing leads captured through those campaigns."
  },
  {
    id: "faq-2",
    question: "How does Adverlead integrate with Meta?",
    answer: "Adverlead securely connects to your Meta Ads account via the Meta Ads API. This allows us to fetch campaign data, manage campaigns on your behalf (with your permission), and retrieve lead information in real-time."
  },
  {
    id: "faq-3",
    question: "What kind of support do you offer?",
    answer: "We offer different levels of support based on your plan. All plans include email support, while our Pro and Scale plans include priority email and chat support. Scale plan users also get a dedicated account manager."
  },
  {
    id: "faq-4",
    question: "Can I use Adverlead for multiple businesses or clients?",
    answer: "Yes! Our Pro and Scale plans are designed to support multiple Meta ad accounts, making it ideal for agencies or businesses managing several brands."
  },
  {
    id: "faq-5",
    question: "Is my data secure with Adverlead?",
    answer: "Absolutely. We take data security very seriously. We use industry-standard encryption and security protocols to protect your information and ensure compliance with data privacy regulations."
  }
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-xl mx-auto">
            Find answers to common questions about Adverlead.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqItems.map((item) => (
              <AccordionItem value={item.id} key={item.id} className="border border-border rounded-lg p-1 hover:border-primary/50 transition-colors bg-background">
                <AccordionTrigger className="text-lg font-medium px-6 py-4 text-left hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
} 