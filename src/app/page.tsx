import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AdGenerationSection from "@/components/AdGenerationSection";
import CampaignManagementSection from "@/components/CampaignManagementSection";
import LeadQualificationSection from "@/components/LeadQualificationSection";
import AboutUsSection from "@/components/AboutUsSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import ContactFormSection from "@/components/ContactFormSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <AdGenerationSection />
      <CampaignManagementSection />
      <LeadQualificationSection />
      <AboutUsSection />
      <PricingSection />
      <FAQSection />
      <ContactFormSection />
    </>
  );
}
