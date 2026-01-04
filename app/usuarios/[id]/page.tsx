"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { api } from "@/lib/api"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function UserDetailPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  useEffect(() => {
    loadUser()
  }, [params.id])

  const loadUser = async () => {
    try {
      setIsLoading(true)
      const data = await api.getUser(params.id as string)
      setUser(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar usuario",
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

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Usuario no encontrado</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Detalle de Usuario</h1>
            <p className="text-muted-foreground mt-2">Información del usuario</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{user.first_names}</CardTitle>
            <CardDescription>ID: {user.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rol</p>
                <p className="text-base">{user.role}</p>
              </div>
              {Object.entries(user).map(([key, value]) => {
                if (key === "id" || key === "first_names" || key === "role") return null
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
