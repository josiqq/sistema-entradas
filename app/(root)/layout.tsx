// app/(root)/layout.tsx
import type React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "@/components/protected-route";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SystemProvider } from "@/contexts/system-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SystemProvider>
      <ProtectedRoute>
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 overflow-hidden">
            <SidebarInset>{children}</SidebarInset>
          </div>
          <Toaster />
        </SidebarProvider>
      </ProtectedRoute>
    </SystemProvider>
  );
}
