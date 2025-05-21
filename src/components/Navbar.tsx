'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/how-it-works', label: 'How it Works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about-us', label: 'About Us' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <nav className="bg-card text-card-foreground p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Adverlead
        </Link>

        <div className="hidden md:flex space-x-2 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium ${
                pathname === item.href
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Button variant="ghost" asChild className={`hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/dashboard'
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:text-primary'
              }`}>
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary/10 hover:text-primary ml-2">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-card border-l-border">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-2xl text-primary">Adverlead</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent/10 hover:text-primary'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                    <Link
                      href="/dashboard"
                      onClick={handleLinkClick}
                      className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        pathname === '/dashboard'
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent/10 hover:text-primary'
                      }`}
                    >
                      <LayoutDashboard className="mr-2 h-5 w-5" /> Dashboard
                    </Link>
                </SheetClose>
                <hr className="my-4 border-border" />
                <SheetClose asChild>
                    <Button variant="outline" asChild className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary">
                        <Link href="/login" onClick={handleLinkClick}>Login</Link>
                    </Button>
                </SheetClose>
                <SheetClose asChild>
                    <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href="/signup" onClick={handleLinkClick}>Sign Up</Link>
                    </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
} 