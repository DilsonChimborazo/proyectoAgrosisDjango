import { Routes, Route } from "react-router-dom";
import useWebSocketUsuario from "@/hooks/usuarios/usuario/useWebSocketUsuario";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthChecker from "./components/inteceptor/Verificacion";
import './styles/globals.css';



import RegisterForm from "./components/usuarios/usuario/Register";
import Login from "./components/usuarios/usuario/InicioSesion";
import Principal from "./components/globales/Principal";
import { HomePage } from "./pages/HomePage";
import HistoricalDataPage from "./pages/HistoricalDataPage";
import UsersPage from "./pages/usuarios/UsersPage";
import CalendarPage from "./pages/trazabilidad/CalendarPage";
import IOtPage from "./pages/iot/IotPage";
import SensorPage from "./pages/iot/SensoresPage";
import CrearSensor from "./components/iot/sensores/CrearSensor";
import LotesPage from "./pages/iot/LotesPage";
import ErasPage from "./pages/iot/ErasPage";
import Evapotranspiracion from "./pages/iot/evapotranspiracionPage"; // Importamos el componente

import NotificacionPage from "./pages/trazabilidad/NotificacionPage";

import Fichas from "./components/usuarios/ficha/Ficha";
import Rol from "./components/usuarios/rol/Rol";
import PerfilUsuario from "./components/usuarios/usuario/PerfilUsuario";
import SolicitarRecuperacion from "./components/usuarios/recuperaciones/SolicitarRecuperacion";
import ResetearContrasena from "./components/usuarios/recuperaciones/ResetearContrasena";
import HerramientasPage from "./pages/inventario/HerramientaPage";
import InsumoPage from "./pages/inventario/InsumoPage";
import EspeciePage from "./pages/trazabilidad/EspeciePage";
import RealizaPage from "./pages/trazabilidad/RealizaPage";
import SemillerosPage from "./pages/trazabilidad/SemillerosPage";
import CalendarioLunarPage from "./pages/trazabilidad/CalendarioLunarPage";
import CultivosPage from "./pages/trazabilidad/CultivosPage";
import PlantacionPage from "./pages/trazabilidad/PlantacionPage";
import ResiduosPage from "./pages/trazabilidad/ResiduosPage";
import PeaPage from "./pages/trazabilidad/PeaPage";
import ControlFitosanitarioPage from "./pages/trazabilidad/ControlFitosanitarioPage";
import ProduccionPage from "./pages/finanzas/produccion/ProduccionPage";
import VentaPage from "./pages/finanzas/venta/VentaPage";
import CrearVentaPage from "./pages/finanzas/venta/CrearVentaPage";
import SalarioPage from "./pages/finanzas/salario/SalarioPage";
import CrearSalarioPage from "./pages/finanzas/salario/CrearSalarioPage";
import CrearProduccionPage from "./pages/finanzas/produccion/CrearProduccionPage";
import ActualizarProduccionPage from "./pages/finanzas/produccion/ActualizarProduccionPage";
import CrearEras from "./components/iot/eras/CrearEras";
import CrearLote from "./components/iot/lotes/CrearLote";
import CrearEspecie from "./components/trazabilidad/especie/CrearEspecie";

import Mapa from "./components/trazabilidad/mapa/Mapa";
import ListarHerramientas from "./components/inventario/herramientas/ListarHerramientas";
import ListarInsumos from "./components/inventario/insumos/Insumos";
import RegistroDiario from "./pages/finanzas/consultas/RegistroDiario";
import ReportesPage from "./components/reportes/Reportes";
import BodegaPage from "./pages/inventario/BodegaPage";
import UnidadMedida from "./components/inventario/unidadMedida/UnidadMedida";
import NominaPage from "./pages/finanzas/nomina/Nomina"
import StockPage from "./pages/finanzas/stock/StockPage"
import InsumoNotifications from '@/components/inventario/insumos/InsumosNotificacion';


const queryClient = new QueryClient();

function App() {
  useWebSocketUsuario();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthChecker>
        <InsumoNotifications />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/reportes" element={<Principal><ReportesPage /></Principal>} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/solicitarRecuperacion" element={<SolicitarRecuperacion />} />
          <Route path="/resetearContrasena" element={<ResetearContrasena />} />
          <Route path="/Home" element={<Principal><HomePage /></Principal>} />
          <Route path="/principal" element={<Principal><HomePage /></Principal>} />
          <Route path="/fichas" element={<Principal><Fichas /></Principal>} />
          <Route path="/rol" element={<Principal><Rol /></Principal>} />
          <Route path="/perfil" element={<Principal><PerfilUsuario /></Principal>} />
          <Route path="/usuarios" element={<Principal><UsersPage /></Principal>} />

          <Route path="/mapa" element={<Principal><Mapa /></Principal>} />

          {/* Rutas módulo IOT */}
          <Route path="/iot" element={<Principal><IOtPage /></Principal>} />
          <Route path="/iot/principal" element={<Principal><HomePage /></Principal>} />
          <Route path="/iot/sensores" element={<Principal><SensorPage /></Principal>} />
          <Route path="/crear-sensor" element={<Principal><CrearSensor /></Principal>} />
          <Route path="/lotes" element={<Principal><LotesPage /></Principal>} />
          <Route path="/crear-lote" element={<Principal><CrearLote /></Principal>} />
          <Route path="/eras" element={<Principal><ErasPage /></Principal>} />
          <Route path="/crear-eras" element={<Principal><CrearEras /></Principal>} />
          <Route path="/historical/:sensorId" element={<Principal><HistoricalDataPage /></Principal>} />
          <Route path="/iot/evapotranspiracion" element={<Principal><Evapotranspiracion /></Principal>} />


          {/* Rutas módulo inventario */}
          <Route path="/herramientas" element={<Principal><HerramientasPage /></Principal>} />
          <Route path="/insumos" element={<Principal><InsumoPage /></Principal>} />
          <Route path="/herramientas" element={<Principal><ListarHerramientas /></Principal>} />
          <Route path="/insumos" element={<Principal><ListarInsumos /></Principal>} />
          <Route path="/bodega" element={<Principal><BodegaPage /></Principal>} />
          <Route path="/unidad" element={<Principal><UnidadMedida /></Principal>} />


          {/* Rutas módulo inventario */}
          <Route path="/herramientas" element={<Principal><HerramientasPage /></Principal>} />
          <Route path="/insumos" element={<Principal><InsumoPage /></Principal>} />
          <Route path="/herramientas" element={<Principal><ListarHerramientas /></Principal>} />
          <Route path="/insumos" element={<Principal><ListarInsumos /></Principal>} />
          <Route path="/bodega" element={<Principal><BodegaPage /></Principal>} />
          <Route path="/unidad" element={<Principal><UnidadMedida /></Principal>} />


          {/* Rutas módulo trazabilidad */}
          <Route path="/actividad" element={<Principal><CalendarPage /></Principal>} />
          <Route path="/cultivo" element={<Principal><CultivosPage /></Principal>} />
          <Route path="/plantacion" element={<Principal><PlantacionPage /></Principal>} />
          <Route path="/residuos" element={<Principal><ResiduosPage /></Principal>} />
          <Route path="/pea" element={<Principal><PeaPage /></Principal>} />
          <Route path="/control-fitosanitario" element={<Principal><ControlFitosanitarioPage /></Principal>} />
          <Route path="/especies" element={<Principal><EspeciePage /></Principal>} />
          <Route path="/realiza" element={<Principal><RealizaPage /></Principal>} />
          <Route path="/semilleros" element={<Principal><SemillerosPage /></Principal>} />
          <Route path="/calendario-lunar" element={<Principal><CalendarioLunarPage /></Principal>} />
          <Route path="/notificaciones" element={<Principal><NotificacionPage /></Principal>} />
          <Route path="/CrearEspecie" element={<Principal><CrearEspecie /></Principal>} />


          {/* Rutas módulo finanzas */}
          <Route path="/produccion" element={<Principal><ProduccionPage /></Principal>} />
          <Route path="/registrar-producción" element={<Principal><CrearProduccionPage /></Principal>} />
          <Route path="/ventas" element={<Principal><VentaPage /></Principal>} />
          <Route path="/registrar-venta" element={<Principal><CrearVentaPage /></Principal>} />
          <Route path="/actualizarproduccion/:id_produccion" element={<Principal><ActualizarProduccionPage /></Principal>} />
          <Route path="/CrearSalario" element={<Principal><CrearSalarioPage /></Principal>} />
          <Route path="/Salario" element={<Principal><SalarioPage /></Principal>} />
          <Route path="/diario" element={<Principal><RegistroDiario /></Principal>} />
          <Route path="/stock" element={<Principal><StockPage /></Principal>} />
          <Route path="/nomina" element={<Principal><NominaPage /></Principal>} />


          {/* Ruta por defecto para manejar errores 404 */}
          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
      </AuthChecker>
    </QueryClientProvider>

  );
}

export default App;