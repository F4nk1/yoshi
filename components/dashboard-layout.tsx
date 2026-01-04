"use client"

import type React from "react"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { AuthGuard } from "./auth-guard"
import { Bell } from "lucide-react"
import { Button } from "./ui/button"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1">
            <div className="border-b bg-card shadow-sm">
              <div className="flex h-16 items-center justify-between gap-4 px-6">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="-ml-2" />
                  <div className="hidden md:block">
                    <h2 className="text-lg font-semibold text-foreground">Sistema de Información para Tutorías</h2>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="mx-auto max-w-7xl p-6 md:p-8">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}
