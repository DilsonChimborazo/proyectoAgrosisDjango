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

import HerramientasPage from "./pages/inventario/HerramientaPage";
import InsumoPage from "./pages/inventario/InsumoPage";
import EspeciesPage from "./pages/trazabilidad/EspeciePage";
import RealizaPage from "./pages/trazabilidad/RealizaPage";
import SemillerosPage from "./pages/trazabilidad/SemillerosPage";
import CalendarioLunarPage from "./pages/trazabilidad/CalendarioLunarPage";
import CultivosPage from "./pages/trazabilidad/CultivosPage";
import ResiduosPage from "./pages/trazabilidad/ResiduosPage";
import PeaPage from "./pages/trazabilidad/PeaPage";
import ControlFitosanitarioPage from "./pages/trazabilidad/ControlFitosanitarioPage";
import ProduccionPage from "./pages/finanzas/produccion/GeneraPage";
import VentaPage from "./pages/finanzas/venta/VentaPage";
import { HeroUIProvider } from "@heroui/system";

import CrearAsignacion  from "./components/trazabilidad/CrearAsignacion";
import CrearCultivo from "./components/trazabilidad/cultivos/CrearCultivos";


import ActualizarCultivo from "./components/trazabilidad/cultivos/ActualizarCultivo";

const queryClient = new QueryClient();

function App() {
  return (
    <HeroUIProvider>
    <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Principal><HomePage /></Principal>} />
          <Route path="/principal" element={<Principal><HomePage /></Principal>} />
          <Route path="/usuarios" element={<Principal><UsersPage /></Principal>} />
          
          {/* Rutas módulo IOT */}
          <Route path="/iot" element={<Principal><IOtPage /></Principal>} />
          <Route path="/crear-sensor" element={<Principal><CrearSensor /></Principal>} />
          <Route path="/lotes" element={<Principal><LotesPage /></Principal>} />
          <Route path="/eras" element={<Principal><ErasPage /></Principal>} />
          
          {/* Rutas módulo inventario */}
          <Route path="/herramientas" element={<Principal><HerramientasPage /></Principal>} />
          <Route path="/insumos" element={<Principal><InsumoPage /></Principal>} />
          
          {/* Rutas módulo trazabilidad */}
          <Route path="/actividad" element={<Principal><CalendarPage /></Principal>} />
          <Route path="/cultivo" element={<Principal><CultivosPage /></Principal>} />
          <Route path="/residuos" element={<Principal><ResiduosPage /></Principal>} />
          <Route path="/pea" element={<Principal><PeaPage /></Principal>} />
          <Route path="/control-fitosanitario" element={<Principal><ControlFitosanitarioPage /></Principal>} />
          <Route path="/especies" element={<Principal><EspeciesPage /></Principal>} />
          <Route path="/realiza" element={<Principal><RealizaPage /></Principal>} />
          <Route path="/semilleros" element={<Principal><SemillerosPage /></Principal>} />
          <Route path="/calendario-lunar" element={<Principal><CalendarioLunarPage /></Principal>} />
          
          {/* Rutas módulo finanzas */}
          <Route path="/produccion" element={<Principal><ProduccionPage /></Principal>} />
          <Route path="/ventas" element={<Principal><VentaPage /></Principal>} />
        </Routes>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/principal" element={<Principal><HomePage /></Principal>} />
        <Route path="/usuarios" element={<Principal><UsersPage /></Principal>} />
        <Route path="/actividad" element={<Principal><CalendarPage /></Principal>} />
        {/**rutas modulo iot */}
        <Route path="/iot" element={<Principal><IOtPage /></Principal>} />
        <Route path="/crear-sensor" element={<Principal><CrearSensor /></Principal>} />
        <Route path="/lotes" element={<Principal><LotesPage /></Principal>} />
        <Route path="/eras" element={<Principal><ErasPage /></Principal>} />
        {/**rutas modulo de trazabilidad */}
        <Route path="/CrearAsignacion" element={<Principal><CrearAsignacion /></Principal>} />
        <Route path="/crearcultivo" element={<Principal><CrearCultivo /></Principal>}/>

        {/**rutas modulo de trazabilidad actualizar*/}
        <Route path="/actualizarcultivo/:id" element={<Principal><ActualizarCultivo /></Principal>} />

      </Routes>
    </QueryClientProvider>
  </HeroUIProvider>
  );
}

export default App;
