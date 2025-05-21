'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, CheckSquare, Filter } from 'lucide-react';
import Link from "next/link";

const features = [
  {
    title: "Centralized Lead Profiles",
    description: "View comprehensive lead profiles with all contact information, interaction history, and campaign source in one place.",
    icon: <Users className="w-8 h-8 text-primary" />
  },
  {
    title: "Real-time Lead Tracking",
    description: "Capture and display new leads instantly as they come in from your Meta campaigns. Never miss an opportunity.",
    icon: <Filter className="w-8 h-8 text-primary" />
  },
  {
    title: "Lead Status & Management",
    description: "Assign statuses (e.g., New, Contacted, Qualified, Converted) and manage leads through your sales pipeline efficiently.",
    icon: <CheckSquare className="w-8 h-8 text-primary" />
  },
  {
    title: "Integrated Conversations",
    description: "Track and manage conversations with leads, including chatbot interactions and direct messages, all linked to their profile.",
    icon: <MessageSquare className="w-8 h-8 text-primary" />
  },
];

export default function LeadQualificationSection() {
  return (
    <section id="lead-qualification" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Qualify and Convert Leads Faster</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Adverlead's CRM features help you effectively track, manage, and engage with every lead generated from your campaigns.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
              <CardHeader className="items-center text-center md:items-start md:text-left">
                <div className="bg-primary/10 p-3 rounded-full inline-block mb-3">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/lead-qualification">Explore Lead Management</Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 