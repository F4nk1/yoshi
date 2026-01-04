"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, UserPlus, Users } from "lucide-react"
import { api } from "@/lib/api"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function CronogramaDetailPage() {
  const [cronograma, setCronograma] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  useEffect(() => {
    loadCronograma()
  }, [params.id])

  const loadCronograma = async () => {
    try {
      setIsLoading(true)
      const data = await api.getCronograma(Number(params.id))
      setCronograma(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar cronograma",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseAssignments = async () => {
    try {
      await api.cerrarAsignacion(Number(params.id))
      toast({
        title: "Éxito",
        description: "Asignaciones cerradas correctamente",
      })
      loadCronograma()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cerrar asignaciones",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </DashboardLayout>
    )
  }

  if (!cronograma) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Cronograma no encontrado</p>
        </div>
      </DashboardLayout>
    )
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-PE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Detalle de Cronograma</h1>
              <p className="text-muted-foreground mt-2">Cronograma #{cronograma.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push(`/cronograma/${params.id}/editar`)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Cronograma</CardTitle>
            <CardDescription>Detalles del período de tutorías</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Semestre</p>
                <p className="text-base font-semibold">{cronograma.semester_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado</p>
                <Badge variant={cronograma.status === "ACTIVO" ? "default" : "secondary"}>{cronograma.status}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fecha de Inicio</p>
                <p className="text-base capitalize">{formatDate(cronograma.start_date)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fecha de Fin</p>
                <p className="text-base capitalize">{formatDate(cronograma.end_date)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asignaciones</CardTitle>
            <CardDescription>Gestión de asignaciones de estudiantes a tutores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  onClick={() => router.push(`/cronograma/${params.id}/asignar-estudiantes`)}
                  variant="outline"
                  className="h-auto p-6"
                >
                  <div className="flex items-center gap-3 w-full">
                    <UserPlus className="h-8 w-8 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Asignar Estudiantes</p>
                      <p className="text-sm text-muted-foreground">Asignar estudiantes a tutores</p>
                    </div>
                  </div>
                </Button>
                <Button
                  onClick={() => router.push(`/cronograma/${params.id}/reasignar`)}
                  variant="outline"
                  className="h-auto p-6"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Users className="h-8 w-8 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Reasignar Estudiante</p>
                      <p className="text-sm text-muted-foreground">Cambiar asignación de un estudiante</p>
                    </div>
                  </div>
                </Button>
              </div>
              <Button onClick={handleCloseAssignments} variant="destructive" className="w-full">
                Cerrar Asignación
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
