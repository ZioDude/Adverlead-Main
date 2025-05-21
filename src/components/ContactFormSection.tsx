'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from "react";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormInputs = z.infer<typeof contactFormSchema>;

export default function ContactFormSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    setIsSubmitted(false);
    setSubmitError(null);
    // Here you would typically send the data to your backend API
    // For demonstration, we'll just simulate a delay and success/error
    console.log(data);
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    // Simulate a random error for demonstration
    // if (Math.random() > 0.5) {
    //   setSubmitError("An unexpected error occurred. Please try again.");
    //   return;
    // }

    setIsSubmitted(true);
    reset(); 
    setTimeout(() => setIsSubmitted(false), 5000); // Hide success message after 5s
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="md:pr-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Have questions about Adverlead? Need help with our platform, or interested in a custom solution? Fill out the form, and we'll get back to you as soon as possible.
            </p>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                <strong>Support:</strong> <a href="mailto:support@adverlead.com" className="text-primary hover:underline">support@adverlead.com</a>
              </p>
              <p className="text-muted-foreground">
                <strong>Sales:</strong> <a href="mailto:sales@adverlead.com" className="text-primary hover:underline">sales@adverlead.com</a>
              </p>
              {/* Add address or phone if applicable */}
            </div>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>We typically respond within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted && (
                <div className="mb-4 p-3 rounded-md bg-green-100 text-green-700 border border-green-200">
                  Thank you for your message! We'll be in touch soon.
                </div>
              )}
              {submitError && (
                 <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200">
                  {submitError}
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" {...register("name")} placeholder="John Doe" className="mt-1" />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" {...register("email")} placeholder="you@example.com" className="mt-1" />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" {...register("subject")} placeholder="Regarding my account..." className="mt-1" />
                  {errors.subject && <p className="text-sm text-red-500 mt-1">{errors.subject.message}</p>}
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" {...register("message")} placeholder="Your message here..." rows={5} className="mt-1" />
                  {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
} 