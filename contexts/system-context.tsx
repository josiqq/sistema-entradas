"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface SystemConfig {
  events: {
    maxTicketsPerEvent: number
    ticketTypes: string[]
    ticketStatuses: string[]
    qrPrefixes: Record<string, string>
    expirationHours: number
  }
  notifications: {
    adminEmail: string
    emailTemplates: Record<string, string>
    autoNotifications: string[]
    smtpConfig: {
      server: string
      port: number
      username: string
      password: string
    }
  }
  company: {
    name: string
    logo: string
    address: string
    phone: string
    taxId: string
    legalName: string
    reportConfig: {
      format: string
      frequency: string
      recipients: string[]
    }
    branding: {
      primaryColor: string
      secondaryColor: string
      logoUrl: string
    }
  }
  system: {
    timezone: string
    dateFormat: string
    timeFormat: string
    language: string
    backup: {
      frequency: string
      location: string
    }
    limits: {
      maxActiveUsers: number
      maxSimultaneousEvents: number
    }
  }
}

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  phone?: string
  avatar?: string
  lastAccess?: string
  createdAt: string
  permissions: string[]
}

interface SystemContextType {
  config: SystemConfig
  users: User[]
  updateConfig: (section: keyof SystemConfig, data: any) => void
  resetConfig: () => void
  addUser: (user: Omit<User, "id" | "createdAt">) => void
  updateUser: (id: string, user: Partial<User>) => void
  deleteUser: (id: string) => void
  deleteUsers: (ids: string[]) => void
  updateUserStatus: (id: string, status: string) => void
  updateUsersStatus: (ids: string[], status: string) => void
}

const SystemContext = createContext<SystemContextType | undefined>(undefined)

const DEFAULT_CONFIG: SystemConfig = {
  events: {
    maxTicketsPerEvent: 1000,
    ticketTypes: ["VIP", "General", "Estudiante", "Tercera Edad"],
    ticketStatuses: ["Disponible", "Vendida", "Usada", "Cancelada", "Bloqueada"],
    qrPrefixes: {
      VIP: "VIP",
      General: "GEN",
      Estudiante: "EST",
      "Tercera Edad": "3ED",
    },
    expirationHours: 24,
  },
  notifications: {
    adminEmail: "admin@eventos.com",
    emailTemplates: {
      welcome: "Bienvenido a EventManager Pro",
      confirmation: "Tu entrada ha sido confirmada",
      cancellation: "Tu entrada ha sido cancelada",
    },
    autoNotifications: ["ventas", "alertas_stock", "errores"],
    smtpConfig: {
      server: "smtp.gmail.com",
      port: 587,
      username: "noreply@eventos.com",
      password: "********",
    },
  },
  company: {
    name: "EventManager Pro",
    logo: "/placeholder.svg?height=60&width=200",
    address: "Av. Principal 123, Ciudad",
    phone: "+1234567890",
    taxId: "12345678901",
    legalName: "EventManager Pro S.A.C.",
    reportConfig: {
      format: "PDF",
      frequency: "Semanal",
      recipients: ["admin@eventos.com"],
    },
    branding: {
      primaryColor: "#3b82f6",
      secondaryColor: "#1e40af",
      logoUrl: "/placeholder.svg?height=60&width=200",
    },
  },
  system: {
    timezone: "America/Lima",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    language: "es",
    backup: {
      frequency: "Diario",
      location: "Servidor Local",
    },
    limits: {
      maxActiveUsers: 50,
      maxSimultaneousEvents: 20,
    },
  },
}

const DEFAULT_USERS: User[] = [
  {
    id: "1",
    name: "Admin Usuario",
    email: "admin@eventos.com",
    role: "Administrador",
    status: "Activo",
    phone: "+1234567890",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAccess: "2024-01-20 10:30:00",
    createdAt: "2024-01-01",
    permissions: ["all"],
  },
  {
    id: "2",
    name: "Gestor Eventos",
    email: "gestor@eventos.com",
    role: "Gestor",
    status: "Activo",
    phone: "+1234567891",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAccess: "2024-01-20 09:15:00",
    createdAt: "2024-01-05",
    permissions: ["events.create", "events.edit", "events.delete", "tickets.create", "tickets.edit", "stats.view"],
  },
  {
    id: "3",
    name: "Operador Sistema",
    email: "operador@eventos.com",
    role: "Operador",
    status: "Activo",
    phone: "+1234567892",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAccess: "2024-01-20 08:45:00",
    createdAt: "2024-01-10",
    permissions: ["tickets.validate", "tickets.view"],
  },
  {
    id: "4",
    name: "Usuario Consulta",
    email: "consulta@eventos.com",
    role: "Solo Lectura",
    status: "Activo",
    phone: "+1234567893",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAccess: "2024-01-19 16:20:00",
    createdAt: "2024-01-15",
    permissions: ["dashboard.view", "stats.view"],
  },
  {
    id: "5",
    name: "María García",
    email: "maria.garcia@eventos.com",
    role: "Gestor",
    status: "Inactivo",
    phone: "+1234567894",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAccess: "2024-01-18 14:20:00",
    createdAt: "2024-01-12",
    permissions: ["events.create", "events.edit", "tickets.create", "tickets.edit"],
  },
  {
    id: "6",
    name: "Carlos López",
    email: "carlos.lopez@eventos.com",
    role: "Operador",
    status: "Bloqueado",
    phone: "+1234567895",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAccess: "2024-01-17 11:45:00",
    createdAt: "2024-01-08",
    permissions: ["tickets.validate"],
  },
]

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG)
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS)

  // Cargar configuración guardada
  useEffect(() => {
    const savedConfig = localStorage.getItem("eventmanager_config")
    const savedUsers = localStorage.getItem("eventmanager_users")

    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig))
      } catch (error) {
        console.error("Error loading config:", error)
      }
    }

    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers))
      } catch (error) {
        console.error("Error loading users:", error)
      }
    }
  }, [])

  const updateConfig = (section: keyof SystemConfig, data: any) => {
    const newConfig = {
      ...config,
      [section]: { ...config[section], ...data },
    }
    setConfig(newConfig)
    localStorage.setItem("eventmanager_config", JSON.stringify(newConfig))
  }

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG)
    localStorage.setItem("eventmanager_config", JSON.stringify(DEFAULT_CONFIG))
  }

  const addUser = (userData: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    }
    const newUsers = [...users, newUser]
    setUsers(newUsers)
    localStorage.setItem("eventmanager_users", JSON.stringify(newUsers))
  }

  const updateUser = (id: string, userData: Partial<User>) => {
    const newUsers = users.map((user) => (user.id === id ? { ...user, ...userData } : user))
    setUsers(newUsers)
    localStorage.setItem("eventmanager_users", JSON.stringify(newUsers))
  }

  const deleteUser = (id: string) => {
    const newUsers = users.filter((user) => user.id !== id)
    setUsers(newUsers)
    localStorage.setItem("eventmanager_users", JSON.stringify(newUsers))
  }

  const deleteUsers = (ids: string[]) => {
    const newUsers = users.filter((user) => !ids.includes(user.id))
    setUsers(newUsers)
    localStorage.setItem("eventmanager_users", JSON.stringify(newUsers))
  }

  const updateUserStatus = (id: string, status: string) => {
    updateUser(id, { status })
  }

  const updateUsersStatus = (ids: string[], status: string) => {
    const newUsers = users.map((user) => (ids.includes(user.id) ? { ...user, status } : user))
    setUsers(newUsers)
    localStorage.setItem("eventmanager_users", JSON.stringify(newUsers))
  }

  const value = {
    config,
    users,
    updateConfig,
    resetConfig,
    addUser,
    updateUser,
    deleteUser,
    deleteUsers,
    updateUserStatus,
    updateUsersStatus,
  }

  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
}

export function useSystem() {
  const context = useContext(SystemContext)
  if (context === undefined) {
    throw new Error("useSystem must be used within a SystemProvider")
  }
  return context
}
