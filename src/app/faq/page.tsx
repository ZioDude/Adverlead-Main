import FAQSection from "@/components/FAQSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FAQPage() {
  return (
    <div className="py-8">
      <FAQSection />
      <div className="container mx-auto px-4 mt-16 text-center">
        <h3 className="text-2xl md:text-3xl font-semibold mb-4">Can't find what you're looking for?</h3>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          If you have other questions or need more specific information, please don't hesitate to reach out to our support team.
        </p>
        <Button asChild size="lg">
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  );
} 