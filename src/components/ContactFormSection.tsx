'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from "react";
import { Terminal, CheckCircle, AlertCircle } from "lucide-react";

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
    console.log(data);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    reset();
    setTimeout(() => setIsSubmitted(false), 7000);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 items-start">
          <div className="md:pr-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Get in Touch</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Have questions about Adverlead? Need help with our platform, or interested in a custom solution? Fill out the form, and we&apos;ll get back to you as soon as possible.
            </p>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong>Support:</strong> <a href="mailto:support@adverlead.com" className="text-accent hover:underline">support@adverlead.com</a>
              </p>
              <p>
                <strong>Sales:</strong> <a href="mailto:sales@adverlead.com" className="text-accent hover:underline">sales@adverlead.com</a>
              </p>
              <Alert className="mt-6 border-primary/30">
                <Terminal className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">Response Time</AlertTitle>
                <AlertDescription>
                  We typically respond to inquiries within 24 business hours.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <Card className="shadow-xl border-border bg-card">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
              <CardDescription>We value your feedback and inquiries.</CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted && (
                <Alert variant="default" className="mb-4 bg-green-500/10 border-green-500/50 text-green-400">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <AlertTitle className="font-semibold">Message Sent!</AlertTitle>
                  <AlertDescription>
                    Thank you for your message! We&apos;ll be in touch soon.
                  </AlertDescription>
                </Alert>
              )}
              {submitError && (
                 <Alert variant="destructive" className="mb-4">
                   <AlertCircle className="h-5 w-5" />
                   <AlertTitle className="font-semibold">Sending Failed</AlertTitle>
                   <AlertDescription>
                    {submitError}
                   </AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-muted-foreground">Full Name</Label>
                  <Input id="name" {...register("name")} placeholder="John Doe" className="mt-1 bg-input border-border focus:ring-primary" />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email" className="text-muted-foreground">Email Address</Label>
                  <Input id="email" type="email" {...register("email")} placeholder="you@example.com" className="mt-1 bg-input border-border focus:ring-primary" />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="subject" className="text-muted-foreground">Subject</Label>
                  <Input id="subject" {...register("subject")} placeholder="Regarding my account..." className="mt-1 bg-input border-border focus:ring-primary" />
                  {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>}
                </div>
                <div>
                  <Label htmlFor="message" className="text-muted-foreground">Message</Label>
                  <Textarea id="message" {...register("message")} placeholder="Your message here..." rows={5} className="mt-1 bg-input border-border focus:ring-primary" />
                  {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
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