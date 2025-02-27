import { ReactNode, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { Menu, Search, X , Bell as Notification} from "lucide-react";
import { Home, User, Calendar, Map, Leaf, DollarSign, Bug, Clipboard, Cpu } from "lucide-react";
import { Link } from "react-router-dom";  

interface LayoutProps {
  children: ReactNode;
}

const menuItems = [
  { name: "Home", icon: <Home size={18} />, path: "/" },
  { name: "Usuarios", icon: <User size={18} />, path: "/usuarios" },
  { name: "Calendario", icon: <Calendar size={18} />, path: "/calendario" },
  { name: "Mapa", icon: <Map size={18} />, path: "/mapa" },
  { name: "Cultivos", icon: <Leaf size={18} />, path: "/cultivos" },
  { name: "Finanzas", icon: <DollarSign size={18} />, path: "/finanzas" },
  { name: "Plagas", icon: <Bug size={18} />, path: "/plagas" },
  { name: "Inventario", icon: <Clipboard size={18} />, path: "/inventario" },
  { name: "IoT", icon: <Cpu size={18} />, path: "/iot" },
];

export default function Principal({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [active, setActive] = useState("");

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <div
        className={`bg-white p-4 flex flex-col w-64 h-screen fixed top-0 left-0 z-50
          border-t-4 border-r-4 rounded-tr-3xl transition-all duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}`}
      >
        <div className="flex justify-between items-center">
          <img src="../../public/logo_proyecto-removebg-preview.png" alt="logo" width={180} />
          <Button isIconOnly variant="light" onClick={() => setSidebarOpen(false)}>
            <X size={30} />
          </Button>
        </div>

        {/* Menú */}
        <nav className="mt-4 space-y-2 text-center text-lg">
          {menuItems.map((item) => (
            <Link to={item.path} key={item.name} onClick={() => setActive(item.name)}>
              <button
                className={`flex items-center gap-3 w-full shadow-lg p-4 bg-white px-4 py-3 text-center rounded-full transition-all duration-300
                  ${active === item.name ? "bg-gray-300 text-gray-800 shadow-inner" : "bg-white hover:bg-gray-200"}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            </Link>
          ))}
        </nav>

        {/* Logo sena */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <img src="../../public/logoSena.png" alt="SENA" className="w-16" />
        </div>
      </div>

      {/* Contenedor principal (Navbar + Contenido) */}
      <div className={`flex flex-col transition-all duration-300 w-full ${sidebarOpen ? "pl-64" : "pl-0"}`}>
        {/* Navbar */}
        <div className="fixed top-0 left-0 w-full bg-green-700 text-white p-4 flex justify-between items-center z-40 transition-all duration-300">
          <div className={`flex items-center transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
            <Button isIconOnly variant="light" className="text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={20} />
            </Button>
            <Input className="hidden md:block w-64 ml-4" placeholder="Buscar..." endContent={<Search size={25} className="text-green-700" />} />
          </div>
          <div className="flex items-center space-x-4">
            {/* Icono de Notificación */}
            <Notification size={24} className="text-white" />
            <p> | </p>

            {/* Icono de Usuario */}
            <User size={24} className="text-white" />

            {/* Nombre del Usuario */}
            <span className="text-white">Nombre del Usuario</span>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="mt-16 p-6 transition-all duration-300">{children}</div>
      </div>
    </div>
  );
}
