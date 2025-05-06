import { ReactNode, useState, useEffect } from "react";
import { Button, Input } from "@heroui/react";
import { Menu, Search, Bell as Notification, ChevronDown, ChevronUp } from "lucide-react";
import { Home, User, Calendar, Map, Leaf, DollarSign, Bug, LogOut, Clipboard, Cpu, Copyright } from "lucide-react";
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
    name: "Cultivo",
    icon: <Leaf size={18} />,
    submenu: [
      { name: "Eras", path: "/eras" },
      { name: "Lotes", path: "/lotes" },
      /*{ name: "Cultivos", path: "/cultivo" }, */
      { name: "Especies", path: "/especies" },
      { name: "Residuos", path: "/residuos" },
      { name: "Plantacion", path: "/plantacion"},
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
    ],
  },
  {
    name: "Inventario",
    icon: <Clipboard size={18} />,
    submenu: [
      { name: "Insumos", path: "/insumos" },
      { name: "Herramientas", path: "/herramientas" },
      { name: "Bodega", path: "/bodega" },
    ],
  },
  { name: "IoT", icon: <Cpu size={18} />, path: "/iot" },
  { name: "Reportes", icon: <Cpu size={18} />, path: "/reportes" },
];

export default function Principal({ children }: LayoutProps) {
  const [usuario, setUsuario] = useState<{ nombre: string; apellido: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [active, setActive] = useState<string>("");
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("user");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    alert("Sesión finalizada. Por favor, vuelve a iniciar sesión."); 
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
    <div className="relative flex h-screen w-full overflow-x-hidden">
    {/* Imagen de fondo con opacidad */}
    <div className="absolute inset-0">
      <img src="/fondo.jpg" alt="Fondo" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black opacity-50"></div>
    </div>
      {/* Sidebar */}
      <div
        className={`bg-white p-2 overflow-auto sm:p-4 flex flex-col w-48 sm:w-64 h-full fixed top-0 left-0 z-50 border-t-4 border-r-4 rounded-tr-3xl rounded-br-3xl transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-48 sm:-translate-x-64"
        }`}
      >
        {/*logos del proyecto*/ }
        <div className="flex items-center justify-center p-4 bg-white rounded-lg ">
          <img 
            src="/logoSena.png" 
            alt="SENA" 
            className="w-16 shadow-sm"
          />       
          <img 
            src="/logo_proyecto-removebg-preview.png" 
            alt="logo" 
            className="w-32  shadow-sm"
          />
        </div>


        <nav className="mt-4 text-center text-base sm:text-lg flex-1 overflow-y-auto z-30">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.submenu ? (
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={`flex items-center gap-3 w-full shadow-lg p-3 sm:p-4 rounded-full transition-all duration-300 ${
                    active === item.name ? "bg-gray-300 text-gray-800 shadow-inner" : "bg-white hover:bg-gray-200"
                  } mb-2`}
                >
                  {item.icon}
                  <span className="flex-grow text-left">{item.name}</span>
                  {openMenus[item.name] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              ) : (
                <Link to={item.path} onClick={() => setActive(item.name)}>
                  <button
                    className={`flex items-center gap-3 w-full shadow-lg p-3 sm:p-4 rounded-full transition-all duration-300 ${
                      active === item.name ? "bg-gray-300 text-gray-800 shadow-inner" : "bg-white hover:bg-gray-200"
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
                    <Link to={subItem.path} key={subItem.name} onClick={() => setActive(subItem.name)}>
                      <button
                        className={`block w-full text-left p-2 sm:p-3 rounded-lg transition-all duration-300 ${
                          active === subItem.name ? "bg-gray-200 text-gray-900" : "hover:bg-gray-100"
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

      {/* Contenido Principal */}
      <div className={`flex flex-col transition-all duration-300 w-full ${sidebarOpen ? "pl-48 sm:pl-64" : "pl-0"}`}>
        <div
          className="fixed top-0 left-0 w-full bg-green-700 text-white p-2 sm:p-4 flex justify-between items-center z-40 transition-all duration-300"
          style={{ zIndex: 40 }}
        >
          <div className={`flex items-center transition-all duration-300 ${sidebarOpen ? "ml-48 sm:ml-64" : "ml-0"}`}>
            <Button isIconOnly variant="light" className="text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={20} />
            </Button>
            <form onSubmit={handleSearchSubmit}>
              <Input
                className="w-48 sm:w-64 ml-2 "
                endContent={<Search size={20} className="ml-2 text-green-700" />}
                placeholder="Buscar..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </form>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            <div><Notification size={20} className="text-white" 
            onClick={() => navigate("/usuarios")}/></div>
            
            <p className="hidden sm:block"> | </p>
            <User size={20} className="text-white" />
            <span
              className="text-white cursor-pointer hover:text-yellow-100 text-sm sm:text-base"
              onClick={() => navigate("/usuarios")}
            >
              {usuario ? `${usuario?.nombre || "Nombre no disponible"} ${usuario?.apellido || "Apellido no disponible"}` : "Usuario no identificado"}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2  hover:text-yellow-100 text-white"
            >
              <LogOut size={18} />
            </button>
          </div>

        </div>
        <div className="flex flex-col min-h-[calc(100vh-3rem)] mt-12 sm:mt-16m z-20">
          <div className="flex-1 p-2 sm:p-6 overflow-auto">
            {children}
          </div>
          
          {/* Footer ajustado */}
          <footer className="fixed bottom-0 left-0 w-full bg-green-700 text-white p-2 text-center text-sm z-40">
            <div className="flex flex-col items-center justify-center text-md">
              <div className="flex items-center gap-1">
                Centro de Gestión y Desarrollo Sostenible Surcolombiano <Copyright size={12} />
              </div>
              <div>Regional Pitalito-Huila</div>
            </div>
        </footer>
        </div>

      </div>
    </div>
  );
}
