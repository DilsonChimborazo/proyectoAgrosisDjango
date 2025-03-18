import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './styles/globals.css'; 

import Login from "./components/usuarios/InicioSesion";
import Principal from "./components/globales/Principal";
import HomePage from "./pages/HomePage";
import UsersPage from "./pages/UsersPage";
import CalendarPage from "./pages/CalendarPage";
import IOtPage from "./pages/IotPage";
import CrearSensor from "./components/iot/CrearSensor";
import LotesPage from "./pages/LotesPage";
import ErasPage from "./pages/ErasPage";
import CrearUsuario from "./components/usuarios/crearUsuario";
import HerramientasPage from "./pages/inventario/HerramientaPage";
import InsumoPage from "./pages/inventario/InsumoPage";
import EspeciesPage from "./pages/trazabilidad/EspeciePage";
import RealizaPage from "./pages/trazabilidad/RealizaPage";
import SemillerosPage from "./pages/trazabilidad/SemillerosPage";
import CalendarioLunarPage from "./pages/trazabilidad/CalendarioLunarPage";
import CultivosPage from "./pages/CultivosPage";
import ResiduosPage from "./pages/ResiduosPage";
import PeaPage from "./pages/PeaPage";
import ControlFitosanitarioPage from "./pages/ControlFitosanitarioPage";
import ProduccionPage from "./pages/finanzas/produccion/ProduccionPage";
import GeneraPage from "./pages/finanzas/produccion/GeneraPage";
import VentaPage from "./pages/finanzas/venta/VentaPage";
import CrearVentaPage from "./pages/finanzas/venta/CrearVentaPage";
import { HeroUIProvider } from "@heroui/system";
import  CrearAsignacion  from "./components/trazabilidad/CrearAsignacion";
import CrearInsumos from "./components/inventario/insumos/CrearInsumos";
import CrearHerramientas from "./components/inventario/herramientas/CrearHerramientas";



const queryClient = new QueryClient();

function App() {
  return (
    <HeroUIProvider>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/principal" element={<Principal><HomePage /></Principal>} />
          <Route path="/home" element={<Principal><HomePage /></Principal>} />
          <Route path="/usuarios" element={<Principal><UsersPage /></Principal>} />
          <Route path="/crearUsuarios" element={<Principal><CrearUsuario /></Principal>} />
          {/* Rutas módulo IOT */}
          <Route path="/iot" element={<Principal><IOtPage /></Principal>} />
          <Route path="/crear-sensor" element={<Principal><CrearSensor /></Principal>} />
          <Route path="/lotes" element={<Principal><LotesPage /></Principal>} />
          <Route path="/eras" element={<Principal><ErasPage /></Principal>} />
          
          {/* Rutas módulo inventario */}
          <Route path="/herramientas" element={<Principal><HerramientasPage /></Principal>} />
          <Route path="/insumos" element={<Principal><InsumoPage /></Principal>} />
          <Route path="/CrearHerramientas" element={<Principal><CrearHerramientas /></Principal>} />
          <Route path="/CrearInsumos" element={<Principal><CrearInsumos /></Principal>} />
          
          {/* Rutas módulo trazabilidad */}
          <Route path="/actividad" element={<Principal><CalendarPage /></Principal>} />
          <Route path="/cultivos" element={<Principal><CultivosPage /></Principal>} />
          <Route path="/residuos" element={<Principal><ResiduosPage /></Principal>} />
          <Route path="/pea" element={<Principal><PeaPage /></Principal>} />
          <Route path="/control-fitosanitario" element={<Principal><ControlFitosanitarioPage /></Principal>} />
          <Route path="/especies" element={<Principal><EspeciesPage /></Principal>} />
          <Route path="/realiza" element={<Principal><RealizaPage /></Principal>} />
          <Route path="/semilleros" element={<Principal><SemillerosPage /></Principal>} />
          <Route path="/calendario-lunar" element={<Principal><CalendarioLunarPage /></Principal>} />
          <Route path="/CrearAsignacion" element={<Principal><CrearAsignacion /></Principal>} />
          
          {/* Rutas módulo finanzas */}
          <Route path="/produccion" element={<Principal><GeneraPage /></Principal>} />
          <Route path="/registrar-producción" element={<Principal><ProduccionPage /></Principal>} />
          <Route path="/ventas" element={<Principal><VentaPage /></Principal>} />
          <Route path="/registrar-venta" element={<Principal><CrearVentaPage /></Principal>} />
          

          {/* Rutas adicionales */}
          <Route path="/crear-asignacion" element={<Principal><CrearAsignacion /></Principal>} />

          {/* Ruta por defecto para manejar errores 404 */}
          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
    </QueryClientProvider>
  </HeroUIProvider>

  );
}

export default App;
