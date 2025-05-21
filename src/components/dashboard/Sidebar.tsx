'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, /*Megaphone,*/ Facebook, Users, Settings, LogOut, HomeIcon, Zap } from "lucide-react"; // Commented out Megaphone

// Define navigation items for the dashboard sidebar
const dashboardNavItems = [
  { href: "/dashboard", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/", label: "Homepage", icon: <HomeIcon className="h-5 w-5" /> },
  { href: "/dashboard/generate-ads", label: "Generate Ads", icon: <Zap className="h-5 w-5" /> },
  { href: "/dashboard/campaigns", label: "Facebook", icon: <Facebook className="h-5 w-5" /> }, // Assuming Facebook maps to Campaigns
  { href: "/dashboard/leads", label: "Leads", icon: <Users className="h-5 w-5" /> },
];

const secondaryNavItems = [
    { href: "/dashboard/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-sidebar/80 backdrop-blur-md border-r border-sidebar-border flex flex-col">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <Link href="/dashboard" className="flex items-center ps-2.5 mb-8">
          <span className="self-center text-2xl font-bold whitespace-nowrap text-primary">
            Adverlead
          </span>
        </Link>
        <nav className="space-y-2 flex-grow">
          {dashboardNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group",
                pathname === item.href ? "bg-sidebar-primary text-sidebar-primary-foreground" : ""
              )}
            >
              {item.icon}
              <span className="ms-3">{item.label}</span>
            </Link>
          ))}
        </nav>
        {/* Secondary navigation like Settings and Logout at the bottom */}
        <div className="mt-auto space-y-2 pt-4 border-t border-sidebar-border">
            {secondaryNavItems.map((item) => (
                 <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                        "flex items-center p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group",
                        pathname === item.href ? "bg-sidebar-primary text-sidebar-primary-foreground" : ""
                    )}
                    >
                    {item.icon}
                    <span className="ms-3">{item.label}</span>
                </Link>
            ))}
            <Link
                href="/api/auth/logout" // Example logout path
                className="flex items-center p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
            >
                <LogOut className="h-5 w-5" />
                <span className="ms-3">Logout</span>
            </Link>
        </div>
      </div>
    </aside>
  );
} 