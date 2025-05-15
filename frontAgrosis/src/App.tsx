import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeroUIProvider } from "@heroui/system";
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
import CrearRol from "./components/usuarios/rol/crearRol";
import CrearFicha from "./components/usuarios/ficha/crearFicha";
import CrearUsuario from "./components/usuarios/usuario/crearUsuario";
import PerfilUsuario from "./components/usuarios/usuario/PerfilUsuario";
import ActualizarUsuario from "./components/usuarios/usuario/UpdateUsuario";
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
import CrearInsumos from "./components/inventario/insumos/CrearInsumos";
import CrearAsignacion from "./components/trazabilidad/actividad/CrearAsignacion";

import CrearSalarioPage from "./pages/finanzas/salario/CrearSalarioPage";
import CrearProduccionPage from "./pages/finanzas/produccion/CrearProduccionPage";
import ActualizarProduccionPage from "./pages/finanzas/produccion/ActualizarProduccionPage";
import CrearEras from "./components/iot/eras/CrearEras";
import EditarEras from "./components/iot/eras/EditarEras";
import CrearLote from "./components/iot/lotes/CrearLote";
import EditarLote from "./components/iot/lotes/EditarLote";
import EditarSensor from "./components/iot/sensores/EditarSensores";
import CrearCalendarioLunar from "./components/trazabilidad/calendarioLunar/CrearCalendarioLunar";
import CrearEspecie from "./components/trazabilidad/especie/CrearEspecie";
import CrearSemillero from "./components/trazabilidad/semillero/CrearSemillero";
import ActualizarCalendarioLunar from "./components/trazabilidad/calendarioLunar/ActualizarCalendario";
import ActualizarEspecie from "./components/trazabilidad/especie/ActualizarEspecie";
import ActualizarSemillero from "./components/trazabilidad/semillero/ActualizarSemillero";
import ActualizarVentaPage from "./pages/finanzas/venta/ActualizarVentaPage";
import ActualizarInsumos from "./components/inventario/insumos/ActualizarInsumos";
import Mapa from "./components/trazabilidad/mapa/Mapa";
import ListarHerramientas from "./components/inventario/herramientas/ListarHerramientas";
import ListarInsumos from "./components/inventario/insumos/Insumos";
import RegistroDiario from "./pages/finanzas/consultas/RegistroDiario";
import ReporteInsumosPage from "./pages/finanzas/consultas/ReporteInsumosPage";
import ReportesPage from "./components/reportes/Reportes";
import BodegaPage from "./pages/inventario/BodegaPage";
import UnidadMedida from "./components/inventario/unidadMedida/UnidadMedida";
import TipoResiduos from "./components/trazabilidad/tiporesiduo/TipoResiduo";
import { Provider } from "./provider";


import StockPage from "./pages/finanzas/stock/StockPage"
import CrearInsumoCompuesto from "./components/inventario/insumocompuesto/CrearInsumoCompuesto";


const queryClient = new QueryClient();

function App() {
  return (
      <Provider>
      <QueryClientProvider client={queryClient}>
        <AuthChecker>  
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/reportes" element={<Principal><ReportesPage /></Principal>} />
            <Route path="/register" element={<RegisterForm/>} />
            <Route path="/solicitarRecuperacion" element={<SolicitarRecuperacion />} />
            <Route path="/resetearContrasena" element={<ResetearContrasena />} />
            <Route path="/Home" element={<Principal><HomePage /></Principal>} />
            <Route path="/principal" element={<Principal><HomePage /></Principal>} />
            <Route path="/fichas" element={<Principal><Fichas/></Principal>} />
            <Route path="/rol" element={<Principal><Rol/></Principal>} />
            <Route path="/crearRol" element={<Principal><CrearRol/></Principal>} />
            <Route path="/perfil" element={<Principal><PerfilUsuario/></Principal>} />
            <Route path="/crearFicha" element={<Principal><CrearFicha/></Principal>} />
            <Route path="/usuarios" element={<Principal><UsersPage /></Principal>} />
            <Route path="/crearUsuarios" element={<Principal><CrearUsuario /></Principal>} />
            <Route path="/editarUsuario/:id" element={<Principal><ActualizarUsuario/></Principal>} />
            <Route path="/mapa" element={<Principal><Mapa /></Principal>} />
            {/* Rutas módulo IOT */}
            <Route path="/iot" element={<Principal><IOtPage /></Principal>} />
            <Route path="/iot/principal" element={<Principal><HomePage /></Principal>} />
            <Route path="/iot/sensores" element={<Principal><SensorPage /></Principal>} />
            <Route path="/crear-sensor" element={<Principal><CrearSensor /></Principal>} />
            <Route path="/EditarSensor/:id" element={<Principal><EditarSensor /></Principal>} />
            <Route path="/lotes" element={<Principal><LotesPage /></Principal>} />
            <Route path="/crear-lote" element={<Principal><CrearLote /></Principal>} />
            <Route path="/Editarlote/:id" element={<Principal><EditarLote /></Principal>} />
            <Route path="/eras" element={<Principal><ErasPage /></Principal>} />
            <Route path="/crear-eras" element={<Principal><CrearEras /></Principal>} />
            <Route path="/EditarEras/:id" element={<Principal><EditarEras /></Principal>} />
            <Route path="/historical/:sensorId" element={<Principal><HistoricalDataPage /></Principal>} />
            <Route path="/iot/evapotranspiracion" element={<Principal><Evapotranspiracion /></Principal>} />
            
            {/* Rutas módulo inventario */}
            <Route path="/herramientas" element={<Principal><HerramientasPage /></Principal>} />
            <Route path="/insumos" element={<Principal><InsumoPage /></Principal>} />
            <Route path="/CrearInsumos" element={<Principal><CrearInsumos /></Principal>} />
            <Route path="/ActualizarInsumos/:id" element={<Principal><ActualizarInsumos /></Principal>} />
            <Route path="/herramientas" element={<Principal><ListarHerramientas /></Principal>} />
            <Route path="/insumos" element={<Principal><ListarInsumos /></Principal>} />
            <Route path="/bodega" element={<Principal><BodegaPage /></Principal>} />
            <Route path="/unidad" element={<Principal><UnidadMedida /></Principal>} />
            <Route path="/CrearInsumoCompuesto" element={<Principal><CrearInsumoCompuesto /></Principal>} />

            {/* Rutas módulo trazabilidad */}
            <Route path="/tipoResiduo" element={<Principal><TipoResiduos /></Principal>} />
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
            <Route path="/CrearAsignacion" element={<Principal><CrearAsignacion /></Principal>} />
            <Route path="/CrearCalendarioLunar" element={<Principal><CrearCalendarioLunar /></Principal>}/>
            <Route path="/notificaciones" element={<Principal><NotificacionPage /></Principal>} />
            
            <Route path="/CrearEspecie" element={<Principal><CrearEspecie/></Principal>}/>
            <Route path="/CrearSemillero" element={<Principal><CrearSemillero/></Principal>}/>
            
            <Route path="/actualizarCalendarioLunar/:id" element={<Principal><ActualizarCalendarioLunar/></Principal>}/>
            <Route path="/actualizarEspecie/:id" element={<Principal><ActualizarEspecie/></Principal>}/>
            <Route path="/actualizarSemillero/:id" element={<Principal><ActualizarSemillero/></Principal>}/>

            
            {/* Rutas módulo finanzas */}
            <Route path="/produccion" element={<Principal><ProduccionPage /></Principal>} />
            <Route path="/registrar-producción" element={<Principal><CrearProduccionPage /></Principal>} />
            <Route path="/ventas" element={<Principal><VentaPage /></Principal>} />
            <Route path="/registrar-venta" element={<Principal><CrearVentaPage /></Principal>} />
            <Route path="/actualizarproduccion/:id_produccion" element={<Principal><ActualizarProduccionPage /></Principal>} />
            <Route path="/actualizarventa/:id_venta" element={<Principal><ActualizarVentaPage /></Principal>} />
            <Route path="/CrearSalario" element={<Principal><CrearSalarioPage/></Principal>}/>

            <Route path="/diario" element={<Principal><RegistroDiario /></Principal>} />
            <Route path="/insumo-egresos" element={<Principal><ReporteInsumosPage /></Principal>} />
            <Route path="/stock" element={<Principal><StockPage /></Principal>} />

            {/* Ruta por defecto para manejar errores 404 */}
            <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
          </Routes>
        </AuthChecker> 
      </QueryClientProvider>
      </Provider> 
  );
}

export default App;