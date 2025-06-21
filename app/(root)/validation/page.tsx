"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { QrCode, Search, CheckCircle, XCircle, AlertTriangle, Camera, Scan, Clock, User, Calendar } from "lucide-react"
import { useState } from "react"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/contexts/auth-context"

export default function ValidationPage() {
  const { user } = useAuth()
  const [qrInput, setQrInput] = useState("")
  const [validationResult, setValidationResult] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)

  const recentValidations = [
    {
      id: "TK001234",
      event: "Conferencia Tech 2024",
      holder: "Juan Pérez",
      time: "10:30 AM",
      status: "Válida",
      gate: "Entrada A",
    },
    {
      id: "TK001235",
      event: "Festival de Música",
      holder: "María García",
      time: "10:28 AM",
      status: "Válida",
      gate: "Entrada B",
    },
    {
      id: "TK001236",
      event: "Workshop de Diseño",
      holder: "Carlos López",
      time: "10:25 AM",
      status: "Duplicada",
      gate: "Entrada A",
    },
    {
      id: "TK001237",
      event: "Expo Gastronómica",
      holder: "Ana Martínez",
      time: "10:22 AM",
      status: "Inválida",
      gate: "Entrada C",
    },
  ]

  const handleValidation = () => {
    if (!qrInput.trim()) return

    // Simulación de validación
    const mockResults = [
      {
        valid: true,
        ticket: {
          id: qrInput,
          event: "Conferencia Tech 2024",
          holder: "Juan Pérez",
          type: "VIP",
          gate: "Entrada A",
          time: new Date().toLocaleTimeString(),
        },
        message: "Entrada válida - Acceso permitido",
      },
      {
        valid: false,
        ticket: null,
        message: "Entrada ya escaneada anteriormente",
      },
      {
        valid: false,
        ticket: null,
        message: "Código QR inválido o no encontrado",
      },
    ]

    const result = mockResults[Math.floor(Math.random() * mockResults.length)]
    setValidationResult(result)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Válida":
        return <Badge className="bg-green-100 text-green-800">Válida</Badge>
      case "Duplicada":
        return <Badge className="bg-yellow-100 text-yellow-800">Duplicada</Badge>
      case "Inválida":
        return <Badge className="bg-red-100 text-red-800">Inválida</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Validación</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-4">
          <UserMenu />
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Validación de Entradas</h1>
          <p className="text-muted-foreground">Escanea códigos QR para validar el acceso a eventos</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* QR Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Escáner de Códigos QR
              </CardTitle>
              <CardDescription>Ingresa el código manualmente o usa la cámara para escanear</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Ingresa código QR o ID de entrada..."
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    className="pl-8"
                    onKeyPress={(e) => e.key === "Enter" && handleValidation()}
                  />
                </div>
                <Button onClick={handleValidation}>
                  <Scan className="mr-2 h-4 w-4" />
                  Validar
                </Button>
              </div>

              <div className="flex justify-center">
                <Button variant="outline" size="lg" onClick={() => setIsScanning(!isScanning)} className="w-full">
                  <Camera className="mr-2 h-4 w-4" />
                  {isScanning ? "Detener Cámara" : "Usar Cámara"}
                </Button>
              </div>

              {isScanning && (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Vista de cámara simulada</p>
                    <p className="text-xs text-gray-400">Apunta la cámara al código QR</p>
                  </div>
                </div>
              )}

              {/* Validation Result */}
              {validationResult && (
                <Alert className={validationResult.valid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  {validationResult.valid ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertTitle className={validationResult.valid ? "text-green-800" : "text-red-800"}>
                    {validationResult.valid ? "Entrada Válida" : "Entrada Inválida"}
                  </AlertTitle>
                  <AlertDescription className={validationResult.valid ? "text-green-700" : "text-red-700"}>
                    {validationResult.message}
                    {validationResult.ticket && (
                      <div className="mt-2 space-y-1">
                        <p>
                          <strong>ID:</strong> {validationResult.ticket.id}
                        </p>
                        <p>
                          <strong>Evento:</strong> {validationResult.ticket.event}
                        </p>
                        <p>
                          <strong>Titular:</strong> {validationResult.ticket.holder}
                        </p>
                        <p>
                          <strong>Tipo:</strong> {validationResult.ticket.type}
                        </p>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Validación</CardTitle>
              <CardDescription>Resumen de validaciones de hoy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">1,245</div>
                  <div className="text-sm text-green-600">Entradas Válidas</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-700">23</div>
                  <div className="text-sm text-red-600">Entradas Inválidas</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-700">12</div>
                  <div className="text-sm text-yellow-600">Duplicadas</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-700">1,280</div>
                  <div className="text-sm text-blue-600">Total Escaneadas</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Tasa de éxito:</span>
                  <span className="font-medium text-green-600">97.3%</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Última validación:</span>
                  <span className="font-medium">Hace 2 minutos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Validations */}
        <Card>
          <CardHeader>
            <CardTitle>Validaciones Recientes</CardTitle>
            <CardDescription>Últimas validaciones realizadas en tiempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Entrada</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Titular</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Puerta</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentValidations.map((validation, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{validation.id}</TableCell>
                    <TableCell className="font-medium">{validation.event}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        {validation.holder}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        {validation.time}
                      </div>
                    </TableCell>
                    <TableCell>{validation.gate}</TableCell>
                    <TableCell>{getStatusBadge(validation.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Eventos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Conferencia Tech</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Activo</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Festival Música</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">En curso</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alertas del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">12 intentos de entrada duplicada detectados</AlertDescription>
                </Alert>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">Puerta C reporta problemas de conectividad</AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <QrCode className="mr-2 h-4 w-4" />
                Modo Escáner Continuo
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                Validación Manual
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Reportar Incidencia
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
