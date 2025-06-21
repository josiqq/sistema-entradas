"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
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
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Calendar,
  Ticket,
  Users,
  TrendingUp,
  QrCode,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Download,
  Filter,
} from "lucide-react"
import { StatsChart } from "@/components/stats-chart"

export default function Dashboard() {
  const stats = [
    {
      title: "Eventos Activos",
      value: "12",
      change: "+2 este mes",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Entradas Vendidas",
      value: "2,847",
      change: "+18% vs mes anterior",
      icon: Ticket,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Asistentes Registrados",
      value: "1,923",
      change: "67% de ocupación",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Ingresos Totales",
      value: "$45,230",
      change: "+12% vs mes anterior",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const recentEvents = [
    {
      id: 1,
      name: "Conferencia Tech 2024",
      date: "2024-02-15",
      status: "Activo",
      sold: 450,
      total: 500,
      revenue: "$22,500",
    },
    {
      id: 2,
      name: "Festival de Música",
      date: "2024-02-20",
      status: "Vendiendo",
      sold: 1200,
      total: 2000,
      revenue: "$60,000",
    },
    {
      id: 3,
      name: "Workshop de Diseño",
      date: "2024-02-25",
      status: "Próximo",
      sold: 25,
      total: 50,
      revenue: "$1,250",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Activo":
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>
      case "Vendiendo":
        return <Badge className="bg-blue-100 text-blue-800">Vendiendo</Badge>
      case "Próximo":
        return <Badge className="bg-yellow-100 text-yellow-800">Próximo</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">EventManager Pro</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-4">
          <div className="flex items-center gap-2">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Evento
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Chart */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Ventas de Entradas</CardTitle>
              <CardDescription>Últimos 7 días</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <StatsChart />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Gestión diaria del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <QrCode className="mr-2 h-4 w-4" />
                Validar Entrada
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Ticket className="mr-2 h-4 w-4" />
                Generar Entradas
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Crear Evento
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar Datos
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Events Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Eventos Recientes</CardTitle>
              <CardDescription>Gestión y seguimiento de eventos activos</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Entradas</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Ingresos</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>{getStatusBadge(event.status)}</TableCell>
                    <TableCell>
                      {event.sold}/{event.total}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={(event.sold / event.total) * 100} className="w-16" />
                        <span className="text-sm text-muted-foreground">
                          {Math.round((event.sold / event.total) * 100)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{event.revenue}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Alert Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <CardTitle className="text-sm font-medium ml-2">Eventos por Vencer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700">3</div>
              <p className="text-xs text-yellow-600">Próximos 7 días</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <CardTitle className="text-sm font-medium ml-2">Entradas Validadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">1,245</div>
              <p className="text-xs text-green-600">Hoy</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-sm font-medium ml-2">Eventos en Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">2</div>
              <p className="text-xs text-blue-600">Activos ahora</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
