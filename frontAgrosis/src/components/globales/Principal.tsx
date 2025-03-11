import { ReactNode, useState } from "react";
import { Button, Input } from "@heroui/react";
import { Menu, Search, Bell as Notification, ChevronDown, ChevronUp } from "lucide-react";
import { Home, User, Calendar, Map, Leaf, DollarSign, Bug, LogOut, Clipboard, Cpu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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
    name: "Cultivos",
    icon: <Leaf size={18} />,
    submenu: [
      { name: "Eras", path: "/eras" },
      { name: "Lotes", path: "/lotes" },
      { name: "Cultivos", path: "/cultivos" },
      { name: "Especies", path: "/especies" },
      { name: "Semilleros", path: "/semilleros" },
      { name: "Residuos", path: "/residuos" },
    ],
  },
  {
    name: "Finanzas",
    icon: <DollarSign size={18} />,
    submenu: [
      { name: "Ventas", path: "/ventas" },
      { name: "Producción", path: "/produccion" },
    ],
  },
  {
    name: "Plagas",
    icon: <Bug size={18} />,
    submenu: [
      { name: "Control Fitosanitario", path: "/control-fitosanitario" },
      { name: "PEA", path: "/pea" },
    ],
  },
  {
    name: "Inventario",
    icon: <Clipboard size={18} />,
    submenu: [
      { name: "Insumos", path: "/insumos" },
      { name: "Herramientas", path: "/herramientas" },
    ],
  },
  { name: "IoT", icon: <Cpu size={18} />, path: "/iot" },
];

export default function Principal({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [active, setActive] = useState<string>("");
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted: ", searchQuery);
  };

  return (
    <div className="flex h-screen w-full bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/frontAgrosis/public/fondo.jpg')" }}>
      <div
        className={`bg-white p-4 flex flex-col w-64 h-full fixed top-0 left-0 z-50 border-t-4 border-r-4 rounded-tr-3xl transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}`}
      >
        <div className="flex justify-between items-center">
          <img src="/logo_proyecto-removebg-preview.png" alt="logo" width={180} />
        </div>

        <nav className="mt-4 text-center text-lg flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.submenu ? (
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={`flex items-center gap-3 w-full shadow-lg p-4 rounded-full transition-all duration-300 ${active === item.name ? "bg-gray-300 text-gray-800 shadow-inner" : "bg-white hover:bg-gray-200"} mb-2`}
                >
                  {item.icon}
                  <span className="flex-grow text-left">{item.name}</span>
                  {openMenus[item.name] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              ) : (
                <Link to={item.path} onClick={() => setActive(item.name)}>
                  <button
                    className={`flex items-center gap-3 w-full shadow-lg p-4 rounded-full transition-all duration-300 ${active === item.name ? "bg-gray-300 text-gray-800 shadow-inner" : "bg-white hover:bg-gray-200"} mb-2`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </button>
                </Link>
              )}

              {item.submenu && openMenus[item.name] && (
                <div className="ml-6 mt-2">
                  {item.submenu.map((subItem) => (
                    <Link to={subItem.path} key={subItem.name} onClick={() => setActive(subItem.name)}>
                      <button
                        className={`block w-full text-left p-3 rounded-lg transition-all duration-300 ${active === subItem.name ? "bg-gray-200 text-gray-900" : "hover:bg-gray-100"}`}
                      >
                        {subItem.name}
                      </button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full shadow-lg p-4 rounded-full transition-all duration-300 bg-white hover:bg-red-500 text-black hover:text-white mt-28"
          >
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </nav>

        <div className="mt-auto flex justify-center items-center">
          <div className="bottom-4 left-1/2 transform -translate-x-1/2">
            <img src="/logoSena.png" alt="SENA" className="w-16" />
          </div>
        </div>
      </div>

      <div className={`flex flex-col transition-all duration-300 w-full ${sidebarOpen ? "pl-64" : "pl-0"}`}>
        <div className="fixed top-0 left-0 w-full bg-green-700 text-white p-4 flex justify-between items-center z-40 transition-all duration-300">
          <div className={`flex items-center transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
            <Button isIconOnly variant="light" className="text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={20} />
            </Button>
            <form onSubmit={handleSearchSubmit}>
              <Input
                className="hidden md:block w-64 ml-4"
                placeholder="Buscar..."
                endContent={<Search size={25} className="text-green-700" />}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </form>
          </div>
          <div className="flex items-center space-x-4">
            <Notification size={24} className="text-white" />
            <p> | </p>
            <User size={24} className="text-white" />
            <span
              className="text-white cursor-pointer hover:text-yellow-100"
              onClick={() => navigate("/usuarios")}
            >
              Nombre del Usuario
            </span>
          </div>
        </div>

        <div
          className="mt-16 p-6 transition-all duration-300"
          style={{
            backgroundImage: "url('/fondo.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div style={{ minHeight: "100vh" }}>
            {children}
          </div>
        </div>

        <div className="bottom-0 left-0 w-full bg-green-700 text-white p-4 z-40 transition-all duration-300">
          <p className="text-center w-full">Agrosoft © 2025 Todos los derechos reservados.</p>
          <p className="text-center w-full">Centro de Gestion y Desarrollo Surcolombiano </p>
        </div>  
      </div>
    </div>
  );
}
