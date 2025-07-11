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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Download,
  Layout,
  Smartphone,
  Monitor,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Save,
  Share2,
  QrCode,
  Upload,
  Maximize,
  RefreshCw,
  Check,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"
import { TicketPreview } from "@/components/ticket-preview"
import { TemplateGallery } from "@/components/template-gallery"
import { ColorPicker } from "@/components/color-picker"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

interface SavedTicketDesign {
  id: string
  name: string
  templateId: string
  eventName: string
  date: string
  time: string
  location: string
  ticketNumber: string
  ticketType: string
  price: string
  qrCode: string
  category: string
  organizer: string
  logo?: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  fontSize: number
  borderRadius: number
  orientation: string
  format: string
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TicketDesignerPage() {
  const { user } = useAuth()

  const [selectedTemplate, setSelectedTemplate] = useState("modern")
  const [ticketData, setTicketData] = useState({
    eventName: "Conferencia Tech 2024",
    date: "15 de Febrero, 2024",
    time: "09:00 AM",
    location: "Centro de Convenciones",
    ticketNumber: "TK001234",
    ticketType: "VIP",
    price: "$75.00",
    qrCode: "QR123456789",
    category: "Tecnología",
    organizer: "TechEvents Corp",
    logo: "/placeholder.svg?height=60&width=200",
  })
  const [designSettings, setDesignSettings] = useState({
    primaryColor: "#3b82f6",
    secondaryColor: "#1e40af",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    fontFamily: "Inter",
    fontSize: 14,
    borderRadius: 8,
    orientation: "horizontal",
    format: "standard",
  })
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showTemplateGallery, setShowTemplateGallery] = useState(false)
  const [previewMode, setPreviewMode] = useState("desktop")
  const [savedTemplates, setSavedTemplates] = useState<SavedTicketDesign[]>([]);

  const fontFamilies = ["Inter", "Roboto", "Open Sans", "Montserrat", "Poppins", "Lato", "Source Sans Pro", "Nunito"]

  useEffect(() => {
    const fetchSavedTemplates = async () => {
      try {
        const response = await fetch('/api/ticket-designs');
        if (!response.ok) {
          throw new Error('Failed to fetch saved designs');
        }
        const data: SavedTicketDesign[] = await response.json();
        setSavedTemplates(data);
      } catch (error) {
        console.error("Error fetching saved templates:", error);
        toast.error("Error al cargar plantillas", {
          description: "No se pudieron cargar los diseños guardados."
        });
      }
    };
    fetchSavedTemplates();
  }, []);

  const handleDownloadPDF = () => {
    console.log("Descargando PDF de alta calidad...")
  }

  const handleSaveTemplate = async () => {
    try {
      const designToSave = {
        name: `${ticketData.eventName} - ${selectedTemplate} Design`,
        templateId: selectedTemplate,
        ...ticketData,
        ...designSettings,
        userId: user?.id,
      };

      const response = await fetch('/api/ticket-designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(designToSave),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el diseño del ticket');
      }

      const savedDesign: SavedTicketDesign = await response.json();
      setSavedTemplates((prev) => [...prev, savedDesign]);
      toast.success("Diseño de ticket guardado", {
        description: "La plantilla del ticket ha sido guardada exitosamente."
      });

    } catch (error) {
      console.error("Error guardando plantilla:", error);
      toast.error("Error al guardar el diseño", {
        description: "No se pudo guardar la plantilla del ticket."
      });
    }
  }

  const handleSharePreview = () => {
    // Simulación de compartir
    console.log("Generando link de preview...")
  }

  const handleLoadSelectedTemplate = (templateId: string) => {
    const templateToLoad = savedTemplates.find(t => t.id === templateId);
    if (templateToLoad) {
      setTicketData({
        eventName: templateToLoad.eventName,
        date: templateToLoad.date,
        time: templateToLoad.time,
        location: templateToLoad.location,
        ticketNumber: templateToLoad.ticketNumber,
        ticketType: templateToLoad.ticketType,
        price: templateToLoad.price,
        qrCode: templateToLoad.qrCode,
        category: templateToLoad.category,
        organizer: templateToLoad.organizer,
        logo: templateToLoad.logo || "/placeholder.svg?height=60&width=200",
      });
      setDesignSettings({
        primaryColor: templateToLoad.primaryColor,
        secondaryColor: templateToLoad.secondaryColor,
        backgroundColor: templateToLoad.backgroundColor,
        textColor: templateToLoad.textColor,
        fontFamily: templateToLoad.fontFamily,
        fontSize: templateToLoad.fontSize,
        borderRadius: templateToLoad.borderRadius,
        orientation: templateToLoad.orientation,
        format: templateToLoad.format,
      });
      setSelectedTemplate(templateToLoad.templateId); // Actualizar la plantilla base seleccionada
      toast.info("Plantilla cargada", {
        description: `Se ha cargado el diseño "${templateToLoad.name}".`
      });
    } else {
      toast.error("Error al cargar plantilla", {
        description: "La plantilla seleccionada no se encontró."
      });
    }
  };

  const allTemplates = [
    ...savedTemplates.map(design => ({
      id: design.id,
      name: design.name,
      category: design.category,
      preview: design.logo || "/placeholder.svg?height=200&width=300",
    }))
  ];

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
                <BreadcrumbPage>Diseñador de Entradas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowTemplateGallery(true)}>
                <Layout className="h-4 w-4 mr-2" />
                Plantillas
              </Button>
              <Button variant="outline" size="sm" onClick={handleSaveTemplate}>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
              <Button variant="outline" size="sm" onClick={handleSharePreview}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              <Button size="sm" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor Panel */}
        <div className="w-80 border-r bg-muted/30 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              {/* Información del Evento */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Información del Evento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="eventName" className="text-xs">
                      Nombre del Evento
                    </Label>
                    <Input
                      id="eventName"
                      value={ticketData.eventName}
                      onChange={(e) => setTicketData({ ...ticketData, eventName: e.target.value })}
                      className="h-8"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="date" className="text-xs">
                        Fecha
                      </Label>
                      <Input
                        id="date"
                        value={ticketData.date}
                        onChange={(e) => setTicketData({ ...ticketData, date: e.target.value })}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-xs">
                        Hora
                      </Label>
                      <Input
                        id="time"
                        value={ticketData.time}
                        onChange={(e) => setTicketData({ ...ticketData, time: e.target.value })}
                        className="h-8"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-xs">
                      Ubicación
                    </Label>
                    <Input
                      id="location"
                      value={ticketData.location}
                      onChange={(e) => setTicketData({ ...ticketData, location: e.target.value })}
                      className="h-8"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="ticketType" className="text-xs">
                        Tipo
                      </Label>
                      <Select
                        value={ticketData.ticketType}
                        onValueChange={(value) => setTicketData({ ...ticketData, ticketType: value })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VIP">VIP</SelectItem>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="Estudiante">Estudiante</SelectItem>
                          <SelectItem value="Premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="price" className="text-xs">
                        Precio
                      </Label>
                      <Input
                        id="price"
                        value={ticketData.price}
                        onChange={(e) => setTicketData({ ...ticketData, price: e.target.value })}
                        className="h-8"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Diseño y Estilo */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Diseño y Estilo</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="colors" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="colors" className="text-xs">
                        Colores
                      </TabsTrigger>
                      <TabsTrigger value="typography" className="text-xs">
                        Texto
                      </TabsTrigger>
                      <TabsTrigger value="layout" className="text-xs">
                        Layout
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="colors" className="space-y-3 mt-3">
                      <div>
                        <Label className="text-xs">Color Primario</Label>
                        <ColorPicker
                          color={designSettings.primaryColor}
                          onChange={(color) => setDesignSettings({ ...designSettings, primaryColor: color })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Color Secundario</Label>
                        <ColorPicker
                          color={designSettings.secondaryColor}
                          onChange={(color) => setDesignSettings({ ...designSettings, secondaryColor: color })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Fondo</Label>
                        <ColorPicker
                          color={designSettings.backgroundColor}
                          onChange={(color) => setDesignSettings({ ...designSettings, backgroundColor: color })}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="typography" className="space-y-3 mt-3">
                      <div>
                        <Label className="text-xs">Fuente</Label>
                        <Select
                          value={designSettings.fontFamily}
                          onValueChange={(value) => setDesignSettings({ ...designSettings, fontFamily: value })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fontFamilies.map((font) => (
                              <SelectItem key={font} value={font}>
                                {font}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Tamaño de Fuente: {designSettings.fontSize}px</Label>
                        <Slider
                          value={[designSettings.fontSize]}
                          onValueChange={([value]) => setDesignSettings({ ...designSettings, fontSize: value })}
                          max={24}
                          min={10}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="layout" className="space-y-3 mt-3">
                      <div>
                        <Label className="text-xs">Orientación</Label>
                        <Select
                          value={designSettings.orientation}
                          onValueChange={(value) => setDesignSettings({ ...designSettings, orientation: value })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="horizontal">Horizontal</SelectItem>
                            <SelectItem value="vertical">Vertical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Formato</Label>
                        <Select
                          value={designSettings.format}
                          onValueChange={(value) => setDesignSettings({ ...designSettings, format: value })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Estándar</SelectItem>
                            <SelectItem value="compact">Compacto</SelectItem>
                            <SelectItem value="large">Grande</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Radio de Bordes: {designSettings.borderRadius}px</Label>
                        <Slider
                          value={[designSettings.borderRadius]}
                          onValueChange={([value]) => setDesignSettings({ ...designSettings, borderRadius: value })}
                          max={20}
                          min={0}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Logo y Branding */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Logo y Branding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="organizer" className="text-xs">
                      Organizador
                    </Label>
                    <Input
                      id="organizer"
                      value={ticketData.organizer}
                      onChange={(e) => setTicketData({ ...ticketData, organizer: e.target.value })}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Logo del Evento</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button variant="outline" size="sm" className="h-8">
                        <Upload className="h-3 w-3 mr-1" />
                        Subir Logo
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </ScrollArea>
        </div>

        {/* Preview Area */}
        <div className="flex-1 flex flex-col">
          {/* Preview Controls */}
          <div className="border-b bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={previewMode === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("desktop")}
                >
                  <Monitor className="h-4 w-4 mr-1" />
                  Desktop
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("mobile")}
                >
                  <Smartphone className="h-4 w-4 mr-1" />
                  Mobile
                </Button>
                <Button
                  variant={previewMode === "print" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("print")}
                >
                  <Printer className="h-4 w-4 mr-1" />
                  Impresión
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(25, zoom - 25))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
                <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 25))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-4" />
                <Button variant="outline" size="sm" onClick={() => setRotation((rotation + 90) % 360)}>
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 bg-gray-50 p-8 overflow-auto">
            <div className="flex items-center justify-center min-h-full">
              <div
                className="transition-all duration-300"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transformOrigin: "center",
                }}
              >
                <TicketPreview
                  ticketData={ticketData}
                  designSettings={designSettings}
                  template={selectedTemplate}
                  previewMode={previewMode}
                />
              </div>
            </div>
          </div>

          {/* QR Preview Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="absolute bottom-4 right-4 bg-white shadow-lg">
                <QrCode className="h-4 w-4 mr-2" />
                Preview QR
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Vista Previa del Código QR</DialogTitle>
                <DialogDescription>Simulación de escaneo del código QR de la entrada</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                  <QrCode className="h-32 w-32 text-gray-400" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-medium">Código: {ticketData.qrCode}</p>
                  <p className="text-sm text-muted-foreground">Entrada: {ticketData.ticketNumber}</p>
                  <Badge className="bg-green-100 text-green-800">Código Válido</Badge>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Template Gallery Modal */}
      <TemplateGallery
        isOpen={showTemplateGallery}
        onClose={() => setShowTemplateGallery(false)}
        templates={allTemplates} // Pasa todas las plantillas (predefinidas + guardadas)
        selectedTemplate={selectedTemplate}
        onSelectTemplate={handleLoadSelectedTemplate} // Cambia a la nueva función de carga
      />
    </>
  )
}