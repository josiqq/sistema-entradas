"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Ticket, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const { login, isLoading, loginError, clearError, isAuthenticated } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  // Clear errors when the user starts typing
  useEffect(() => {
    if (loginError) {
      clearError()
    }
  }, [formData.email, formData.password, clearError, loginError])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return "El email es requerido"
    if (!emailRegex.test(email)) return "Formato de email inválido"
    return ""
  }

  const validatePassword = (password: string) => {
    if (!password) return "La contraseña es requerida"
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres"
    return ""
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Real-time validation
    if (field === "email" && typeof value === "string") {
      setFieldErrors((prev) => ({ ...prev, email: validateEmail(value) }))
    }
    if (field === "password" && typeof value === "string") {
      setFieldErrors((prev) => ({ ...prev, password: validatePassword(value) }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate fields
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)

    setFieldErrors({
      email: emailError,
      password: passwordError,
    })

    if (emailError || passwordError) return

    const success = await login(formData.email, formData.password, formData.rememberMe)
    if (success) {
      router.push("/") // Redirect to dashboard on successful login
    }
  }

  const isFormValid = !fieldErrors.email && !fieldErrors.password && formData.email && formData.password

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Ticket className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">EventManager Pro</h1>
          <p className="text-gray-600 mt-2">Sistema de Gestión de Entradas</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para acceder al dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@eventos.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 ${fieldErrors.email ? "border-red-500 focus:border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 pr-10 ${fieldErrors.password ? "border-red-500 focus:border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Recordar sesión
                </Label>
              </div>

              {/* Error Message */}
              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={!isFormValid || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <button type="button" className="text-sm text-primary hover:underline" disabled={isLoading}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Test Credentials */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-sm text-blue-900 mb-3">Credenciales de Prueba:</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div>
                <strong>Admin:</strong> admin@eventos.com / admin123
              </div>
              <div>
                <strong>Gestor:</strong> gestor@eventos.com / gestor123
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}