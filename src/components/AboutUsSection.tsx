'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Rocket, Lightbulb } from 'lucide-react';

export default function AboutUsSection() {
  return (
    <section id="about-us" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">About Adverlead</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            We are passionate about helping businesses succeed with Meta advertising.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-primary"><Lightbulb className="inline-block w-7 h-7 mr-2" /> Our Mission</h3>
            <p className="text-muted-foreground mb-6 text-lg">
              To empower businesses of all sizes to maximize their lead generation potential on Meta platforms through an intuitive, powerful, and unified advertising solution. We aim to simplify complexity and drive measurable results.
            </p>
            <h3 className="text-2xl font-semibold mb-4 text-primary"><Rocket className="inline-block w-7 h-7 mr-2" /> Our Vision</h3>
            <p className="text-muted-foreground text-lg">
              To be the leading platform for Meta lead generation, renowned for innovation, user-centric design, and commitment to customer success. We envision a world where every business can effortlessly connect with their ideal customers.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {/* Placeholder for team images or company values */} 
            <div className="bg-card p-6 rounded-lg shadow-md text-center aspect-square flex flex-col justify-center items-center">
                <Users className="w-12 h-12 text-primary mb-3" />
                <h4 className="font-semibold text-lg">Expert Team</h4>
                <p className="text-sm text-muted-foreground">Dedicated professionals</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md text-center aspect-square flex flex-col justify-center items-center">
                <Lightbulb className="w-12 h-12 text-primary mb-3" />
                <h4 className="font-semibold text-lg">Innovation Focus</h4>
                <p className="text-sm text-muted-foreground">Cutting-edge solutions</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md text-center aspect-square flex flex-col justify-center items-center">
                <Rocket className="w-12 h-12 text-primary mb-3" />
                <h4 className="font-semibold text-lg">Customer Success</h4>
                <p className="text-sm text-muted-foreground">Your growth is our priority</p>
            </div>
             <div className="bg-card p-6 rounded-lg shadow-md text-center aspect-square flex flex-col justify-center items-center">
                <Avatar className="w-12 h-12 mb-3">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h4 className="font-semibold text-lg">You!</h4>
                <p className="text-sm text-muted-foreground">Our valued partner</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 