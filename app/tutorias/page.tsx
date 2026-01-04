"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

export default function TutoriasPage() {
  const [tutorias, setTutorias] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    loadTutorias()
  }, [])

  const loadTutorias = async () => {
    try {
      setIsLoading(true)
      const data = await api.getTutorias()
      setTutorias(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar tutorías",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-PE", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const columns = [
    { header: "ID", accessor: "id" as const },
    {
      header: "Fecha",
      accessor: (row: any) => formatDate(row.day),
    },
    {
      header: "Hora",
      accessor: (row: any) => `${row.time_start} - ${row.time_end}`,
    },
    { header: "Estudiante", accessor: "student_code" as const },
    { header: "Tutor", accessor: "tutor_code" as const },
    { header: "Tema", accessor: "topic" as const, className: "max-w-xs truncate" },
    {
      header: "Estado",
      accessor: (row: any) => <Badge variant="secondary">{row.status_id}</Badge>,
    },
  ]

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </DashboardLayout>
    )
  }

  const canCreateTutoria = user?.role === "ADMIN" || user?.role === "TUTOR"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tutorías</h1>
            <p className="text-muted-foreground mt-2">Gestión de sesiones de tutoría</p>
          </div>
          {canCreateTutoria && (
            <Button onClick={() => router.push("/tutorias/nueva")}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Tutoría
            </Button>
          )}
        </div>

        <DataTable
          data={tutorias}
          columns={columns}
          searchPlaceholder="Buscar tutorías..."
          onRowClick={(tutoria) => router.push(`/tutorias/${tutoria.id}`)}
        />
      </div>
    </DashboardLayout>
  )
}
