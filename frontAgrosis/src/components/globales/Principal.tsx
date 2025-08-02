import { ReactNode, useState } from "react";
import { Button } from "@heroui/react";
import { Menu, ChevronDown, ChevronUp, LogOut, Copyright } from "lucide-react";
import { Home, User, Calendar, Map, Leaf, DollarSign, Bug, Clipboard, Cpu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Notification from '@/components/trazabilidad/notificacion/Notificacion';
import { useAuthContext } from "@/context/AuthContext";
import { showToast } from "./Toast";

interface LayoutProps {
  children: ReactNode;
}

const menuItems = [
  { name: "Home", icon: <Home size={18} />, path: "/Home" },
  { name: "Usuarios", icon: <User size={18} />, path: "/usuarios" },
  {
    name: "Calendario",
    icon: <Calendar size={18} />,
    submenu: [
      { name: "Actividad", path: "/actividad" },
      { name: "Calendario Lunar", path: "/calendario-lunar" },
    ],
  },
  { name: "Mapa", icon: <Map size={18} />, path: "/mapa" },
  {
    name: "Cultivo",
    icon: <Leaf size={18} />,
    submenu: [
      { name: "Eras", path: "/eras" },
      { name: "Lotes", path: "/lotes" },
      { name: "Cultivos", path: "/cultivo" }, 
      { name: "Especies", path: "/especies" },
      { name: "Residuos", path: "/residuos" },
      { name: "Plantacion", path: "/plantacion" },
      { name: "Semilleros", path: "/semilleros" },
    ],
  },
  {
    name: "Finanzas",
    icon: <DollarSign size={18} />,
    submenu: [
      { name: "Stock", path: "/stock" },
      { name: "Beneficio Costo", path: "/diario" },
      { name: "Pagos", path: "/nomina" },
    ],
  },
  {
    name: "Plagas",
    icon: <Bug size={18} />,
    submenu: [
      { name: "Control Fitosanitario", path: "/control-fitosanitario" },
    ],
  },
  {
    name: "Inventario",
    icon: <Clipboard size={18} />,
    submenu: [
      { name: "Bodega", path: "/bodega" },
    ],
  },
  {
    name: "IoT",
    icon: <Cpu size={18} />,
    path: "/iot",
    submenu: [
      { name: "Sensores", path: "/iot/sensores" },
    ],
  },
  { name: "Reportes", icon: <Cpu size={18} />, path: "/reportes" },
];

export default function Principal({ children }: LayoutProps) {
  const { usuario, logout  } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [active, setActive] = useState<string>("");
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    showToast({
      title: "Sesión cerrada",
      description: "Cerraste la sesion ¡Vuelve Pronto!",
      timeout: 4000,
      variant: "error"
    });
    navigate("/");
  };

type Rol = "Invitado" | "Aprendiz" | "Pasante" | "SinRol" | "Administrador" | "Instructor";

// 2. Permisos definidos por rol
const permisosPorRol: Record<Rol, string[]> = {
  Invitado: ["Home"],
  Aprendiz: menuItems
    .filter(item => !["Inventario", "IoT"].includes(item.name))
    .map(item => item.name),
  Pasante: menuItems
    .filter(item => !["IoT"].includes(item.name))
    .map(item => item.name),
  SinRol: [],
  Administrador: menuItems.map(item => item.name),
  Instructor: menuItems.map(item => item.name),
};

// 3. Detectar rol actual del usuario
const rolUsuario: Rol = (usuario?.rol as Rol) || "SinRol";

// 4. Filtrar menú principal y submenús según permisos
const modulosPermitidos = menuItems
  .filter(item => permisosPorRol[rolUsuario]?.includes(item.name))
  .map(item => {
    if (item.name === "Finanzas" && ["Aprendiz", "Pasante"].includes(rolUsuario)) {
      return {
        ...item,
        submenu: item.submenu?.filter(subItem => subItem.name === "Stock"),
      };
    }
    return {
      ...item,
      submenu: item.submenu,
    };
  });

  return (
    <div className="relative flex h-screen w-full overflow-x-hidden">
      {/* Imagen de fondo con opacidad */}
      <div className="absolute inset-0">
        <img src="/fondo.jpg" alt="Fondo" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      
      {/* Sidebar */}
      <div
        className={`bg-white p-2 overflow-auto sm:p-4 flex flex-col w-48 sm:w-64 h-full fixed top-0 left-0 z-20 border-t-4 border-r-4 rounded-tr-3xl transition-all duration-300 ${
          sidebarOpen 
            ? "translate-x-0 shadow-lg" 
            : "-translate-x-full sm:-translate-x-64"
        }`}
      >
        {/* Logos del proyecto */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg">
          <img 
            src="/logoSena.png" 
            alt="SENA" 
            className="w-14 sm:w-16"
          />       
          <img 
            src="/agrosoft.png" 
            alt="logo" 
            className="w-20 sm:w-28"
          />
        </div>

        <nav className="mt-4 text-center text-base sm:text-lg flex-1 overflow-y-auto">
          {modulosPermitidos.map((item) => (
            <div key={item.name}>
              {item.submenu ? (
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={`flex items-center gap-3 w-full shadow-lg p-3 sm:p-4 rounded-2xl transition-all duration-300 ${
                    active === item.name
                      ? "bg-gray-300 text-gray-800 shadow-inner"
                      : "bg-white hover:bg-gray-200"
                  } mb-2`}
                >
                  {item.icon}
                  <span className="flex-grow text-left">{item.name}</span>
                  {openMenus[item.name] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              ) : (
                
                  <Link
                    to={item.path ?? "#"}
                    onClick={() => {
                      setActive(item.name);
                      setSidebarOpen(false);
                    }}
                  >
                    <button
                      className={`flex items-center gap-3 w-full shadow-lg p-3 sm:p-4 rounded-2xl transition-all duration-300 ${
                        active === item.name
                          ? "bg-gray-300 text-gray-800 shadow-inner"
                          : "bg-white hover:bg-gray-200"
                      } mb-2`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </button>
                  </Link>
              )}

              {item.submenu && openMenus[item.name] && (
                <div className="ml-4 sm:ml-6 mt-2">
                  {item.submenu.map((subItem) => (
                    <Link
                      to={subItem.path}
                      key={subItem.name}
                      onClick={() => {
                        setActive(subItem.name);
                        setSidebarOpen(false);
                      }}
                    >
                      <button
                        className={`block w-full text-left p-2 sm:p-3 rounded-lg transition-all duration-300 ${
                          active === subItem.name
                            ? "bg-gray-200 text-gray-900"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {subItem.name}
                      </button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido Principal */}
      <div className={`flex flex-col transition-all duration-300 w-full ${
        sidebarOpen ? "sm:pl-64" : ""
      }`}>
      {/* Barra de navegación superior */}
      <div className="fixed top-0 left-0 w-full bg-green-700 text-white pe-9 sm:p-2 lg:p-4 flex items-center z-40 transition-all duration-300" style={{ zIndex: 10 }}>
        {/* Botón del menú - Se mueve solo en desktop */}
        <div className={`transition-all duration-300 ${sidebarOpen ? 'sm:translate-x-64' : 'sm:translate-x-0'}`}>
          <Button 
            isIconOnly 
            variant="light" 
            className="text-white" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} />
          </Button>
        </div>

        {/* Título - Comportamiento responsive */}
        <div className="flex-1 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 text-center px-2 overflow-hidden">
          <h1 className="sm:text-base lg:text-3xl font-semibold truncate">
            Bienvenido a AgroSoft 🌱
          </h1>
          {/* Nombre del usuario solo en móviles */}
          {usuario && (
            <p className="text-xs sm:hidden truncate" onClick={() => navigate("/perfil")}>
              {usuario.nombre} {usuario.apellido}
            </p>
          )}
        </div>

        {/* Sección derecha */}
        <div className="flex items-center space-x-2 sm:space-x-4 ml-auto">
          <Notification />
          <p className="hidden sm:block"> | </p>
          {/* Avatar solo visible en desktop */}
          <div className="hidden sm:flex items-center space-x-2">
            <img
              src={usuario?.img_url || 'http://localhost:8000/media/imagenes/defecto.jpg'}
              alt="Foto de perfil"
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('defecto.png')) {
                  target.src = 'http://localhost:8000/media/imagenes/defecto.jpg';
                }
              }}
            />
            <span
              className="text-white cursor-pointer hover:text-yellow-100 text-sm sm:text-base"
              onClick={() => navigate("/perfil")}
            >
              {usuario
                ? `${usuario?.nombre?.split(' ')[0] || ""} ${usuario?.apellido?.split(' ')[0] || ""}`
                : "Usuario"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-2 sm:px-4 py-2 hover:text-yellow-100 text-white"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

        {/* Contenido de la página */}
        <div className="flex flex-col min-h-[calc(100vh-3rem)] pt-16 sm:pt-16 z-0">
          <div className="flex-1 p-2 sm:p-6 mb-10 overflow-auto">
            {children}
          </div>
          
          {/* Footer */}
          <footer className="fixed bottom-0 left-0 w-full bg-green-700 text-white p-2 text-center text-xs sm:text-sm">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 flex-wrap justify-center">
                <span className="whitespace-normal">
                  Centro de Gestión y Desarrollo Sostenible Surcolombiano
                </span>
                <Copyright size={12} />
                <span>{new Date().getFullYear()}</span>
              </div>
              <div className="text-xs sm:text-sm">Regional Pitalito-Huila</div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}