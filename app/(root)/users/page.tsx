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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Download,
  Mail,
  Shield,
  Eye,
  Users,
  Calendar,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@/contexts/auth-context";
import { useSystem } from "@/contexts/system-context";
import { toast } from "sonner";

export default function UsersPage() {
  const { user, isAdmin } = useAuth();
  const {
    users,
    addUser,
    updateUser,
    deleteUser,
    deleteUsers,
    updateUsersStatus,
  } = useSystem();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Operador",
    status: "Activo",
    permissions: [] as string[],
  });

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

  const roles = ["Administrador", "Gestor", "Operador", "Solo Lectura"];
  const statuses = ["Activo", "Inactivo", "Bloqueado", "Pendiente"];

  const permissionsByRole = {
    Administrador: ["all"],
    Gestor: [
      "events.create",
      "events.edit",
      "events.delete",
      "tickets.create",
      "tickets.edit",
      "stats.view",
    ],
    Operador: ["tickets.validate", "tickets.view"],
    "Solo Lectura": ["dashboard.view", "stats.view"],
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Administrador":
        return "bg-red-100 text-red-800";
      case "Gestor":
        return "bg-blue-100 text-blue-800";
      case "Operador":
        return "bg-green-100 text-green-800";
      case "Solo Lectura":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "bg-green-100 text-green-800";
      case "Inactivo":
        return "bg-yellow-100 text-yellow-800";
      case "Bloqueado":
        return "bg-red-100 text-red-800";
      case "Pendiente":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCreateUser = () => {
    const userData = {
      ...newUser,
      permissions:
        permissionsByRole[newUser.role as keyof typeof permissionsByRole] || [],
    };
    addUser(userData);
    setNewUser({
      name: "",
      email: "",
      phone: "",
      role: "Operador",
      status: "Activo",
      permissions: [],
    });
    setIsCreateDialogOpen(false);
    toast("Usuario creado", {
      description: "El usuario ha sido creado exitosamente.",
    });
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      updateUser(editingUser.id, editingUser);
      setEditingUser(null);
      toast("Usuario actualizado", {
        description: "Los datos del usuario han sido actualizados.",
      });
    }
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    toast("Usuario eliminado", {
        description: "El usuario ha sido eliminado del sistema.",
        });
  };

  const handleDeleteSelectedUsers = () => {
    deleteUsers(selectedUsers);
    setSelectedUsers([]);
    toast(`${selectedUsers.length} usuarios han sido eliminados.`, {
        description: "Usuarios eliminados",
    });
  };

  const handleBulkStatusChange = (status: string) => {
    updateUsersStatus(selectedUsers, status);
    setSelectedUsers([]);
    toast("Estado actualizado", {
      description: `Estado de ${selectedUsers.length} usuarios actualizado a ${status}.`
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
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
                <BreadcrumbPage>Usuarios</BreadcrumbPage>
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
              Gestión de Usuarios
            </h1>
            <p className="text-muted-foreground">
              Administra usuarios y permisos del sistema
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                  <DialogDescription>
                    Completa la información para crear un nuevo usuario
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="userName">Nombre completo</Label>
                      <Input
                        id="userName"
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="userEmail">Email</Label>
                      <Input
                        id="userEmail"
                        type="email"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        placeholder="usuario@email.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="userPhone">Teléfono</Label>
                      <Input
                        id="userPhone"
                        value={newUser.phone}
                        onChange={(e) =>
                          setNewUser({ ...newUser, phone: e.target.value })
                        }
                        placeholder="+1234567890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="userRole">Rol</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value) =>
                          setNewUser({ ...newUser, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="userStatus">Estado inicial</Label>
                    <Select
                      value={newUser.status}
                      onValueChange={(value) =>
                        setNewUser({ ...newUser, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateUser}>
                    Crear Usuario
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
                Total Usuarios
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                Usuarios registrados
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Usuarios Activos
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.status === "Activo").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(
                  (users.filter((u) => u.status === "Activo").length /
                    users.length) *
                    100
                )}
                % del total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Administradores
              </CardTitle>
              <Shield className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.role === "Administrador").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Con acceso completo
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Nuevos este mes
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                +50% vs mes anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedUsers.length} seleccionados
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Acciones masivas
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => handleBulkStatusChange("Activo")}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Activar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleBulkStatusChange("Inactivo")}
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Desactivar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleBulkStatusChange("Bloqueado")}
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Bloquear
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar email
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar seleccionados
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          ¿Eliminar usuarios seleccionados?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción eliminará permanentemente{" "}
                          {selectedUsers.length} usuarios del sistema. Esta
                          acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteSelectedUsers}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
            <CardDescription>
              {filteredUsers.length} usuarios encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedUsers.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último acceso</TableHead>
                  <TableHead>Fecha registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) =>
                          handleSelectUser(user.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.phone}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        {user.lastAccess || "Nunca"}
                      </div>
                    </TableCell>
                    <TableCell>{user.createdAt}</TableCell>
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
                          <DropdownMenuItem
                            onClick={() => setEditingUser(user)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver perfil
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setEditingUser(user)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Enviar email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              updateUser(user.id, {
                                status:
                                  user.status === "Activo"
                                    ? "Inactivo"
                                    : "Activo",
                              })
                            }
                          >
                            {user.status === "Activo" ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Desactivar
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  ¿Eliminar usuario?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción eliminará permanentemente a{" "}
                                  {user.name} del sistema. Esta acción no se
                                  puede deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>
                Modifica la información del usuario
              </DialogDescription>
            </DialogHeader>
            {editingUser && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editName">Nombre completo</Label>
                    <Input
                      id="editName"
                      value={editingUser.name}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="editEmail">Email</Label>
                    <Input
                      id="editEmail"
                      type="email"
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editPhone">Teléfono</Label>
                    <Input
                      id="editPhone"
                      value={editingUser.phone}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="editRole">Rol</Label>
                    <Select
                      value={editingUser.role}
                      onValueChange={(value) =>
                        setEditingUser({ ...editingUser, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="editStatus">Estado</Label>
                  <Select
                    value={editingUser.status}
                    onValueChange={(value) =>
                      setEditingUser({ ...editingUser, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Información adicional</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                    <div>
                      <span className="font-medium">Último acceso:</span>
                      <p className="text-muted-foreground">
                        {editingUser.lastAccess || "Nunca"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Fecha de registro:</span>
                      <p className="text-muted-foreground">
                        {editingUser.createdAt}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" onClick={handleUpdateUser}>
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarInset>
  );
}
