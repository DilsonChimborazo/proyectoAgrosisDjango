import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './styles/globals.css'; 

import Login from "./components/usuarios/InicioSesion";
import Principal from "./components/globales/Principal";
import HomePage from "./pages/HomePage";
import UsersPage from "./pages/UsersPage";
import CalendarPage from "./pages/CalendarPage";
import IOtPage from "./pages/IotPage";
import CrearSensor from "./components/iot/sensores/CrearSensor";
import LotesPage from "./pages/LotesPage";
import ErasPage from "./pages/ErasPage";
import CrearUsuario from "./components/usuarios/crearUsuario";
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
import ProduccionPage from "./pages/finanzas/produccion/ProduccionPage";
import VentaPage from "./pages/finanzas/venta/VentaPage";
import CrearVentaPage from "./pages/finanzas/venta/CrearVentaPage";
import { HeroUIProvider } from "@heroui/system";
import CrearInsumos from "./components/inventario/insumos/CrearInsumos";
import CrearHerramientas from "./components/inventario/herramientas/CrearHerramientas";
import CrearAsignacion  from "./components/trazabilidad/CrearAsignacion";
import CrearCultivo from "./components/trazabilidad/cultivos/CrearCultivos";
import CrearResiduo from "./components/trazabilidad/residuos/CrearResiduo";
import CrearPea from "./components/trazabilidad/peas/CrearPea";
import CrearControlFitosanitario from "./components/trazabilidad/control/CrearControlFitosanitario";


import ActualizarCultivo from "./components/trazabilidad/cultivos/ActualizarCultivo";
import EditarResiduo from "./components/trazabilidad/residuos/ActualizarResiduo";
import ActualizarPea from "./components/trazabilidad/peas/ActualizarPea";
import ActualizarControlFitosanitario from "./components/trazabilidad/control/ActualizarControlFitosanitario"


import CrearProduccionPage from "./pages/finanzas/produccion/CrearProduccionPage";
import ActualizarProduccionPage from "./pages/finanzas/produccion/ActualizarProduccionPage";
import CrearEras from "./components/iot/eras/CrearEras";
import EditarEras from "./components/iot/eras/EditarEras";
import CrearLote from "./components/iot/lotes/CrearLote";
import EditarLote from "./components/iot/lotes/EditarLote";
import EditarSensor from "./components/iot/sensores/EditarSensores";
import ActualizarHerramientas from "./components/inventario/herramientas/ActualizarHerramientas";


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
          <Route path="/EditarSensor/:id" element={<Principal><EditarSensor /></Principal>} />
          <Route path="/lotes" element={<Principal><LotesPage /></Principal>} />
          <Route path="/crear-lote" element={<Principal><CrearLote /></Principal>} />
          <Route path="/Editarlote/:id" element={<Principal><EditarLote /></Principal>} />
          <Route path="/eras" element={<Principal><ErasPage /></Principal>} />
          <Route path="/crear-eras" element={<Principal><CrearEras /></Principal>} />
          <Route path="/EditarEras/:id" element={<Principal><EditarEras /></Principal>} />
          
          {/* Rutas módulo inventario */}
          <Route path="/herramientas" element={<Principal><HerramientasPage /></Principal>} />
          <Route path="/CrearHerramientas" element={<Principal><CrearHerramientas /></Principal>} />
          <Route path="/ActualizarHerramienta" element={<Principal><ActualizarHerramientas /></Principal>} />
          <Route path="/insumos" element={<Principal><InsumoPage /></Principal>} />
          <Route path="/CrearInsumos" element={<Principal><CrearInsumos /></Principal>} />
          
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
          <Route path="/CrearAsignacion" element={<Principal><CrearAsignacion /></Principal>} />
          <Route path="/crearcultivo" element={<Principal><CrearCultivo /></Principal>}/>
          <Route path="/crearresiduo" element={<Principal><CrearResiduo /></Principal>} />
          <Route path="/crearpea" element={<Principal><CrearPea /></Principal>} />
          <Route path="/crearcontrolfitosanitario" element={<Principal><CrearControlFitosanitario /></Principal>} />

          {/**rutas modulo de trazabilidad actualizar*/}
          <Route path="/actualizarcultivo/:id" element={<Principal><ActualizarCultivo /></Principal>} />
          <Route path="/residuos/editar/:id" element={<Principal><EditarResiduo /></Principal>} />
          <Route path="/pea/editar/:id" element={<Principal><ActualizarPea /></Principal>} />
          <Route path="/controlfitosanitario/editar/:id" element={<Principal><ActualizarControlFitosanitario /></Principal>} />
          
          {/* Rutas módulo finanzas */}
          <Route path="/produccion" element={<Principal><ProduccionPage /></Principal>} />
          <Route path="/registrar-producción" element={<Principal><CrearProduccionPage /></Principal>} />
          <Route path="/ventas" element={<Principal><VentaPage /></Principal>} />
          <Route path="/registrar-venta" element={<Principal><CrearVentaPage /></Principal>} />
          <Route path="/actualizarproduccion/:id_produccion" element={<Principal><ActualizarProduccionPage /></Principal>} />
          

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
