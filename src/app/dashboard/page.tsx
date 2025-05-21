'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"; // Assuming this exists or we will create it
import { BarChart, Users, ListChecks, MessageCircleWarning, /*Settings,*/ PlusCircle } from "lucide-react"; // Commented out Settings

// Placeholder data - replace with actual data fetching and state management
const summaryMetrics = [
  { title: "Ad Spend", value: "$1,250", icon: <BarChart className="h-6 w-6 text-primary" />, trend: "+15%" },
  { title: "Total Leads", value: "320", icon: <Users className="h-6 w-6 text-primary" />, trend: "+8%" },
  { title: "Cost Per Lead", value: "$3.90", icon: <ListChecks className="h-6 w-6 text-primary" />, trend: "-5%" },
  { title: "Appointments", value: "45", icon: <MessageCircleWarning className="h-6 w-6 text-primary" />, trend: "+10%" },
];

const activeCampaigns = [
  { id: "camp1", name: "Summer Sale Promo", status: "Active", leads: 75, spend: "$400" },
  { id: "camp2", name: "New Product Launch Q3", status: "Active", leads: 120, spend: "$600" },
  { id: "camp3", name: "Lead Gen Webinar", status: "Paused", leads: 50, spend: "$250" },
];

export default function DashboardPage() {
  return (
    // Removed flex-1 and p-4/md:p-8/pt-6 from here as layout handles padding
    <div className="space-y-6 bg-background">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h2> {/* Changed title slightly */}
        <div className="flex items-center space-x-2">
          {/* <DatePickerWithRange className="hidden md:flex" /> Placeholder */}
          <Select defaultValue="last_30_days">
            <SelectTrigger className="w-[180px] bg-card border-border">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="last_7_days">Last 7 days</SelectItem>
              <SelectItem value="last_30_days">Last 30 days</SelectItem>
              <SelectItem value="last_90_days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Campaign
          </Button>
        </div>
      </div>

      {/* Performance Summary Widgets */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryMetrics.map((metric) => (
          <Card key={metric.title} className="bg-card border-border shadow-sm hover:shadow-primary/20 transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <p className={`text-xs ${metric.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {metric.trend} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Campaigns & Recent Leads (Example Structure) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Active Campaigns</CardTitle>
            <CardDescription className="text-muted-foreground">Overview of your currently running campaigns.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {/* Basic Table Structure - Replace with <Table> component later */}
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Leads</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Spend</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border/50">
                {activeCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground">{campaign.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {campaign.status}
                        </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{campaign.leads}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{campaign.spend}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Recent Leads</CardTitle>
            <CardDescription className="text-muted-foreground">A snapshot of recently captured leads.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground italic">Recent leads list will be displayed here.</p>
            {/* Placeholder for recent leads list */}
          </CardContent>
        </Card>
      </div>
      {/* Removed the Go to Settings button div from here */}
    </div>
  );
} 