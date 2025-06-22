// contexts/auth-context.tsx
"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  avatar?: string;
  lastAccess?: string;
  createdAt: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginError: string | null;
  isInitialized: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credenciales de prueba
const TEST_USERS = [
  {
    id: "1",
    email: "admin@eventos.com",
    password: "admin123",
    name: "Admin Usuario",
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
    email: "gestor@eventos.com",
    password: "gestor123",
    name: "Gestor Eventos",
    role: "Gestor",
    status: "Activo",
    phone: "+1234567891",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAccess: "2024-01-20 09:15:00",
    createdAt: "2024-01-05",
    permissions: [
      "events.create",
      "events.edit",
      "events.delete",
      "tickets.create",
      "tickets.edit",
      "stats.view",
    ],
  },
  {
    id: "3",
    email: "operador@eventos.com",
    password: "operador123",
    name: "Operador Sistema",
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
    email: "consulta@eventos.com",
    password: "consulta123",
    name: "Usuario Consulta",
    role: "Solo Lectura",
    status: "Activo",
    phone: "+1234567893",
    avatar: "/placeholder.svg?height=32&width=32",
    lastAccess: "2024-01-19 16:20:00",
    createdAt: "2024-01-15",
    permissions: ["dashboard.view", "stats.view"],
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Verificar sesión existente al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem("eventmanager_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("eventmanager_user");
      }
    }
    setIsInitialized(true);
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<boolean> => {
    setIsLoading(true);
    setLoginError(null);

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const foundUser = TEST_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        status: foundUser.status,
        phone: foundUser.phone,
        avatar: foundUser.avatar,
        lastAccess: foundUser.lastAccess,
        createdAt: foundUser.createdAt,
        permissions: foundUser.permissions,
      };

      setUser(userData);

      if (rememberMe) {
        localStorage.setItem("eventmanager_user", JSON.stringify(userData));
      }

      setIsLoading(false);
      return true;
    } else {
      setLoginError(
        "Credenciales incorrectas. Verifica tu email y contraseña."
      );
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("eventmanager_user");
    setLoginError(null);
    router.push("/login");
  };

  const clearError = () => {
    setLoginError(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return (
      user.permissions.includes("all") || user.permissions.includes(permission)
    );
  };

  const isAdmin = (): boolean => {
    return user?.role === "Administrador" || false;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    loginError,
    isInitialized,
    login,
    logout,
    clearError,
    hasPermission,
    isAdmin,
  };

  // No renderizar hasta que se inicialice
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
