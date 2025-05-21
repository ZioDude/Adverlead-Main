import LeadQualificationSection from "@/components/LeadQualificationSection";

export default function LeadQualificationPage() {
  return (
    <div className="py-8">
      <LeadQualificationSection />
      {/* Add more detailed information about lead qualification features here */}
      <div className="container mx-auto px-4 mt-12">
        <h3 className="text-2xl font-semibold mb-4 text-center">Advanced Lead Management Tools</h3>
        <p className="text-muted-foreground text-center">
          This page will soon provide comprehensive details on lead profiling, real-time tracking, status management, custom fields, lead scoring, automated follow-ups, and integration with conversation tools.
        </p>
      </div>
    </div>
  );
} 