"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { api } from "@/lib/api"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AsignarEstudiantesPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    tutor_code: "",
    student_code: "",
    day_start: "",
    day_end: "",
    status_id: "ACTIVO",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await api.asignarEstudiantes(Number(params.id), formData)
      toast({
        title: "Éxito",
        description: "Estudiante asignado correctamente",
      })
      router.push(`/cronograma/${params.id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al asignar estudiante",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Asignar Estudiantes</h1>
            <p className="text-muted-foreground mt-2">Asignar estudiantes a tutores para este cronograma</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información de Asignación</CardTitle>
            <CardDescription>Complete los datos de la asignación</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tutor_code">Código de Tutor *</Label>
                  <Input
                    id="tutor_code"
                    name="tutor_code"
                    value={formData.tutor_code}
                    onChange={handleChange}
                    placeholder="Código del tutor"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student_code">Código de Estudiante *</Label>
                  <Input
                    id="student_code"
                    name="student_code"
                    value={formData.student_code}
                    onChange={handleChange}
                    placeholder="Código del estudiante"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="day_start">Fecha de Inicio *</Label>
                  <Input
                    id="day_start"
                    name="day_start"
                    type="date"
                    value={formData.day_start}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="day_end">Fecha de Fin *</Label>
                  <Input
                    id="day_end"
                    name="day_end"
                    type="date"
                    value={formData.day_end}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status_id">Estado *</Label>
                  <Input id="status_id" name="status_id" value={formData.status_id} onChange={handleChange} required />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Asignando..." : "Asignar Estudiante"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
