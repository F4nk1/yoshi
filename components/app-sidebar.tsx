"use client"

import type React from "react"
import Image from "next/image" // added Image import

import { useAuth } from "@/lib/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  Home,
  Users,
  GraduationCap,
  UserCheck,
  BookOpen,
  Calendar,
  FileText,
  LogOut,
  UserCircle,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { UserRole } from "@/lib/types"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
}

const navItems: NavItem[] = [
  {
    title: "Inicio",
    href: "/dashboard",
    icon: Home,
    roles: ["ADMIN", "TUTOR", "CHECKER", "STUDENT"],
  },
  {
    title: "Usuarios",
    href: "/usuarios",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    title: "Estudiantes",
    href: "/estudiantes",
    icon: GraduationCap,
    roles: ["ADMIN", "TUTOR", "CHECKER"],
  },
  {
    title: "Tutores",
    href: "/tutores",
    icon: UserCheck,
    roles: ["ADMIN", "CHECKER"],
  },
  {
    title: "Tutorías",
    href: "/tutorias",
    icon: BookOpen,
    roles: ["ADMIN", "TUTOR", "CHECKER", "STUDENT"],
  },
  {
    title: "Cronogramas",
    href: "/cronograma",
    icon: Calendar,
    roles: ["ADMIN"],
  },
  {
    title: "Reportes",
    href: "/reportes",
    icon: FileText,
    roles: ["ADMIN", "CHECKER"],
  },
]

export function AppSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const visibleItems = navItems.filter((item) => user && item.roles.includes(user.role))

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white p-1 shadow-sm border border-sidebar-border">
            <Image src="/logo-unsaac.png" alt="Logo UNSAAC" width={48} height={48} className="object-contain" />
          </div>
          <div>
            <h2 className="text-lg font-bold leading-tight">Sistema de</h2>
            <h2 className="text-lg font-bold leading-tight text-primary">Tutorías</h2>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 px-3 py-2">Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} className="gap-3 py-2.5">
                      <Link href={item.href}>
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="space-y-2">
          <Link
            href="/perfil"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-sidebar-accent transition-colors"
          >
            <UserCircle className="h-5 w-5 text-sidebar-foreground" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate text-sidebar-foreground">{user?.first_names}</p>
              <p className="text-xs text-sidebar-foreground/70">{user?.role}</p>
            </div>
            <Settings className="h-4 w-4 text-sidebar-foreground/50" />
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
