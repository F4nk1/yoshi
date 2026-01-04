"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DataTable } from "@/components/data-table"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function TutoresPage() {
  const [tutors, setTutors] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadTutors()
  }, [])

  const loadTutors = async () => {
    try {
      setIsLoading(true)
      const data = await api.getTutors()
      setTutors(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar tutores",
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
          <h1 className="text-3xl font-bold tracking-tight">Tutores</h1>
          <p className="text-muted-foreground mt-2">Lista de tutores registrados</p>
        </div>

        <DataTable
          data={tutors}
          columns={columns}
          searchPlaceholder="Buscar tutores..."
          onRowClick={(tutor) => router.push(`/tutores/${tutor.id}`)}
        />
      </div>
    </DashboardLayout>
  )
}
