"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function ReportesPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [reportData, setReportData] = useState<any>(null)

  // Form states
  const [studentCode, setStudentCode] = useState("")
  const [tutorCode, setTutorCode] = useState("")
  const [semesterId, setSemesterId] = useState("")
  const [date, setDate] = useState("")

  const handleGenerateReport = async (type: string) => {
    setIsLoading(true)
    setReportData(null)

    try {
      let data
      switch (type) {
        case "student":
          if (!studentCode) {
            toast({
              title: "Error",
              description: "Ingrese el código del estudiante",
              variant: "destructive",
            })
            return
          }
          data = await api.getReporteEstudiante(studentCode)
          break
        case "tutor":
          if (!tutorCode) {
            toast({
              title: "Error",
              description: "Ingrese el código del tutor",
              variant: "destructive",
            })
            return
          }
          data = await api.getReporteTutor(tutorCode)
          break
        case "semester":
          if (!semesterId) {
            toast({
              title: "Error",
              description: "Ingrese el ID del semestre",
              variant: "destructive",
            })
            return
          }
          data = await api.getReporteSemestre(semesterId)
          break
        case "date":
          if (!date) {
            toast({
              title: "Error",
              description: "Seleccione una fecha",
              variant: "destructive",
            })
            return
          }
          data = await api.getReporteFecha(date)
          break
      }

      setReportData(data)
      toast({
        title: "Éxito",
        description: "Reporte generado correctamente",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al generar reporte",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    if (!reportData) return

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `reporte_${new Date().toISOString()}.json`
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Éxito",
      description: "Reporte exportado correctamente",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
          <p className="text-muted-foreground mt-2">Consultar y generar reportes del sistema</p>
        </div>

        <Tabs defaultValue="student" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="student">Por Estudiante</TabsTrigger>
            <TabsTrigger value="tutor">Por Tutor</TabsTrigger>
            <TabsTrigger value="semester">Por Semestre</TabsTrigger>
            <TabsTrigger value="date">Por Fecha</TabsTrigger>
          </TabsList>

          <TabsContent value="student" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reporte por Estudiante</CardTitle>
                <CardDescription>Consultar tutorías y datos de un estudiante específico</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentCode">Código de Estudiante</Label>
                  <Input
                    id="studentCode"
                    placeholder="Ingrese el código del estudiante"
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                  />
                </div>
                <Button onClick={() => handleGenerateReport("student")} disabled={isLoading}>
                  <FileText className="h-4 w-4 mr-2" />
                  {isLoading ? "Generando..." : "Generar Reporte"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tutor" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reporte por Tutor</CardTitle>
                <CardDescription>Consultar tutorías y estadísticas de un tutor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tutorCode">Código de Tutor</Label>
                  <Input
                    id="tutorCode"
                    placeholder="Ingrese el código del tutor"
                    value={tutorCode}
                    onChange={(e) => setTutorCode(e.target.value)}
                  />
                </div>
                <Button onClick={() => handleGenerateReport("tutor")} disabled={isLoading}>
                  <FileText className="h-4 w-4 mr-2" />
                  {isLoading ? "Generando..." : "Generar Reporte"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="semester" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reporte por Semestre</CardTitle>
                <CardDescription>Consultar tutorías y estadísticas de un semestre</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="semesterId">ID de Semestre</Label>
                  <Input
                    id="semesterId"
                    placeholder="Ej: 2024-1"
                    value={semesterId}
                    onChange={(e) => setSemesterId(e.target.value)}
                  />
                </div>
                <Button onClick={() => handleGenerateReport("semester")} disabled={isLoading}>
                  <FileText className="h-4 w-4 mr-2" />
                  {isLoading ? "Generando..." : "Generar Reporte"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="date" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reporte por Fecha</CardTitle>
                <CardDescription>Consultar tutorías realizadas en una fecha específica</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <Button onClick={() => handleGenerateReport("date")} disabled={isLoading}>
                  <FileText className="h-4 w-4 mr-2" />
                  {isLoading ? "Generando..." : "Generar Reporte"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {reportData && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Resultados del Reporte</CardTitle>
                  <CardDescription>Datos obtenidos de la consulta</CardDescription>
                </div>
                <Button onClick={handleExport} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campo</TableHead>
                      <TableHead>Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(reportData).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium capitalize">{key.replace(/_/g, " ")}</TableCell>
                        <TableCell>
                          {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
