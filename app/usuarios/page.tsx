"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function UsuariosPage() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const data = await api.getUsers()
      setUsers(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar usuarios",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const columns = [
    { header: "ID", accessor: "id" as const },
    { header: "Nombre", accessor: "first_names" as const },
    { header: "Rol", accessor: "role" as const },
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
            <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
            <p className="text-muted-foreground mt-2">Gestión de usuarios del sistema</p>
          </div>
          <Button onClick={() => router.push("/usuarios/nuevo")}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>

        <DataTable
          data={users}
          columns={columns}
          searchPlaceholder="Buscar usuarios..."
          onRowClick={(user) => router.push(`/usuarios/${user.id}`)}
        />
      </div>
    </DashboardLayout>
  )
}
