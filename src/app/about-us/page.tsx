import AboutUsSection from "@/components/AboutUsSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutUsPage() {
  return (
    <div className="py-8">
      <AboutUsSection />
      <div className="container mx-auto px-4 mt-12 text-center">
        <h3 className="text-2xl font-semibold mb-6">Meet the Team & Our Values</h3>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Adverlead was founded by a group of marketing technologists and software engineers passionate about solving the core challenges of Meta advertising. We believe in transparency, innovation, and building tools that genuinely help businesses grow. More details about our team members and company culture will be shared here soon.
        </p>
        <Button asChild>
          <Link href="/contact">Get in Touch</Link>
        </Button>
      </div>
    </div>
  );
} 