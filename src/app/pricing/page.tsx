import PricingSection from "@/components/PricingSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="py-8">
      <PricingSection />
      <div className="container mx-auto px-4 mt-16 text-center">
        <h3 className="text-2xl md:text-3xl font-semibold mb-6">Frequently Asked Questions about Pricing</h3>
        <div className="max-w-3xl mx-auto space-y-4 text-left">
          <details className="bg-card p-4 rounded-lg shadow">
            <summary className="font-semibold cursor-pointer hover:text-primary">Is there a free trial?</summary>
            <p className="text-muted-foreground mt-2">Yes, we offer a 14-day free trial for our Pro plan. No credit card required to get started.</p>
          </details>
          <details className="bg-card p-4 rounded-lg shadow">
            <summary className="font-semibold cursor-pointer hover:text-primary">Can I change my plan later?</summary>
            <p className="text-muted-foreground mt-2">Absolutely! You can upgrade or downgrade your plan at any time from your account settings.</p>
          </details>
          <details className="bg-card p-4 rounded-lg shadow">
            <summary className="font-semibold cursor-pointer hover:text-primary">What payment methods do you accept?</summary>
            <p className="text-muted-foreground mt-2">We accept all major credit cards (Visa, Mastercard, American Express) and PayPal.</p>
          </details>
          <details className="bg-card p-4 rounded-lg shadow">
            <summary className="font-semibold cursor-pointer hover:text-primary">Do you offer discounts for annual billing?</summary>
            <p className="text-muted-foreground mt-2">Yes, you can save up to 20% if you choose to pay annually. This option is available on all plans.</p>
          </details>
        </div>
        <div className="mt-12">
            <p className="text-lg text-muted-foreground mb-4">Still have questions? We're here to help!</p>
            <Button asChild size="lg">
                <Link href="/contact">Contact Sales</Link>
            </Button>
        </div>
      </div>
    </div>
  );
} 