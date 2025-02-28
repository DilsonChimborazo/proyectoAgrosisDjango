"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/button";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import {
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaLeaf,
  FaSeedling,
  FaTachometerAlt,
  FaTree,
  FaDollarSign,
  FaBug,
  FaBox,
  FaCloudRain,
  FaTemperatureHigh,
} from "react-icons/fa";
import { GiProcessor } from "react-icons/gi";

const menuItems = [
  { id: 1, label: "Inicio", path: "/", icon: <FaHome /> },
  { id: 2, label: "docs", path: "/docs", icon: <FaUser /> },
  { id: 3, label: "Calendario", path: "/calendario", icon: <FaCalendarAlt /> },
  { id: 4, label: "Mapa", path: "/mapa", icon: <FaMapMarkerAlt /> },
  {
    id: 5,
    label: "Cultivos",
    icon: <FaLeaf />,
    subItems: [
      { id: 6, label: "Cultivo", path: "/cultivo/cultivo", icon: <FaSeedling /> },
      { id: 7, label: "Especies", path: "/cultivo/especies", icon: <FaTachometerAlt /> },
      { id: 8, label: "Tipo Especie", path: "/cultivo/tipoespecie/", icon: <FaTree /> },
      { id: 9, label: "Bancal", path: "/cultivo/bancal", icon: <FaTree /> },
      { id: 10, label: "Lotes", path: "/cultivo/lotes", icon: <FaTree /> },
      { id: 11, label: "Actividades", path: "/cultivo/actividades", icon: <FaTree /> },
    ],
  },
  { id: 12, label: "Finanzas", path: "/finanzas", icon: <FaDollarSign /> },
  { id: 13, label: "Plagas", path: "/plagas", icon: <FaBug /> },
  { id: 14, label: "Inventario", path: "/inventario", icon: <FaBox /> },
  {
    id: 15,
    label: "IoT",
    icon: <GiProcessor />,
    subItems: [
      { id: 16, label: "Evapotranspiración", path: "/iot/evapotranspiracion", icon: <FaCloudRain /> },
      { id: 17, label: "Sensores", path: "/iot/sensores", icon: <FaTachometerAlt /> },
      { id: 18, label: "Humedad", path: "/iot/humedad", icon: <FaTemperatureHigh /> },
    ],
  },
];

import LogoSena from "../assets/def_AGROSIS_LOGOTIC.png";
import Sena from "../assets/logo sena.png";

export default function Navbar({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) {
  return (
    <aside
      className={`h-screen bg-white shadow-lg transition-all duration-300 flex flex-col fixed top-0 bottom-0 z-50
      ${isOpen ? "w-64 p-4" : "w-20 p-2"} rounded-r-2xl`}
    >
      <div className="flex justify-between items-center">
        <Button isIconOnly variant="light" className="mb-4" onClick={toggleSidebar}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      <div className={`flex items-center justify-center transition-all ${!isOpen ? "hidden" : ""}`}>
        <img src={LogoSena} alt="Logo Sena" className="w-40 transition-all" />
      </div>

      <nav className="flex flex-col mt-6 gap-4">
        {menuItems.map((item) => (
          <SidebarItem key={item.id} item={item} isOpen={isOpen} />
        ))}
      </nav>

      <div className={`mt-auto flex items-center justify-center transition-all ${!isOpen ? "hidden" : ""}`}>
        <img src={Sena} alt="Logo Sena" className="w-20 transition-all" />
      </div>
    </aside>
  );
}

/* Componente de Item del Menú */
function SidebarItem({ item, isOpen }: { item: any; isOpen: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <Link
        to={item.path || "#"}
        className={`flex items-center gap-2 p-3 rounded-full transition-all font-medium cursor-pointer
        bg-white shadow-md hover:bg-gray-400 hover:text-white
        ${isOpen ? "w-5/6 mx-auto" : "justify-center w-12 mx-auto"}`}
        onClick={(e) => {
          if (item.subItems) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        {item.icon}
        {isOpen && <span>{item.label}</span>}
        {item.subItems && isOpen && (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
      </Link>

      {isOpen && isExpanded && item.subItems && (
        <div className="flex flex-col gap-2 mt-2">
          {item.subItems.map((subItem: any) => (
            <Link
              key={subItem.id}
              to={subItem.path}
              className="flex items-center gap-2 p-3 rounded-full transition-all font-medium cursor-pointer
              bg-white shadow-md hover:bg-gray-400 hover:text-white text-black w-5/6 mx-auto"
            >
              {subItem.icon}
              <span>{subItem.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
