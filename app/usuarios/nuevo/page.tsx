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
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function NewUsuarioPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    first_names: "",
    paternal_surname: "",
    maternal_surname: "",
    email: "",
    password: "",
    phone_number: "",
    role: "",

    code: "",
    specialty: "",
  })


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
    setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
    }))
  }

  const roleMap: Record<string, string> = {
    STUDENT: "estudiante",
    TUTOR: "tutor",
    ADMIN: "administrador",
    CHECKER: "verificador",
    }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
        const userId = crypto.randomUUID()

        const user = {
        id: userId,
        first_names: formData.first_names,
        paternal_surname: formData.paternal_surname,
        maternal_surname: formData.maternal_surname,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number,
        role_id: roleMap[formData.role],
        active: true,
        }
        
        if (formData.role === "STUDENT") {
        await api.registerStudent({
            user,
            student: {
            student_code: formData.code,
            user_id: userId,
            },
        })
        }

        if (formData.role === "TUTOR") {
        await api.registerTutor({
            user,
            tutor: {
            tutor_code: formData.code,
            specialty: formData.specialty,
            user_id: userId,
            },
        })
        }

        if (formData.role === "ADMIN") {
        await api.registerAdmin({
            user,
            admin: {
            admin_code: formData.code,
            user_id: userId,
            },
        })
        }

        if (formData.role === "CHECKER") {
        await api.registerChecker({
            user,
            checker: {
            checker_code: formData.code,
            user_id: userId,
            },
        })
        }


        toast({
        title: "Éxito",
        description: "Usuario creado correctamente",
        })

        router.push("/usuarios")
    } catch (err: any) {
        toast({
        title: "Error",
        description: err.message || "Error al crear usuario",
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
            <h1 className="text-3xl font-bold tracking-tight">Nuevo Usuario</h1>
            <p className="text-muted-foreground mt-2">
              Crear un nuevo usuario del sistema
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Usuario</CardTitle>
            <CardDescription>
              Complete los datos del usuario
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first_names">Nombres *</Label>
                  <Input
                    id="first_names"
                    name="first_names"
                    value={formData.first_names}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                    <Label>Apellido Paterno *</Label>
                    <Input
                        name="paternal_surname"
                        value={formData.paternal_surname}
                        onChange={handleChange}
                        required
                    />
                    </div>

                    <div className="space-y-2">
                    <Label>Apellido Materno *</Label>
                    <Input
                        name="maternal_surname"
                        value={formData.maternal_surname}
                        onChange={handleChange}
                        required
                    />
                </div>


                <div className="space-y-2">
                  <Label htmlFor="email">Correo *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                    <Label>Contraseña *</Label>
                    <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    </div>

                    <div className="space-y-2">
                    <Label>Teléfono *</Label>
                    <Input
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        required
                    />
                </div>


                <div className="space-y-2">
                    <Label htmlFor="role">Rol *</Label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                        <option value="">Selecciona un rol</option>
                        <option value="ADMIN">Administrador</option>
                        <option value="STUDENT">Estudiante</option>
                        <option value="TUTOR">Tutor</option>
                        <option value="CHECKER">Verificador</option>
                    </select>

                </div>
                </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Guardando..." : "Guardar Usuario"}
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
