"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Printer, Edit } from "lucide-react"
import { api } from "@/lib/api"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

export default function TutoriaDetailPage() {
  const [tutoria, setTutoria] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    loadTutoria()
  }, [params.id])

  const loadTutoria = async () => {
    try {
      setIsLoading(true)
      const data = await api.getTutoria(Number(params.id))
      setTutoria(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar tutoría",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrintCertificate = () => {
    router.push(`/tutorias/${params.id}/constancia`)
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

  if (!tutoria) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Tutoría no encontrada</p>
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

  const canEdit = user?.role === "ADMIN" || user?.role === "TUTOR"
  const canPrint = user?.role === "ADMIN" || user?.role === "TUTOR"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Detalle de Tutoría</h1>
              <p className="text-muted-foreground mt-2">Tutoría #{tutoria.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {canPrint && (
              <Button variant="outline" onClick={handlePrintCertificate}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir Constancia
              </Button>
            )}
            {canEdit && (
              <Button onClick={() => router.push(`/tutorias/${params.id}/editar`)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estudiante</p>
                <p className="text-base">{tutoria.student_code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tutor</p>
                <p className="text-base">{tutoria.tutor_code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Semestre</p>
                <p className="text-base">{tutoria.semester_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado</p>
                <Badge variant="secondary">{tutoria.status_id}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fecha y Hora</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fecha</p>
                <p className="text-base capitalize">{formatDate(tutoria.day)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Horario</p>
                <p className="text-base">
                  {tutoria.time_start} - {tutoria.time_end}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                <p className="text-base">{tutoria.type_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Modalidad</p>
                <p className="text-base">{tutoria.mode_id}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Sesión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tema</p>
              <p className="text-base">{tutoria.topic}</p>
            </div>
            {tutoria.observations && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Observaciones</p>
                <p className="text-base whitespace-pre-wrap">{tutoria.observations}</p>
              </div>
            )}
            {tutoria.references && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Referencias</p>
                <p className="text-base whitespace-pre-wrap">{tutoria.references}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Derivación Psicológica</p>
              <p className="text-base">{tutoria.psychological_derive ? "Sí" : "No"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
