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
import { useState, useEffect } from "react";
import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

interface TicketDesignOption {
    id: string;
    name: string;
}

interface EventData {
  event_id: number;
  name: string;
}

interface Ticket {
  ticket_id: string;
  event_id: number;
  holder_name: string;
  holder_email: string;
  type: string;
  price: number;
  status: string;
  purchase_date: string;
  qr_code: string;
  is_scanned: boolean;
  scanned_time?: string;
  gate_used?: string;
  event: EventData;
  ticketDesignId?: string;
  ticketDesign?: TicketDesignOption;
}

interface EventOption {
    event_id: number;
    name: string;
}

export default function TicketsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [events, setEvents] = useState<EventOption[]>([]);
  const [ticketDesigns, setTicketDesigns] = useState<TicketDesignOption[]>([]);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generateTicketData, setGenerateTicketData] = useState({
    eventId: '',
    type: '',
    quantity: '',
    price: '',
    holderName: '',
    holderEmail: '',
    ticketDesignId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsResponse, eventsResponse, designsResponse] = await Promise.all([
          fetch('/api/tickets'),
          fetch('/api/events'),
          fetch('/api/ticket-designs'),
        ]);

        if (!ticketsResponse.ok) throw new Error('Error al cargar los tickets');
        const ticketsData: Ticket[] = await ticketsResponse.json();
        setTickets(ticketsData);

        if (!eventsResponse.ok) throw new Error('Error al cargar los eventos');
        const eventsData: EventOption[] = await eventsResponse.json();
        setEvents(eventsData.map(event => ({ event_id: event.event_id, name: event.name })));

        if (!designsResponse.ok) throw new Error('Error al cargar los diseños de tickets');
        const designsData: TicketDesignOption[] = await designsResponse.json();
        setTicketDesigns(designsData.map(design => ({ id: design.id, name: design.name })));
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error", {
          description: "No se pudieron cargar los datos."
        });
      }
    };
    fetchData();
  }, []);

  const handleGenerateTicketInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setGenerateTicketData(prev => ({ ...prev, [id]: value }));
  };

  const handleGenerateTicketSelectChange = (field: string, value: string) => {
    setGenerateTicketData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateTickets = async () => {
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...generateTicketData,
          eventId: parseInt(generateTicketData.eventId),
          quantity: parseInt(generateTicketData.quantity),
          price: parseFloat(generateTicketData.price),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al generar entradas');
      }

      const newTickets: Ticket[] = await response.json();
      setTickets(prev => [...prev, ...newTickets]);
      setIsGenerateDialogOpen(false);
      setGenerateTicketData({
        eventId: '', type: '', quantity: '', price: '', holderName: '', holderEmail: '', ticketDesignId: ''
      });
      toast.success("Entradas generadas", {
        description: `Se han generado ${newTickets.length} entradas exitosamente.`
      });
    } catch (error) {
      console.error("Error generating tickets:", error);
      toast.error("Error", {
        description: (error as Error).message || "No se pudieron generar las entradas."
      });
    }
  };

  const handleCancelTicket = async (ticketId: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Cancelada' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cancelar la entrada');
      }

      const canceledTicket: Ticket = await response.json();
      setTickets(prev => prev.map(ticket => ticket.ticket_id === canceledTicket.ticket_id ? canceledTicket : ticket));
      toast.success("Entrada cancelada", {
        description: `La entrada ${ticketId} ha sido cancelada.`
      });
    } catch (error) {
      console.error("Error cancelling ticket:", error);
      toast.error("Error", {
        description: (error as Error).message || "No se pudo cancelar la entrada."
      });
    }
  };

  const getStatusBadge = (status: string, is_scanned: boolean) => {
    if (is_scanned) {
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
      ticket.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.holder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTickets = tickets.length;
  const validTickets = tickets.filter(t => t.status === 'Válida' && !t.is_scanned).length;
  const scannedTickets = tickets.filter(t => t.is_scanned).length;
  const pendingTickets = tickets.filter(t => t.status === 'Pendiente').length;


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
                    <Label htmlFor="eventId" className="text-right">
                      Evento
                    </Label>
                    <Select value={generateTicketData.eventId} onValueChange={(val) => handleGenerateTicketSelectChange('eventId', val)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecciona un evento" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map((event) => (
                            <SelectItem key={event.event_id} value={String(event.event_id)}>
                                {event.name}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Tipo
                    </Label>
                    <Select value={generateTicketData.type} onValueChange={(val) => handleGenerateTicketSelectChange('type', val)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Tipo de entrada" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Estudiante">Estudiante</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
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
                      value={generateTicketData.quantity}
                      onChange={handleGenerateTicketInputChange}
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
                      value={generateTicketData.price}
                      onChange={handleGenerateTicketInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="holderName" className="text-right">
                      Nombre Titular
                    </Label>
                    <Input
                      id="holderName"
                      className="col-span-3"
                      placeholder="Nombre del titular"
                      value={generateTicketData.holderName}
                      onChange={handleGenerateTicketInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="holderEmail" className="text-right">
                      Email Titular
                    </Label>
                    <Input
                      id="holderEmail"
                      type="email"
                      className="col-span-3"
                      placeholder="email@example.com"
                      value={generateTicketData.holderEmail}
                      onChange={handleGenerateTicketInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ticketDesignId" className="text-right">
                      Plantilla Diseño
                    </Label>
                    <Select value={generateTicketData.ticketDesignId} onValueChange={(val) => handleGenerateTicketSelectChange('ticketDesignId', val)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecciona una plantilla (Opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {ticketDesigns.map((design) => (
                            <SelectItem key={design.id} value={design.id}>
                                {design.name}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={handleGenerateTickets}
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
              <div className="text-2xl font-bold">{totalTickets}</div>
              <p className="text-xs text-muted-foreground">
                Tickets registrados
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
              <div className="text-2xl font-bold">{validTickets}</div>
              <p className="text-xs text-muted-foreground">No escaneadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Escaneadas</CardTitle>
              <QrCode className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scannedTickets}</div>
              <p className="text-xs text-muted-foreground">Tickets usados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTickets}</div>
              <p className="text-xs text-muted-foreground">Por confirmar</p>
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
                  <TableRow key={ticket.ticket_id}>
                    <TableCell className="font-mono">{ticket.ticket_id}</TableCell>
                    <TableCell className="font-medium">
                      {ticket.event.name}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ticket.holder_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {ticket.holder_email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(ticket.type)}>
                        {ticket.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(ticket.status, ticket.is_scanned)}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${ticket.price}
                    </TableCell>
                    <TableCell>{new Date(ticket.purchase_date).toLocaleDateString('es-ES')}</TableCell>
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
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleCancelTicket(ticket.ticket_id)}
                          >
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