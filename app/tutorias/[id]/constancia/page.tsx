"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Printer, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { api } from "@/lib/api"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function ConstanciaPage() {
  const [tutoria, setTutoria] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

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

  const handlePrint = () => {
    window.print()
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!tutoria) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Tutoría no encontrada</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="print:hidden fixed top-4 left-4 right-4 z-10 flex justify-between bg-card/95 backdrop-blur-sm p-4 rounded-xl border-2 shadow-lg">
        <Button variant="outline" onClick={() => router.back()} size="lg">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <Button onClick={handlePrint} size="lg">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir Constancia
        </Button>
      </div>

      <div className="max-w-4xl mx-auto p-8 pt-24 print:pt-8">
        <Card className="p-12 print:shadow-none print:border-4 print:border-foreground">
          <div className="text-center space-y-8">
            {/* Header with institutional styling */}
            <div className="border-b-4 border-primary pb-6 space-y-3">
              <div className="mx-auto w-32 h-32 flex items-center justify-center mb-4">
                <Image src="/logo-unsaac.png" alt="Logo UNSAAC" width={120} height={120} className="object-contain" />
              </div>
              <h1 className="text-5xl font-bold text-primary mb-2">CONSTANCIA</h1>
              <h2 className="text-3xl font-bold">DE TUTORÍA</h2>
              <p className="text-xl font-bold pt-2">UNIVERSIDAD NACIONAL DE SAN ANTONIO ABAD DEL CUSCO</p>
              <p className="text-lg text-muted-foreground font-medium">Sistema de Información para Tutorías</p>
            </div>

            {/* Content */}
            <div className="space-y-8 text-left py-6">
              <p className="text-lg leading-relaxed">
                Por medio de la presente se hace constar que el estudiante con código{" "}
                <span className="font-bold text-primary">{tutoria.student_code}</span> ha asistido a una sesión de
                tutoría con el tutor <span className="font-bold text-primary">{tutoria.tutor_code}</span>.
              </p>

              <div className="grid gap-4 bg-accent/20 border-2 border-accent p-8 rounded-xl">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Fecha de la sesión
                    </p>
                    <p className="font-semibold text-lg capitalize">{formatDate(tutoria.day)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Horario</p>
                    <p className="font-semibold text-lg">
                      {tutoria.time_start} - {tutoria.time_end}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Tipo de tutoría
                    </p>
                    <p className="font-semibold text-lg">{tutoria.type_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Modalidad</p>
                    <p className="font-semibold text-lg">{tutoria.mode_id}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Tema tratado</p>
                  <p className="font-semibold text-lg">{tutoria.topic}</p>
                </div>

                {tutoria.observations && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Observaciones
                    </p>
                    <p className="font-medium whitespace-pre-wrap">{tutoria.observations}</p>
                  </div>
                )}
              </div>

              <p className="text-lg leading-relaxed">
                Se expide la presente constancia a solicitud del interesado para los fines que estime conveniente.
              </p>
            </div>

            {/* Footer */}
            <div className="pt-12 space-y-8">
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium">
                  Fecha de emisión:{" "}
                  {new Date().toLocaleDateString("es-PE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="font-medium">Constancia N° {String(tutoria.id).padStart(6, "0")}</p>
              </div>

              <div className="border-t-2 border-foreground w-80 mx-auto pt-3">
                <p className="font-bold text-lg">Firma del Tutor</p>
                <p className="text-muted-foreground mt-1">{tutoria.tutor_code}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
