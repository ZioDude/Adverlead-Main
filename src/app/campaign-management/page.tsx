import CampaignManagementSection from "@/components/CampaignManagementSection";

export default function CampaignManagementPage() {
  return (
    <div className="py-8">
      <CampaignManagementSection />
      {/* Additional content specific to campaign management can be added here */}
      <div className="container mx-auto px-4 mt-12">
        <h3 className="text-2xl font-semibold mb-4 text-center">In-Depth Campaign Tools</h3>
        <p className="text-muted-foreground text-center">
          This page will soon feature more details on campaign dashboards, creation flows (AI, templates, blank), editing tools (pause, resume, duplicate, delete), budget management, A/B testing, and performance analytics integration.
        </p>
      </div>
    </div>
  );
} 