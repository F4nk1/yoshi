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

export default function CronogramaPage() {
  const [cronogramas, setCronogramas] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadCronogramas()
  }, [])

  const loadCronogramas = async () => {
    try {
      setIsLoading(true)
      const data = await api.getCronogramas()
      setCronogramas(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar cronogramas",
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
    { header: "Semestre", accessor: "semester_id" as const },
    {
      header: "Fecha Inicio",
      accessor: (row: any) => formatDate(row.start_date),
    },
    {
      header: "Fecha Fin",
      accessor: (row: any) => formatDate(row.end_date),
    },
    {
      header: "Estado",
      accessor: (row: any) => {
        const variant = row.status === "ACTIVO" ? "default" : "secondary"
        return <Badge variant={variant}>{row.status}</Badge>
      },
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cronogramas</h1>
            <p className="text-muted-foreground mt-2">Gestión de cronogramas de tutorías</p>
          </div>
          <Button onClick={() => router.push("/cronograma/nuevo")}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cronograma
          </Button>
        </div>

        <DataTable
          data={cronogramas}
          columns={columns}
          searchPlaceholder="Buscar cronogramas..."
          onRowClick={(cronograma) => router.push(`/cronograma/${cronograma.id}`)}
        />
      </div>
    </DashboardLayout>
  )
}
