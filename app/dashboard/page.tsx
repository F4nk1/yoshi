"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, BookOpen, Calendar } from "lucide-react"

function DashboardStats() {
  const { user } = useAuth()

  const [statsData, setStatsData] = useState<{
    users?: number
    students?: number
    tutors?: number
    tutorias?: number
    cronogramas?: number
  }>({})

  const fetchStats = async () => {
    try {
      const [
        users,
        students,
        tutors,
        tutorias,
        cronogramas,
      ] = await Promise.all([
        api.getUsers(),
        api.getStudents(),
        api.getTutors(),
        api.getTutorias(),
        api.getCronogramas(),
      ])

      setStatsData({
        users: users.length,
        students: students.length,
        tutors: tutors.length,
        tutorias: tutorias.length,
        cronogramas: cronogramas.length,
      })
    } catch (error) {
      console.error("Error cargando estadísticas", error)
    }
  }
  useEffect(() => {
    fetchStats()

    const interval = setInterval(fetchStats, 30000) // refresco cada 30s
    return () => clearInterval(interval)
  }, [])



  const getStatsForRole = () => {
    switch (user?.role) {
      case "ADMIN":
        return [
          {
            title: "Total Usuarios",
            value: statsData.users ?? "—",
            description: "Usuarios activos en el sistema",
            icon: Users,
          },
          {
            title: "Estudiantes",
            value: statsData.students ?? "—",
            description: "Estudiantes registrados",
            icon: GraduationCap,
          },
          {
            title: "Tutorías",
            value: statsData.tutorias ?? "—",
            description: "Sesiones registradas",
            icon: BookOpen,
          },
          {
            title: "Cronogramas",
            value: statsData.cronogramas ?? "—",
            description: "Cronogramas activos",
            icon: Calendar,
          },
        ]

      case "TUTOR":
        return [
          {
            title: "Tutorías",
            value: statsData.tutorias ?? "—",
            description: "Sesiones asignadas",
            icon: BookOpen,
          },
          {
            title: "Estudiantes",
            value: statsData.students ?? "—",
            description: "Estudiantes registrados",
            icon: GraduationCap,
          },
        ]

      case "STUDENT":
        return [
          {
            title: "Tutorías",
            value: statsData.tutorias ?? "—",
            description: "Sesiones disponibles",
            icon: BookOpen,
          },
        ]

      default:
        return []
    }
  }


  const stats = getStatsForRole()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Bienvenido, {user?.first_names}</h1>
        <p className="text-muted-foreground mt-2 text-lg">Panel de control del sistema de tutorías</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className="rounded-full bg-primary/10 p-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-sm text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="shadow-md">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-xl">Acceso Rápido</CardTitle>
          <CardDescription>Acciones comunes para tu rol</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {user?.role === "ADMIN" && (
              <>
                <a
                  href="/usuarios"
                  className="group flex items-center gap-4 rounded-xl border-2 border-border bg-card p-5 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">Gestionar Usuarios</p>
                    <p className="text-sm text-muted-foreground">Crear y editar usuarios</p>
                  </div>
                </a>
                <a
                  href="/cronograma"
                  className="group flex items-center gap-4 rounded-xl border-2 border-border bg-card p-5 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">Cronogramas</p>
                    <p className="text-sm text-muted-foreground">Gestionar cronogramas</p>
                  </div>
                </a>
              </>
            )}
            {user?.role === "TUTOR" && (
              <>
                <a
                  href="/tutorias"
                  className="group flex items-center gap-4 rounded-xl border-2 border-border bg-card p-5 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">Mis Tutorías</p>
                    <p className="text-sm text-muted-foreground">Ver y crear tutorías</p>
                  </div>
                </a>
                <a
                  href="/estudiantes"
                  className="group flex items-center gap-4 rounded-xl border-2 border-border bg-card p-5 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">Mis Estudiantes</p>
                    <p className="text-sm text-muted-foreground">Ver estudiantes asignados</p>
                  </div>
                </a>
              </>
            )}
            {user?.role === "CHECKER" && (
              <>
                <a
                  href="/reportes"
                  className="group flex items-center gap-4 rounded-xl border-2 border-border bg-card p-5 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">Reportes</p>
                    <p className="text-sm text-muted-foreground">Consultar reportes</p>
                  </div>
                </a>
                <a
                  href="/tutorias"
                  className="group flex items-center gap-4 rounded-xl border-2 border-border bg-card p-5 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">Tutorías</p>
                    <p className="text-sm text-muted-foreground">Ver tutorías</p>
                  </div>
                </a>
              </>
            )}
            {user?.role === "STUDENT" && (
              <a
                href="/tutorias"
                className="group flex items-center gap-4 rounded-xl border-2 border-border bg-card p-5 hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-base">Mis Tutorías</p>
                  <p className="text-sm text-muted-foreground">Ver mi historial</p>
                </div>
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardStats />
    </DashboardLayout>
  )
}
