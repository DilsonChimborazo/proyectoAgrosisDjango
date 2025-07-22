import { useState, useRef, useEffect } from 'react';
import VentanaModal from '../../globales/VentanasModales';
import Button from '@/components/globales/Button';
import ReporteValorInventario from './ReporteValorInventario';
import ReporteMovimientosStock from './ReporteMovimientosStock';
import ReporteVentasCultivo from './ReporteVentasCultivo';
import ReporteProductividadPlantacion from './ReporteProductividadPlantacion';
import ReporteTendenciasVentas from './ReporteTendenciasVentas';
import ReporteComparacionCultivos from './ReporteComparacionCultivos';
import { ChevronDown } from 'lucide-react';
import { Produccion } from '@/hooks/finanzas/stock/useStock';
import { Venta } from '@/hooks/finanzas/venta/useVenta';
import { Stock } from '@/hooks/finanzas/stock/useStock';

interface ReporteModalProps {
  isOpen: boolean;
  onClose: () => void;
  producciones: Produccion[] | undefined;
  allStock: Stock[] | undefined;
  ventas: Venta[] | undefined;
  filtrarDatos: (fechaInicio: string, fechaFin: string, cultivosSeleccionados: string[]) => {
    produccionesFiltradas: Produccion[];
    allStockFiltrado: Stock[];
    ventasFiltradas: Venta[];
  };
  cultivosUnicos: string[];
}

const ReporteModal = ({ isOpen, onClose, filtrarDatos, cultivosUnicos }: ReporteModalProps) => {
  const [reporteSeleccionado, setReporteSeleccionado] = useState<string>('valor-inventario');
  const [formatoReporte, setFormatoReporte] = useState<'pdf' | 'excel'>('pdf');
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [cultivosSeleccionados, setCultivosSeleccionados] = useState<string[]>([]);
  const [isCultivosOpen, setIsCultivosOpen] = useState(false);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Manejar clic fuera del dropdown para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCultivosOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrar cultivos según búsqueda
  const cultivosFiltrados = cultivosUnicos.filter(cultivo =>
    cultivo.toLowerCase().includes(filtroBusqueda.toLowerCase())
  );

  // Toggle de selección de cultivos
  const toggleCultivo = (cultivo: string) => {
    setCultivosSeleccionados(prev =>
      prev.includes(cultivo)
        ? prev.filter(c => c !== cultivo)
        : [...prev, cultivo]
    );
  };

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFechaInicio('');
    setFechaFin('');
    setCultivosSeleccionados([]);
    setFiltroBusqueda('');
  };

  const renderReporteSeleccionado = () => {
    const { produccionesFiltradas, allStockFiltrado, ventasFiltradas } = filtrarDatos(
      fechaInicio,
      fechaFin,
      cultivosSeleccionados
    );

    if (
      (reporteSeleccionado === 'valor-inventario' && produccionesFiltradas.length === 0) ||
      (reporteSeleccionado === 'movimientos-stock' && allStockFiltrado.length === 0) ||
      (reporteSeleccionado === 'ventas-cultivo' && ventasFiltradas.length === 0) ||
      (reporteSeleccionado === 'productividad-plantacion' && produccionesFiltradas.length === 0) ||
      (reporteSeleccionado === 'tendencias-ventas' && ventasFiltradas.length === 0) ||
      (reporteSeleccionado === 'comparacion-cultivos' && (produccionesFiltradas.length === 0 && ventasFiltradas.length === 0))
    ) {
      return <p className="text-center text-gray-500 py-4">No hay datos disponibles para los filtros seleccionados.</p>;
    }

    switch (reporteSeleccionado) {
      case 'valor-inventario':
        return (
          <ReporteValorInventario
            producciones={produccionesFiltradas}
            formato={formatoReporte}
            onGenerate={onClose}
          />
        );
      case 'movimientos-stock':
        return (
          <ReporteMovimientosStock
            allStock={allStockFiltrado}
            formato={formatoReporte}
            onGenerate={onClose}
          />
        );
      case 'ventas-cultivo':
        return (
          <ReporteVentasCultivo
            ventas={ventasFiltradas}
            formato={formatoReporte}
            onGenerate={onClose}
          />
        );
      case 'productividad-plantacion':
        return (
          <ReporteProductividadPlantacion
            producciones={produccionesFiltradas}
            formato={formatoReporte}
            onGenerate={onClose}
          />
        );
      case 'tendencias-ventas':
        return (
          <ReporteTendenciasVentas
            ventas={ventasFiltradas}
            formato={formatoReporte}
            onGenerate={onClose}
          />
        );
      case 'comparacion-cultivos':
        return (
          <ReporteComparacionCultivos
            producciones={produccionesFiltradas}
            ventas={ventasFiltradas}
            formato={formatoReporte}
            onGenerate={onClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <VentanaModal
      isOpen={isOpen}
      onClose={onClose}
      titulo="Generar Reporte"
      size="xl"
      modalClassName="bg-white rounded-lg shadow-md max-w-2xl mx-auto"
    >
      <div className="space-y-6 p-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Seleccionar Reporte</h3>
          <select
            value={reporteSeleccionado}
            onChange={(e) => setReporteSeleccionado(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-gray-700"
          >
            <option value="valor-inventario">Valor de Inventario por Cultivo</option>
            <option value="movimientos-stock">Movimientos de Stock por Cultivo</option>
            <option value="ventas-cultivo">Ventas por Cultivo</option>
            <option value="productividad-plantacion">Productividad por Plantación</option>
            <option value="tendencias-ventas">Tendencias de Ventas por Mes</option>
            <option value="comparacion-cultivos">Comparación de Producción y Ventas por Cultivo</option>
            <option value="stock-bajo">Análisis de Stock Bajo</option>
          </select>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Filtros</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="block text-sm font-medium text-gray-700 mb-2">Cultivos</h3>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="w-full p-2 border rounded-lg bg-white text-left text-gray-700 flex justify-between items-center focus:ring-2 focus:ring-green-500"
              onClick={() => setIsCultivosOpen(!isCultivosOpen)}
            >
              <span>
                {cultivosSeleccionados.length === 0
                  ? 'Seleccionar cultivos'
                  : cultivosSeleccionados.length === 1
                  ? cultivosSeleccionados[0]
                  : `${cultivosSeleccionados.length} cultivos seleccionados`}
              </span>
              <ChevronDown className={`h-5 w-5 text-gray-500 transform ${isCultivosOpen ? 'rotate-180' : ''}`} />
            </button>
            {isCultivosOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Buscar cultivos..."
                    value={filtroBusqueda}
                    onChange={(e) => setFiltroBusqueda(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                {cultivosFiltrados.length === 0 ? (
                  <p className="p-2 text-sm text-gray-500">No se encontraron cultivos</p>
                ) : (
                  cultivosFiltrados.map((cultivo) => (
                    <label
                      key={cultivo}
                      className="flex items-center p-2 hover:bg-green-50 cursor-pointer text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={cultivosSeleccionados.includes(cultivo)}
                        onChange={() => toggleCultivo(cultivo)}
                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="ml-2">{cultivo}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Selecciona uno o varios cultivos para filtrar</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Formato</h3>
          <select
            value={formatoReporte}
            onChange={(e) => setFormatoReporte(e.target.value as 'pdf' | 'excel')}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-gray-700"
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
          </select>
        </div>

        <div className="mt-4">{renderReporteSeleccionado()}</div>

        <div className="flex justify-end gap-2">
          <Button
            text="Limpiar Filtros"
            variant="outline"
            onClick={limpiarFiltros}
            className="hover:bg-gray-200"
          />
          <Button
            text="Cancelar"
            variant="outline"
            onClick={onClose}
            className="hover:bg-gray-200"
          />
        </div>
      </div>
    </VentanaModal>
  );
};

export default ReporteModal;