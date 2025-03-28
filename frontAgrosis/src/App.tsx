import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeroUIProvider } from "@heroui/system";
import './styles/globals.css'; 

import RegisterForm from "./components/usuarios/Register";
import Login from "./components/usuarios/InicioSesion";
import Principal from "./components/globales/Principal";
import  {HomePage}  from "./pages/HomePage"; 
import HistoricalDataPage from "./pages/HistoricalDataPage"
import UsersPage from "./pages/usuarios/UsersPage";
import CalendarPage from "./pages/trazabilidad/CalendarPage";
import IOtPage from "./pages/iot/IotPage";
import CrearSensor from "./components/iot/sensores/CrearSensor";
import LotesPage from "./pages/iot/LotesPage";
import ErasPage from "./pages/iot/ErasPage";
import CrearUsuario from "./components/usuarios/crearUsuario";
import ActualizarUsuario from "./components/usuarios/UpdateUsuario";
import SolicitarRecuperacion from "./components/usuarios/SolicitarRecuperacion";
import ResetearContrasena from "./components/usuarios/ResetearContrasena";
import HerramientasPage from "./pages/inventario/HerramientaPage";
import InsumoPage from "./pages/inventario/InsumoPage";
import EspeciePage from "./pages/trazabilidad/EspeciePage";
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
import CrearInsumos from "./components/inventario/insumos/CrearInsumos";
import CrearHerramientas from "./components/inventario/herramientas/CrearHerramientas";
import CrearAsignacion from "./components/trazabilidad/actividad/CrearAsignacion";
import CrearCultivo from "./components/trazabilidad/cultivos/CrearCultivos";
import CrearResiduo from "./components/trazabilidad/residuos/CrearResiduo";
import CrearPea from "./components/trazabilidad/peas/CrearPea";
import CrearControlFitosanitario from "./components/trazabilidad/control/CrearControlFitosanitario";
import ActualizarCultivo from "./components/trazabilidad/cultivos/ActualizarCultivo";
import EditarResiduo from "./components/trazabilidad/residuos/ActualizarResiduo";
import ActualizarPea from "./components/trazabilidad/peas/ActualizarPea";
import ActualizarControlFitosanitario from "./components/trazabilidad/control/ActualizarControlFitosanitario";
import CrearProduccionPage from "./pages/finanzas/produccion/CrearProduccionPage";
import ActualizarProduccionPage from "./pages/finanzas/produccion/ActualizarProduccionPage";
import CrearEras from "./components/iot/eras/CrearEras";
import EditarEras from "./components/iot/eras/EditarEras";
import CrearLote from "./components/iot/lotes/CrearLote";
import EditarLote from "./components/iot/lotes/EditarLote";
import EditarSensor from "./components/iot/sensores/EditarSensores";
import ActualizarHerramientas from "./components/inventario/herramientas/ActualizarHerramientas";
import CrearCalendarioLunar from "./components/trazabilidad/calendarioLunar/CrearCalendarioLunar";
import CrearEspecie from "./components/trazabilidad/especie/CrearEspecie";
import CrearSemillero from "./components/trazabilidad/semillero/CrearSemillero";
import ActualizarCalendarioLunar from "./components/trazabilidad/calendarioLunar/ActualizarCalendario";
import ActualizarEspecie from "./components/trazabilidad/especie/ActualizarEspecie";
import ActualizarSemillero from "./components/trazabilidad/semillero/ActualizarSemillero";
import ActualizarVentaPage from "./pages/finanzas/venta/ActualizarVentaPage";
import ActualizarInsumo from "./components/inventario/insumos/ActualizarInsumos";
import Mapa from "./components/trazabilidad/mapa/Mapa";
import ActualizarAsignacion from "./components/trazabilidad/actividad/ActualizarAsignacion";
import ListarHerramientas from "./components/inventario/herramientas/ListarHerramientas";
import ListarInsumos from "./components/inventario/insumos/Insumos";
import ActualizarInsumos from "./components/inventario/insumos/ActualizarInsumos";



const queryClient = new QueryClient();

function App() {
  return (
    <HeroUIProvider>
      <QueryClientProvider client={queryClient}>
        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/register" element={<RegisterForm/>} />
          <Route path="/solicitarRecuperacion" element={<SolicitarRecuperacion />} />
          <Route path="/resetearContrasena" element={<ResetearContrasena />} />
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Principal><HomePage /></Principal>} />
          <Route path="/principal" element={<Principal><HomePage /></Principal>} />
          <Route path="/usuarios" element={<Principal><UsersPage /></Principal>} />
          <Route path="/crearUsuarios" element={<Principal><CrearUsuario /></Principal>} />
          <Route path="/editarUsuario/:id" element={<Principal><ActualizarUsuario/></Principal>} />
          <Route path="/mapa" element={<Principal><Mapa /></Principal>} />

          {/* Rutas módulo IOT */}
          <Route path="/iot" element={<Principal><IOtPage /></Principal>} />
          <Route path="/iot/principal" element={<Principal><HomePage /></Principal>} />
          <Route path="/crear-sensor" element={<Principal><CrearSensor /></Principal>} />
          <Route path="/EditarSensor/:id" element={<Principal><EditarSensor /></Principal>} />
          <Route path="/lotes" element={<Principal><LotesPage /></Principal>} />
          <Route path="/crear-lote" element={<Principal><CrearLote /></Principal>} />
          <Route path="/Editarlote/:id" element={<Principal><EditarLote /></Principal>} />
          <Route path="/eras" element={<Principal><ErasPage /></Principal>} />
          <Route path="/crear-eras" element={<Principal><CrearEras /></Principal>} />
          <Route path="/EditarEras/:id" element={<Principal><EditarEras /></Principal>} />
          <Route path="/historical/:sensorId" element={<Principal><HistoricalDataPage /></Principal>} />
          
          {/* Rutas módulo inventario */}
          <Route path="/herramientas" element={<Principal><HerramientasPage /></Principal>} />
          <Route path="/CrearHerramientas" element={<Principal><CrearHerramientas /></Principal>} />
          <Route path="/ActualizarHerramienta" element={<Principal><ActualizarHerramientas /></Principal>} />
          <Route path="/insumos" element={<Principal><InsumoPage /></Principal>} />
          <Route path="/CrearInsumos" element={<Principal><CrearInsumos /></Principal>} />
          <Route path="/ActualizarInsumos" element={<Principal><ActualizarInsumos /></Principal>} />
          <Route path="/herramientas" element={<Principal><ListarHerramientas /></Principal>} />
          <Route path="/insumos" element={<Principal><ListarInsumos /></Principal>} />
          <Route path="/insumos" element={<Principal><ActualizarInsumo /></Principal>} />


          
          {/* Rutas módulo trazabilidad */}
          <Route path="/actividad" element={<Principal><CalendarPage /></Principal>} />
          <Route path="/cultivo" element={<Principal><CultivosPage /></Principal>} />
          <Route path="/residuos" element={<Principal><ResiduosPage /></Principal>} />
          <Route path="/pea" element={<Principal><PeaPage /></Principal>} />
          <Route path="/control-fitosanitario" element={<Principal><ControlFitosanitarioPage /></Principal>} />
          <Route path="/especies" element={<Principal><EspeciePage /></Principal>} />
          <Route path="/realiza" element={<Principal><RealizaPage /></Principal>} />
          <Route path="/semilleros" element={<Principal><SemillerosPage /></Principal>} />
          <Route path="/calendario-lunar" element={<Principal><CalendarioLunarPage /></Principal>} />
          <Route path="/CrearAsignacion" element={<Principal><CrearAsignacion /></Principal>} />
          <Route path="/crearcultivo" element={<Principal><CrearCultivo /></Principal>}/>
          <Route path="/crearresiduo" element={<Principal><CrearResiduo /></Principal>} />
          <Route path="/crearpea" element={<Principal><CrearPea /></Principal>} />
          <Route path="/crearcontrolfitosanitario" element={<Principal><CrearControlFitosanitario /></Principal>} />
          <Route path="/CrearCalendarioLunar" element={<Principal><CrearCalendarioLunar /></Principal>}/>
          <Route path="/CrearCultivo" element={<Principal><CrearCultivo/></Principal>}/>
          <Route path="/CrearEspecie" element={<Principal><CrearEspecie/></Principal>}/>
          <Route path="/CrearSemillero" element={<Principal><CrearSemillero/></Principal>}/>

          <Route path="/actualizarCalendarioLunar/:id" element={<Principal><ActualizarCalendarioLunar/></Principal>}/>
          <Route path="/actualizarEspecie/:id" element={<Principal><ActualizarEspecie/></Principal>}/>
          <Route path="/actualizarSemillero/:id" element={<Principal><ActualizarSemillero/></Principal>}/>

          {/**rutas modulo de trazabilidad actualizar*/}
          <Route path="/actualizarcultivo/:id" element={<Principal><ActualizarCultivo /></Principal>} />
          <Route path="/residuos/editar/:id" element={<Principal><EditarResiduo /></Principal>} />
          <Route path="/pea/editar/:id" element={<Principal><ActualizarPea /></Principal>} />
          <Route path="/controlfitosanitario/editar/:id" element={<Principal><ActualizarControlFitosanitario /></Principal>} />
          <Route path="/actualizarasignacion/:id" element={<Principal><ActualizarAsignacion /></Principal>} />
          
          {/* Rutas módulo finanzas */}
          <Route path="/produccion" element={<Principal><ProduccionPage /></Principal>} />
          <Route path="/registrar-producción" element={<Principal><CrearProduccionPage /></Principal>} />
          <Route path="/ventas" element={<Principal><VentaPage /></Principal>} />
          <Route path="/registrar-venta" element={<Principal><CrearVentaPage /></Principal>} />
          <Route path="/actualizarproduccion/:id_produccion" element={<Principal><ActualizarProduccionPage /></Principal>} />
          <Route path="/actualizarventa/:id_venta" element={<Principal><ActualizarVentaPage /></Principal>} />

          {/* Ruta por defecto para manejar errores 404 */}
          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
      </QueryClientProvider>
    </HeroUIProvider>
  );
}

export default App;