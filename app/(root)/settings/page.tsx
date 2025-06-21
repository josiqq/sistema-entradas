"use client";

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Settings,
  Save,
  RefreshCw,
  Upload,
  Mail,
  Building,
  Globe,
  Ticket,
  Bell,
} from "lucide-react";
import { useState } from "react";
import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@/contexts/auth-context";
import { useSystem } from "@/contexts/system-context";

export default function SettingsPage() {
  const { user, isAdmin } = useAuth();
  const { config, updateConfig, resetConfig } = useSystem();
  const [activeTab, setActiveTab] = useState("events");

  if (!isAdmin()) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Acceso Denegado
            </h2>
            <p className="text-gray-600 mt-2">
              No tienes permisos para acceder a esta sección.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  const handleSaveSection = (section: keyof typeof config, data: any) => {
    updateConfig(section, data);
    toast("Configuración guardada", {
      description: "Los cambios se han guardado correctamente.",
    });
  };

  const handleResetConfig = () => {
    resetConfig();
    toast("Configuración restaurada", {
      description: "Se han restaurado los valores por defecto.",
    });
  };

  return (
    <SidebarInset>
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
                <BreadcrumbPage>Configuración</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-4">
          <div className="flex items-center gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restaurar Valores por Defecto
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    ¿Restaurar configuración por defecto?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción restaurará todas las configuraciones a sus
                    valores por defecto. Los cambios no se pueden deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetConfig}>
                    Restaurar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Configuración del Sistema
          </h1>
          <p className="text-muted-foreground">
            Administra la configuración general de EventManager Pro
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              Eventos
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Sistema
            </TabsTrigger>
          </TabsList>

          {/* Configuración de Eventos */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Configuración de Eventos
                </CardTitle>
                <CardDescription>
                  Configuración por defecto para eventos y entradas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxTickets">
                      Máximo de entradas por evento
                    </Label>
                    <Input
                      id="maxTickets"
                      type="number"
                      value={config.events.maxTicketsPerEvent}
                      onChange={(e) =>
                        handleSaveSection("events", {
                          maxTicketsPerEvent: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiration">
                      Tiempo de expiración (horas)
                    </Label>
                    <Input
                      id="expiration"
                      type="number"
                      value={config.events.expirationHours}
                      onChange={(e) =>
                        handleSaveSection("events", {
                          expirationHours: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Tipos de entradas disponibles</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {config.events.ticketTypes.map((type, index) => (
                      <Badge key={index} variant="outline">
                        {type}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tipos: {config.events.ticketTypes.join(", ")}
                  </p>
                </div>

                <div>
                  <Label>Estados de entrada</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {config.events.ticketStatuses.map((status, index) => (
                      <Badge key={index} variant="secondary">
                        {status}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Prefijos para códigos QR</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {Object.entries(config.events.qrPrefixes).map(
                      ([type, prefix]) => (
                        <div key={type} className="flex items-center gap-2">
                          <Label className="w-20 text-sm">{type}:</Label>
                          <Input
                            value={prefix}
                            onChange={(e) =>
                              handleSaveSection("events", {
                                qrPrefixes: {
                                  ...config.events.qrPrefixes,
                                  [type]: e.target.value,
                                },
                              })
                            }
                            className="flex-1"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => handleSaveSection("events", config.events)}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración de Eventos
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuración de Notificaciones */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Configuración de Notificaciones
                </CardTitle>
                <CardDescription>
                  Configuración de emails y notificaciones automáticas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="adminEmail">Email del administrador</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={config.notifications.adminEmail}
                    onChange={(e) =>
                      handleSaveSection("notifications", {
                        adminEmail: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Plantillas de email</Label>
                  <div className="space-y-3 mt-2">
                    {Object.entries(config.notifications.emailTemplates).map(
                      ([key, template]) => (
                        <div key={key}>
                          <Label className="text-sm capitalize">
                            {key.replace("_", " ")}
                          </Label>
                          <Textarea
                            value={template}
                            onChange={(e) =>
                              handleSaveSection("notifications", {
                                emailTemplates: {
                                  ...config.notifications.emailTemplates,
                                  [key]: e.target.value,
                                },
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <Label>Notificaciones automáticas</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      "ventas",
                      "alertas_stock",
                      "errores",
                      "eventos_proximos",
                    ].map((notification) => (
                      <div
                        key={notification}
                        className="flex items-center space-x-2"
                      >
                        <Switch
                          id={notification}
                          checked={config.notifications.autoNotifications.includes(
                            notification
                          )}
                          onCheckedChange={(checked) => {
                            const newNotifications = checked
                              ? [
                                  ...config.notifications.autoNotifications,
                                  notification,
                                ]
                              : config.notifications.autoNotifications.filter(
                                  (n) => n !== notification
                                );
                            handleSaveSection("notifications", {
                              autoNotifications: newNotifications,
                            });
                          }}
                        />
                        <Label htmlFor={notification} className="capitalize">
                          {notification.replace("_", " ")}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Configuración SMTP</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="smtpServer">Servidor</Label>
                      <Input
                        id="smtpServer"
                        value={config.notifications.smtpConfig.server}
                        onChange={(e) =>
                          handleSaveSection("notifications", {
                            smtpConfig: {
                              ...config.notifications.smtpConfig,
                              server: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpPort">Puerto</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        value={config.notifications.smtpConfig.port}
                        onChange={(e) =>
                          handleSaveSection("notifications", {
                            smtpConfig: {
                              ...config.notifications.smtpConfig,
                              port: Number.parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpUsername">Usuario</Label>
                      <Input
                        id="smtpUsername"
                        value={config.notifications.smtpConfig.username}
                        onChange={(e) =>
                          handleSaveSection("notifications", {
                            smtpConfig: {
                              ...config.notifications.smtpConfig,
                              username: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpPassword">Contraseña</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        value={config.notifications.smtpConfig.password}
                        onChange={(e) =>
                          handleSaveSection("notifications", {
                            smtpConfig: {
                              ...config.notifications.smtpConfig,
                              password: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() =>
                    handleSaveSection("notifications", config.notifications)
                  }
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración de Notificaciones
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuración de Empresa */}
          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Información de la Empresa
                </CardTitle>
                <CardDescription>
                  Datos corporativos y configuración de branding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Nombre de la empresa</Label>
                    <Input
                      id="companyName"
                      value={config.company.name}
                      onChange={(e) =>
                        handleSaveSection("company", { name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="legalName">Razón social</Label>
                    <Input
                      id="legalName"
                      value={config.company.legalName}
                      onChange={(e) =>
                        handleSaveSection("company", {
                          legalName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Textarea
                    id="address"
                    value={config.company.address}
                    onChange={(e) =>
                      handleSaveSection("company", { address: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={config.company.phone}
                      onChange={(e) =>
                        handleSaveSection("company", { phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="taxId">RUC/NIT</Label>
                    <Input
                      id="taxId"
                      value={config.company.taxId}
                      onChange={(e) =>
                        handleSaveSection("company", { taxId: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Logo de la empresa</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <Upload className="h-6 w-6 text-gray-400" />
                    </div>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Logo
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Configuración de reportes</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div>
                      <Label htmlFor="reportFormat">Formato</Label>
                      <Select
                        value={config.company.reportConfig.format}
                        onValueChange={(value) =>
                          handleSaveSection("company", {
                            reportConfig: {
                              ...config.company.reportConfig,
                              format: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PDF">PDF</SelectItem>
                          <SelectItem value="Excel">Excel</SelectItem>
                          <SelectItem value="CSV">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="reportFrequency">Frecuencia</Label>
                      <Select
                        value={config.company.reportConfig.frequency}
                        onValueChange={(value) =>
                          handleSaveSection("company", {
                            reportConfig: {
                              ...config.company.reportConfig,
                              frequency: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Diario">Diario</SelectItem>
                          <SelectItem value="Semanal">Semanal</SelectItem>
                          <SelectItem value="Mensual">Mensual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Colores corporativos</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="primaryColor">Color primario</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={config.company.branding.primaryColor}
                          onChange={(e) =>
                            handleSaveSection("company", {
                              branding: {
                                ...config.company.branding,
                                primaryColor: e.target.value,
                              },
                            })
                          }
                          className="w-12 h-8 p-0 border-0"
                        />
                        <Input
                          value={config.company.branding.primaryColor}
                          onChange={(e) =>
                            handleSaveSection("company", {
                              branding: {
                                ...config.company.branding,
                                primaryColor: e.target.value,
                              },
                            })
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor">Color secundario</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={config.company.branding.secondaryColor}
                          onChange={(e) =>
                            handleSaveSection("company", {
                              branding: {
                                ...config.company.branding,
                                secondaryColor: e.target.value,
                              },
                            })
                          }
                          className="w-12 h-8 p-0 border-0"
                        />
                        <Input
                          value={config.company.branding.secondaryColor}
                          onChange={(e) =>
                            handleSaveSection("company", {
                              branding: {
                                ...config.company.branding,
                                secondaryColor: e.target.value,
                              },
                            })
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleSaveSection("company", config.company)}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Información de Empresa
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuración del Sistema */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Configuración del Sistema
                </CardTitle>
                <CardDescription>
                  Configuración regional y límites del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timezone">Zona horaria</Label>
                    <Select
                      value={config.system.timezone}
                      onValueChange={(value) =>
                        handleSaveSection("system", { timezone: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Lima">
                          America/Lima (UTC-5)
                        </SelectItem>
                        <SelectItem value="America/Mexico_City">
                          America/Mexico_City (UTC-6)
                        </SelectItem>
                        <SelectItem value="America/Bogota">
                          America/Bogota (UTC-5)
                        </SelectItem>
                        <SelectItem value="America/Argentina/Buenos_Aires">
                          America/Argentina/Buenos_Aires (UTC-3)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Idioma</Label>
                    <Select
                      value={config.system.language}
                      onValueChange={(value) =>
                        handleSaveSection("system", { language: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateFormat">Formato de fecha</Label>
                    <Select
                      value={config.system.dateFormat}
                      onValueChange={(value) =>
                        handleSaveSection("system", { dateFormat: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timeFormat">Formato de hora</Label>
                    <Select
                      value={config.system.timeFormat}
                      onValueChange={(value) =>
                        handleSaveSection("system", { timeFormat: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">24 horas</SelectItem>
                        <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Configuración de backup</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="backupFrequency">Frecuencia</Label>
                      <Select
                        value={config.system.backup.frequency}
                        onValueChange={(value) =>
                          handleSaveSection("system", {
                            backup: {
                              ...config.system.backup,
                              frequency: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Diario">Diario</SelectItem>
                          <SelectItem value="Semanal">Semanal</SelectItem>
                          <SelectItem value="Mensual">Mensual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="backupLocation">Ubicación</Label>
                      <Select
                        value={config.system.backup.location}
                        onValueChange={(value) =>
                          handleSaveSection("system", {
                            backup: {
                              ...config.system.backup,
                              location: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Servidor Local">
                            Servidor Local
                          </SelectItem>
                          <SelectItem value="Nube">Nube</SelectItem>
                          <SelectItem value="Ambos">Ambos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Límites del sistema</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="maxUsers">Usuarios activos máximos</Label>
                      <Input
                        id="maxUsers"
                        type="number"
                        value={config.system.limits.maxActiveUsers}
                        onChange={(e) =>
                          handleSaveSection("system", {
                            limits: {
                              ...config.system.limits,
                              maxActiveUsers: Number.parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxEvents">
                        Eventos simultáneos máximos
                      </Label>
                      <Input
                        id="maxEvents"
                        type="number"
                        value={config.system.limits.maxSimultaneousEvents}
                        onChange={(e) =>
                          handleSaveSection("system", {
                            limits: {
                              ...config.system.limits,
                              maxSimultaneousEvents: Number.parseInt(
                                e.target.value
                              ),
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleSaveSection("system", config.system)}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración del Sistema
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  );
}
