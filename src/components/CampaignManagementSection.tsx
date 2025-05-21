'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SlidersHorizontal, Target, BarChart3, PlayCircle, Edit3, Copy, Trash2 } from 'lucide-react';
import Link from "next/link";

const features = [
  {
    title: "Intuitive Campaign Dashboard",
    description: "Get a bird's-eye view of all your campaigns. Monitor performance, status, and budget allocation at a glance.",
    icon: <BarChart3 className="w-8 h-8 text-primary" />
  },
  {
    title: "Flexible Campaign Creation",
    description: "Launch campaigns using AI suggestions, existing templates, or build from scratch with granular control over targeting and placements.",
    icon: <SlidersHorizontal className="w-8 h-8 text-primary" />
  },
  {
    title: "Advanced Targeting Options",
    description: "Define and reach your ideal audience with precision using Meta's powerful targeting capabilities, managed seamlessly.",
    icon: <Target className="w-8 h-8 text-primary" />
  },
  {
    title: "Easy Management Tools",
    description: "Quickly edit, pause, resume, duplicate, or delete campaigns. Bulk actions save you valuable time.",
    icon: <Edit3 className="w-8 h-8 text-primary" /> // Combined Edit3, PlayCircle, Copy, Trash2 conceptually
  },
];

export default function CampaignManagementSection() {
  return (
    <section id="campaign-management" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Total Control Over Your Meta Campaigns</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            From creation to optimization, Adverlead simplifies every step of managing your Facebook and Instagram ad campaigns.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300 flex flex-col">
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
            <Link href="/campaign-management">Master Your Campaigns</Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 