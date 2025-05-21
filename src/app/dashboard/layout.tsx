import Sidebar from "@/components/dashboard/Sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto sm:ml-64">
        {/* We can add a simple header here later if needed, e.g., for user profile, notifications */}
        {children}
      </main>
    </div>
  );
} 