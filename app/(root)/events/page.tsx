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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, MoreHorizontal, Edit, Copy, Trash2, Calendar, MapPin, Users, Ticket } from "lucide-react"
import { useState, useEffect } from "react"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

interface Event {
  event_id: number;
  name: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  price: number;
  status: string;
  category?: string;
  organizer?: string;
  logo_url?: string;
  sold?: number;
  created_at: string;
  updated_at: string;
}

export default function EventsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [events, setEvents] = useState<Event[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newEventoData, setNewEventoData] = useState({
    name: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    price: "",
  })
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Error al cargar los eventos');
        }
        const data: Event[] = await response.json();
        // Ajustar el formato de fecha y hora para la UI si es necesario
        const formattedData = data.map(event => ({
          ...event,
          date: new Date(event.date).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }),
          time: new Date(event.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }),
          // Simular 'sold' hasta que se implemente la lógica de tickets
          sold: Math.floor(Math.random() * event.capacity),
        }));
        setEvents(formattedData);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Error", {
          description: "No se pudieron cargar los eventos."
        });
      }
    };
    fetchEvents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewEventoData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setNewEventoData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateEvent = async () => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEventoData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el evento');
      }

      const newEvent: Event = await response.json();
      const formattedNewEvent = {
        ...newEvent,
        date: new Date(newEvent.date).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        time: new Date(newEvent.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }),
        sold: Math.floor(Math.random() * newEvent.capacity),
      };
      setEvents(prev => [...prev, formattedNewEvent]);
      setIsCreateDialogOpen(false);
      setNewEventoData({
        name: "", description: "", category: "", date: "", time: "", location: "", capacity: "", price: "",
      });
      toast.success("Evento creado", {
        description: "El evento ha sido creado exitosamente."
      });
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error", {
        description: "No se pudo crear el evento."
      });
    }
  };

  const handleEditEvent = async () => {
    if (!editingEvent) return;
    try {
      const response = await fetch(`/api/events/${editingEvent.event_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingEvent.name,
          description: editingEvent.description,
          category: editingEvent.category,
          date: editingEvent.date,
          time: editingEvent.time,
          location: editingEvent.location,
          capacity: editingEvent.capacity,
          price: editingEvent.price,
          status: editingEvent.status,
          organizer: editingEvent.organizer,
          logo_url: editingEvent.logo_url,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el evento');
      }

      const updatedEvent: Event = await response.json();
      const formattedUpdatedEvent = {
        ...updatedEvent,
        date: new Date(updatedEvent.date).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        time: new Date(updatedEvent.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }),
        sold: Math.floor(Math.random() * updatedEvent.capacity),
      };
      setEvents(prev => prev.map(event => event.event_id === formattedUpdatedEvent.event_id ? formattedUpdatedEvent : event));
      setEditingEvent(null); // Cerrar el diálogo de edición
      toast.success("Evento actualizado", {
        description: "El evento ha sido actualizado exitosamente."
      });
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Error", {
        description: "No se pudo actualizar el evento."
      });
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el evento');
      }

      setEvents(prev => prev.filter(event => event.event_id !== eventId));
      toast.success("Evento eliminado", {
        description: "El evento ha sido eliminado exitosamente."
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Error", {
        description: "No se pudo eliminar el evento."
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Activo":
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>
      case "Vendiendo":
        return <Badge className="bg-blue-100 text-blue-800">Vendiendo</Badge>
      case "Próximo":
        return <Badge className="bg-yellow-100 text-yellow-800">Próximo</Badge>
      case "Borrador":
        return <Badge className="bg-gray-100 text-gray-800">Borrador</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.category && event.category.toLowerCase().includes(searchTerm.toLowerCase())),
  )

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
                <BreadcrumbPage>Eventos</BreadcrumbPage>
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
            <h1 className="text-2xl font-bold tracking-tight">Gestión de Eventos</h1>
            <p className="text-muted-foreground">Administra todos tus eventos desde un solo lugar</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Evento</DialogTitle>
                <DialogDescription>Completa la información para crear un nuevo evento</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nombre
                  </Label>
                  <Input id="name" className="col-span-3" placeholder="Nombre del evento" value={newEventoData.name} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Descripción
                  </Label>
                  <Textarea id="description" className="col-span-3" placeholder="Descripción del evento" value={newEventoData.description} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Categoría
                  </Label>
                  <Select value={newEventoData.category} onValueChange={(val) => handleSelectChange('category', val)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tecnología">Tecnología</SelectItem>
                      <SelectItem value="Música">Música</SelectItem>
                      <SelectItem value="Educación">Educación</SelectItem>
                      <SelectItem value="Gastronomía">Gastronomía</SelectItem>
                      <SelectItem value="Deportes">Deportes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Fecha
                  </Label>
                  <Input id="date" type="date" className="col-span-3" value={newEventoData.date} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Hora
                  </Label>
                  <Input id="time" type="time" className="col-span-3" value={newEventoData.time} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Ubicación
                  </Label>
                  <Input id="location" className="col-span-3" placeholder="Ubicación del evento" value={newEventoData.location} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">
                    Capacidad
                  </Label>
                  <Input id="capacity" type="number" className="col-span-3" placeholder="Número máximo de asistentes" value={newEventoData.capacity} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Precio
                  </Label>
                  <Input id="price" type="number" className="col-span-3" placeholder="Precio por entrada" value={newEventoData.price} onChange={handleInputChange} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateEvent}>
                  Crear Evento
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar eventos..."
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

        {/* Events Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Eventos</CardTitle>
            <CardDescription>{filteredEvents.length} eventos encontrados</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.event_id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{event.name}</div>
                        <div className="text-sm text-muted-foreground">{event.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{event.date}</div>
                          <div className="text-sm text-muted-foreground">{event.time}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        {event.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>
                            {event.sold}/{event.capacity}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round(((event.sold || 0) / event.capacity) * 100)}% ocupado
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(event.status)}</TableCell>
                    <TableCell className="font-medium">${event.price}</TableCell>
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
                          <DropdownMenuItem onClick={() => setEditingEvent(event)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Ticket className="mr-2 h-4 w-4" />
                            Ver Entradas
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteEvent(event.event_id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
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

        {/* Dialogo de Edición de Evento */}
        <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Evento</DialogTitle>
              <DialogDescription>Modifica la información del evento</DialogDescription>
            </DialogHeader>
            {editingEvent && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editName" className="text-right">
                    Nombre
                  </Label>
                  <Input id="editName" className="col-span-3" value={editingEvent.name} onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editDescription" className="text-right">
                    Descripción
                  </Label>
                  <Textarea id="editDescription" className="col-span-3" value={editingEvent.description || ''} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editCategory" className="text-right">
                    Categoría
                  </Label>
                  <Select value={editingEvent.category || ''} onValueChange={(val) => setEditingEvent({ ...editingEvent, category: val })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tecnología">Tecnología</SelectItem>
                      <SelectItem value="Música">Música</SelectItem>
                      <SelectItem value="Educación">Educación</SelectItem>
                      <SelectItem value="Gastronomía">Gastronomía</SelectItem>
                      <SelectItem value="Deportes">Deportes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editDate" className="text-right">
                    Fecha
                  </Label>
                  <Input id="editDate" type="date" className="col-span-3" value={editingEvent.date} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editTime" className="text-right">
                    Hora
                  </Label>
                  <Input id="editTime" type="time" className="col-span-3" value={editingEvent.time} onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editLocation" className="text-right">
                    Ubicación
                  </Label>
                  <Input id="editLocation" className="col-span-3" value={editingEvent.location} onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editCapacity" className="text-right">
                    Capacidad
                  </Label>
                  <Input id="editCapacity" type="number" className="col-span-3" value={editingEvent.capacity} onChange={(e) => setEditingEvent({ ...editingEvent, capacity: parseInt(e.target.value) })} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editPrice" className="text-right">
                    Precio
                  </Label>
                  <Input id="editPrice" type="number" className="col-span-3" value={editingEvent.price} onChange={(e) => setEditingEvent({ ...editingEvent, price: parseFloat(e.target.value) })} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="editStatus" className="text-right">
                    Estado
                  </Label>
                  <Select value={editingEvent.status} onValueChange={(val) => setEditingEvent({ ...editingEvent, status: val })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Vendiendo">Vendiendo</SelectItem>
                      <SelectItem value="Próximo">Próximo</SelectItem>
                      <SelectItem value="Borrador">Borrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" onClick={handleEditEvent}>
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}