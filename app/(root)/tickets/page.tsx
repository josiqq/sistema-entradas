"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  QrCode,
  Mail,
  Printer,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@/contexts/auth-context";

export default function TicketsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  const tickets = [
    {
      id: "TK001234",
      event: "Conferencia Tech 2024",
      holder: "Juan Pérez",
      email: "juan@email.com",
      type: "VIP",
      price: 75,
      status: "Válida",
      purchaseDate: "2024-01-15",
      qrCode: "QR123456789",
      scanned: false,
    },
    {
      id: "TK001235",
      event: "Festival de Música",
      holder: "María García",
      email: "maria@email.com",
      type: "General",
      price: 50,
      status: "Válida",
      purchaseDate: "2024-01-16",
      qrCode: "QR123456790",
      scanned: true,
    },
    {
      id: "TK001236",
      event: "Workshop de Diseño",
      holder: "Carlos López",
      email: "carlos@email.com",
      type: "Estudiante",
      price: 25,
      status: "Pendiente",
      purchaseDate: "2024-01-17",
      qrCode: "QR123456791",
      scanned: false,
    },
    {
      id: "TK001237",
      event: "Expo Gastronómica",
      holder: "Ana Martínez",
      email: "ana@email.com",
      type: "General",
      price: 30,
      status: "Cancelada",
      purchaseDate: "2024-01-18",
      qrCode: "QR123456792",
      scanned: false,
    },
  ];

  const getStatusBadge = (status: string, scanned: boolean) => {
    if (scanned) {
      return <Badge className="bg-green-100 text-green-800">Escaneada</Badge>;
    }
    switch (status) {
      case "Válida":
        return <Badge className="bg-blue-100 text-blue-800">Válida</Badge>;
      case "Pendiente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
        );
      case "Cancelada":
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "VIP":
        return "bg-purple-100 text-purple-800";
      case "General":
        return "bg-blue-100 text-blue-800";
      case "Estudiante":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.holder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.event.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <BreadcrumbPage>Entradas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-4">
          <UserMenu />
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Gestión de Entradas
            </h1>
            <p className="text-muted-foreground">
              Administra y controla todas las entradas del sistema
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog
              open={isGenerateDialogOpen}
              onOpenChange={setIsGenerateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Generar Entradas
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Generar Entradas Masivamente</DialogTitle>
                  <DialogDescription>
                    Genera múltiples entradas con códigos QR únicos para un
                    evento
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="event" className="text-right">
                      Evento
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecciona un evento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech2024">
                          Conferencia Tech 2024
                        </SelectItem>
                        <SelectItem value="festival">
                          Festival de Música
                        </SelectItem>
                        <SelectItem value="workshop">
                          Workshop de Diseño
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Tipo
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Tipo de entrada" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vip">VIP</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="estudiante">Estudiante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">
                      Cantidad
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      className="col-span-3"
                      placeholder="Número de entradas"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Precio
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      className="col-span-3"
                      placeholder="Precio por entrada"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={() => setIsGenerateDialogOpen(false)}
                  >
                    Generar Entradas
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Entradas
              </CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">
                +12% vs mes anterior
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Entradas Válidas
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,456</div>
              <p className="text-xs text-muted-foreground">86% del total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Escaneadas</CardTitle>
              <QrCode className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,923</div>
              <p className="text-xs text-muted-foreground">78% de válidas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234</div>
              <p className="text-xs text-muted-foreground">8% del total</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, nombre o evento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>

        {/* Tickets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Entradas</CardTitle>
            <CardDescription>
              {filteredTickets.length} entradas encontradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Entrada</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Titular</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Fecha Compra</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono">{ticket.id}</TableCell>
                    <TableCell className="font-medium">
                      {ticket.event}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ticket.holder}</div>
                        <div className="text-sm text-muted-foreground">
                          {ticket.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(ticket.type)}>
                        {ticket.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(ticket.status, ticket.scanned)}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${ticket.price}
                    </TableCell>
                    <TableCell>{ticket.purchaseDate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <QrCode className="mr-2 h-4 w-4" />
                            Ver QR
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Reenviar Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimir
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancelar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
