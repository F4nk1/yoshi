"use client"

import type React from "react"
import Image from "next/image" // added Image import

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Loader2 } from "lucide-react" // removed BookOpen

export default function LoginPage() {
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(userId, password)
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4">
      <Card className="w-full max-w-md shadow-xl border-2">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white p-1 shadow-md border-2 border-primary/20">
            <Image
              src="/logo-unsaac.png"
              alt="Logo UNSAAC"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <CardTitle className="text-3xl font-bold">Sistema de Tutorías</CardTitle>
          <CardDescription className="text-base text-primary font-medium">UNSAAC</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-sm font-medium">
                ID de Usuario
              </Label>
              <Input
                id="userId"
                type="text"
                placeholder="Ingrese su ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/15 border border-destructive/30 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground pt-2">
              <Link href="/recover" className="hover:text-primary underline font-medium transition-colors">
                ¿Olvidó su contraseña?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
