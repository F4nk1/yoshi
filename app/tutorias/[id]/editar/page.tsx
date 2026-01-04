"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import { api } from "@/lib/api"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function EditTutoriaPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [formData, setFormData] = useState({
    student_code: "",
    tutor_code: "",
    semester_id: "",
    day: "",
    time_start: "",
    time_end: "",
    type_id: "",
    mode_id: "",
    status_id: "",
    topic: "",
    observations: "",
    references: "",
    psychological_derive: false,
  })

  useEffect(() => {
    loadTutoria()
  }, [params.id])

  const loadTutoria = async () => {
    try {
      setIsLoadingData(true)
      const data = await api.getTutoria(Number(params.id))
      setFormData({
        student_code: data.student_code || "",
        tutor_code: data.tutor_code || "",
        semester_id: data.semester_id || "",
        day: data.day?.split("T")[0] || "",
        time_start: data.time_start || "",
        time_end: data.time_end || "",
        type_id: data.type_id || "",
        mode_id: data.mode_id || "",
        status_id: data.status_id || "",
        topic: data.topic || "",
        observations: data.observations || "",
        references: data.references || "",
        psychological_derive: data.psychological_derive || false,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar tutoría",
        variant: "destructive",
      })
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await api.updateTutoria(Number(params.id), formData)
      toast({
        title: "Éxito",
        description: "Tutoría actualizada correctamente",
      })
      router.push(`/tutorias/${params.id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar tutoría",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Tutoría</h1>
            <p className="text-muted-foreground mt-2">Modificar los datos de la sesión</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Tutoría</CardTitle>
            <CardDescription>Actualice los datos necesarios</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="student_code">Código de Estudiante *</Label>
                  <Input
                    id="student_code"
                    name="student_code"
                    value={formData.student_code}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tutor_code">Código de Tutor *</Label>
                  <Input
                    id="tutor_code"
                    name="tutor_code"
                    value={formData.tutor_code}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester_id">ID de Semestre *</Label>
                  <Input
                    id="semester_id"
                    name="semester_id"
                    value={formData.semester_id}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="day">Fecha *</Label>
                  <Input id="day" name="day" type="date" value={formData.day} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time_start">Hora de Inicio *</Label>
                  <Input
                    id="time_start"
                    name="time_start"
                    type="time"
                    value={formData.time_start}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time_end">Hora de Fin *</Label>
                  <Input
                    id="time_end"
                    name="time_end"
                    type="time"
                    value={formData.time_end}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type_id">Tipo de Tutoría *</Label>
                  <Input id="type_id" name="type_id" value={formData.type_id} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mode_id">Modalidad *</Label>
                  <Input id="mode_id" name="mode_id" value={formData.mode_id} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status_id">Estado *</Label>
                  <Input id="status_id" name="status_id" value={formData.status_id} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Tema *</Label>
                <Input id="topic" name="topic" value={formData.topic} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observaciones</Label>
                <Textarea
                  id="observations"
                  name="observations"
                  value={formData.observations}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="references">Referencias</Label>
                <Textarea
                  id="references"
                  name="references"
                  value={formData.references}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="psychological_derive"
                  checked={formData.psychological_derive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, psychological_derive: checked === true }))
                  }
                />
                <Label htmlFor="psychological_derive" className="font-normal cursor-pointer">
                  Derivación psicológica
                </Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
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
