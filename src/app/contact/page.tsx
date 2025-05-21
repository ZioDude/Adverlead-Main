import ContactFormSection from "@/components/ContactFormSection";

export default function ContactPage() {
  return (
    <div className="py-8">
      <ContactFormSection />
      {/* You can add additional contact information or a map here if needed */}
      <div className="container mx-auto px-4 mt-12 text-center">
        <h3 className="text-2xl font-semibold mb-4">Other Ways to Reach Us</h3>
        <p className="text-muted-foreground">
          If you prefer, you can also reach out to us via email or connect with us on social media (links coming soon!).
        </p>
         {/* Add social media links or other contact methods later */}
      </div>
    </div>
  );
} 