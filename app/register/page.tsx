"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserPlus, GraduationCap, UserCheck, Shield } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Registro</CardTitle>
          <CardDescription>Seleccione el tipo de cuenta que desea crear</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/register/estudiante">
              <Button variant="outline" className="w-full h-auto p-6 flex flex-col items-center gap-3 bg-transparent">
                <GraduationCap className="h-12 w-12 text-primary" />
                <div>
                  <p className="font-semibold text-lg">Estudiante</p>
                  <p className="text-sm text-muted-foreground">Registro de nuevo estudiante</p>
                </div>
              </Button>
            </Link>

            <Link href="/register/tutor">
              <Button variant="outline" className="w-full h-auto p-6 flex flex-col items-center gap-3 bg-transparent">
                <UserCheck className="h-12 w-12 text-primary" />
                <div>
                  <p className="font-semibold text-lg">Tutor</p>
                  <p className="text-sm text-muted-foreground">Registro de nuevo tutor</p>
                </div>
              </Button>
            </Link>

            <Link href="/register/admin">
              <Button variant="outline" className="w-full h-auto p-6 flex flex-col items-center gap-3 bg-transparent">
                <Shield className="h-12 w-12 text-primary" />
                <div>
                  <p className="font-semibold text-lg">Administrador</p>
                  <p className="text-sm text-muted-foreground">Registro de administrador</p>
                </div>
              </Button>
            </Link>

            <Link href="/register/checker">
              <Button variant="outline" className="w-full h-auto p-6 flex flex-col items-center gap-3 bg-transparent">
                <UserPlus className="h-12 w-12 text-primary" />
                <div>
                  <p className="font-semibold text-lg">Verificador</p>
                  <p className="text-sm text-muted-foreground">Registro de verificador</p>
                </div>
              </Button>
            </Link>
          </div>

          <div className="text-center mt-6">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-primary underline">
              ¿Ya tiene una cuenta? Inicie sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
