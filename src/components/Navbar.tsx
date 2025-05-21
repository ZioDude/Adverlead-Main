'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Assuming Button component from shadcn/ui

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/how-it-works', label: 'How it Works' },
    { href: '/ad-generation', label: 'Ad Generation' },
    { href: '/campaign-management', label: 'Campaigns' },
    { href: '/lead-qualification', label: 'Leads' },
    { href: '/about-us', label: 'About Us' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-card text-card-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Adverlead
        </Link>
        <div className="hidden md:flex space-x-4 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-primary transition-colors ${
                pathname === item.href ? 'text-primary font-semibold' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
        {/* Mobile Menu Button (functionality to be added) */}
        <div className="md:hidden">
          <Button variant="outline">Menu</Button>
        </div>
      </div>
    </nav>
  );
} 