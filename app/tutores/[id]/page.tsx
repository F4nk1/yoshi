"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { api } from "@/lib/api"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function TutorDetailPage() {
  const [tutor, setTutor] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  useEffect(() => {
    loadTutor()
  }, [params.id])

  const loadTutor = async () => {
    try {
      setIsLoading(true)
      const data = await api.getTutor(params.id as string)
      setTutor(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar tutor",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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

  if (!tutor) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Tutor no encontrado</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detalle de Tutor</h1>
            <p className="text-muted-foreground mt-2">Información del tutor</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{tutor.first_names}</CardTitle>
            <CardDescription>Código: {tutor.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(tutor).map(([key, value]) => {
                if (key === "id" || key === "first_names") return null
                return (
                  <div key={key}>
                    <p className="text-sm font-medium text-muted-foreground capitalize">{key.replace(/_/g, " ")}</p>
                    <p className="text-base">{String(value)}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
