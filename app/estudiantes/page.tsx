"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DataTable } from "@/components/data-table"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function EstudiantesPage() {
  const [students, setStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      setIsLoading(true)
      const data = await api.getStudents()
      setStudents(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar estudiantes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const columns = [
    { header: "Código", accessor: "id" as const },
    { header: "Nombre", accessor: "first_names" as const },
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estudiantes</h1>
          <p className="text-muted-foreground mt-2">Lista de estudiantes registrados</p>
        </div>

        <DataTable
          data={students}
          columns={columns}
          searchPlaceholder="Buscar estudiantes..."
          onRowClick={(student) => router.push(`/estudiantes/${student.id}`)}
        />
      </div>
    </DashboardLayout>
  )
}
