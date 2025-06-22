"use client";

import type * as React from "react";
import {
  BarChart3,
  Calendar,
  QrCode,
  Ticket,
  Users,
  Settings,
  Home,
  FileText,
  Shield,
  Tickets,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { UserMenu } from "./user-menu";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { hasPermission, isAdmin } = useAuth();

  const navMain = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      permission: "dashboard.view",
    },
    {
      title: "Eventos",
      url: "/events",
      icon: Calendar,
      permission: "events.view",
    },
    {
      title: "Entradas",
      url: "/tickets",
      icon: Ticket,
      permission: "tickets.view",
    },
    {
      title: "Validación",
      url: "/validation",
      icon: QrCode,
      permission: "tickets.validate",
    },
    {
      title: "Estadísticas",
      url: "/analytics",
      icon: BarChart3,
      permission: "stats.view",
    },
    {
      title: "Reportes",
      url: "/reports",
      icon: FileText,
      permission: "reports.view",
    },
  ];

  const navSecondary = [
    {
      title: "Usuarios",
      url: "/users",
      icon: Users,
      adminOnly: true,
    },
    {
      title: "Seguridad",
      url: "/security",
      icon: Shield,
      permission: "security.view",
    },
    {
      title: "Configuración",
      url: "/settings",
      icon: Settings,
      adminOnly: true,
    },
    {
      title: "Diseño de Entradas",
      url: "/ticket-designer",
      icon: Tickets,
      adminOnly: true,
    }
  ];

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Ticket className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    EventManager Pro
                  </span>
                  <span className="truncate text-xs">Sistema de Entradas</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestión Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          {isAdmin() && (
            <SidebarGroupLabel>Administración</SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {navSecondary
                .filter((item) => {
                  if (item.adminOnly) return isAdmin();
                  return !item.permission || hasPermission(item.permission);
                })
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <UserMenu />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
