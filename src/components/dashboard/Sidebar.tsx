'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, /*Megaphone,*/ Facebook, Users, Settings, LogOut, HomeIcon, Zap, ImageIcon } from "lucide-react"; // Commented out Megaphone, Added ImageIcon
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Define navigation items for the dashboard sidebar
const dashboardNavItems = [
  { href: "/dashboard", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/", label: "Homepage", icon: <HomeIcon className="h-5 w-5" /> },
  { href: "/dashboard/generate-ads", label: "Generate Ads", icon: <Zap className="h-5 w-5" /> },
  { href: "/dashboard/image-editor", label: "Image Editor", icon: <ImageIcon className="h-5 w-5" /> },
  { href: "/dashboard/campaigns", label: "Facebook", icon: <Facebook className="h-5 w-5" /> }, // Assuming Facebook maps to Campaigns
  { href: "/dashboard/leads", label: "Leads", icon: <Users className="h-5 w-5" /> },
];

const secondaryNavItems = [
    { href: "/dashboard/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _supabase = createClientComponentClient();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        router.push('/');
        router.refresh();
      } else {
        console.error('Logout failed:', await response.text());
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-black flex flex-col shadow-xl shadow-purple-900/50">
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
                "flex items-center py-2 px-3 rounded-lg hover:bg-neutral-700 hover:text-white group text-sm font-medium",
                pathname === item.href ? "bg-neutral-900 text-purple-400 font-semibold border-l-4 border-purple-500" : "text-neutral-400"
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
                        "flex items-center py-2 px-3 rounded-lg hover:bg-neutral-700 hover:text-white group text-sm font-medium",
                        pathname === item.href ? "bg-neutral-900 text-purple-400 font-semibold border-l-4 border-purple-500" : "text-neutral-400"
                    )}
                    >
                    {item.icon}
                    <span className="ms-3">{item.label}</span>
                </Link>
            ))}
            <button
                onClick={handleLogout}
                className="flex items-center py-2 px-3 rounded-lg text-neutral-400 hover:bg-neutral-700 hover:text-white group w-full text-sm font-medium"
            >
                <LogOut className="h-5 w-5" />
                <span className="ms-3">Logout</span>
            </button>
        </div>
      </div>
    </aside>
  );
}
