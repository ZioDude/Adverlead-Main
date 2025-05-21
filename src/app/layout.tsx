// This is the NEW src/app/layout.tsx (minimal root layout)
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Keep global styles here

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata can stay here or move to group layouts if specific titles are needed per group
export const metadata: Metadata = {
  title: "Adverlead", // More general title for the whole app
  description: "Manage and optimize Meta (Facebook/Instagram) lead generation campaigns with Adverlead.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children} {/* Children will be either (marketing) layout or dashboard layout */}
      </body>
    </html>
  );
}
