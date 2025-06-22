"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { QrCode, MapPin, Calendar, Clock, Star, Shield } from "lucide-react"

interface TicketData {
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
  logo: string
}

interface DesignSettings {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  fontSize: number
  borderRadius: number
  orientation: string
  format: string
}

interface TicketPreviewProps {
  ticketData: TicketData
  designSettings: DesignSettings
  template: string
  previewMode: string
}

export function TicketPreview({ ticketData, designSettings, template, previewMode }: TicketPreviewProps) {
  const getTicketTypeIcon = (type: string) => {
    switch (type) {
      case "VIP":
        return <Star className="h-4 w-4" />
      case "Premium":
        return <Shield className="h-4 w-4" />
      default:
        return null
    }
  }

  const getTicketTypeColor = (type: string) => {
    switch (type) {
      case "VIP":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Premium":
        return "bg-gold-100 text-gold-800 border-gold-200"
      case "General":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Estudiante":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const containerClass = previewMode === "mobile" ? "max-w-sm" : previewMode === "print" ? "max-w-2xl" : "max-w-4xl"

  const isHorizontal = designSettings.orientation === "horizontal"

  return (
    <div className={`${containerClass} mx-auto`}>
      <Card
        className="overflow-hidden shadow-2xl"
        style={{
          backgroundColor: designSettings.backgroundColor,
          borderRadius: `${designSettings.borderRadius}px`,
          fontFamily: designSettings.fontFamily,
          fontSize: `${designSettings.fontSize}px`,
        }}
      >
        {/* Header with gradient */}
        <div
          className="relative p-6 text-white"
          style={{
            background: `linear-gradient(135deg, ${designSettings.primaryColor}, ${designSettings.secondaryColor})`,
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <QrCode className="w-full h-full" />
          </div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{ticketData.eventName}</h1>
                <p className="text-white/80 text-sm">{ticketData.organizer}</p>
              </div>
              <div className="text-right">
                <Badge className={`${getTicketTypeColor(ticketData.ticketType)} mb-2`}>
                  {getTicketTypeIcon(ticketData.ticketType)}
                  <span className="ml-1">{ticketData.ticketType}</span>
                </Badge>
                <p className="text-xl font-bold">{ticketData.price}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-6 ${isHorizontal ? "grid grid-cols-3 gap-6" : "space-y-6"}`}>
          {/* Event Details */}
          <div className={isHorizontal ? "col-span-2" : ""}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full" style={{ backgroundColor: `${designSettings.primaryColor}20` }}>
                    <Calendar className="h-4 w-4" style={{ color: designSettings.primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Fecha</p>
                    <p className="font-semibold" style={{ color: designSettings.textColor }}>
                      {ticketData.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full" style={{ backgroundColor: `${designSettings.primaryColor}20` }}>
                    <Clock className="h-4 w-4" style={{ color: designSettings.primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Hora</p>
                    <p className="font-semibold" style={{ color: designSettings.textColor }}>
                      {ticketData.time}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full" style={{ backgroundColor: `${designSettings.primaryColor}20` }}>
                  <MapPin className="h-4 w-4" style={{ color: designSettings.primaryColor }} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Ubicación</p>
                  <p className="font-semibold" style={{ color: designSettings.textColor }}>
                    {ticketData.location}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Número de Entrada</p>
                  <p className="font-mono font-bold text-lg" style={{ color: designSettings.primaryColor }}>
                    {ticketData.ticketNumber}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {ticketData.category}
                </Badge>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-inner border-2 border-gray-100">
              <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                <QrCode className="h-24 w-24 text-gray-400" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Código QR</p>
              <p className="font-mono text-sm" style={{ color: designSettings.textColor }}>
                {ticketData.qrCode}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div>
              <p>Válido para una sola entrada</p>
              <p>No reembolsable • Transferible</p>
            </div>
            <div className="text-right">
              <p>Generado: {new Date().toLocaleDateString()}</p>
              <p>ID: {ticketData.qrCode}</p>
            </div>
          </div>
        </div>

        {/* Perforated edge effect */}
        <div className="relative">
          <div className="absolute inset-x-0 -top-1 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="w-2 h-2 bg-white rounded-full border border-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
