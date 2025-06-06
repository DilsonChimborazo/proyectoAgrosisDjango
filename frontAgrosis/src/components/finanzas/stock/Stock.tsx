import { useState } from 'react';
import { useProducciones, useAllStock } from '../../../hooks/finanzas/stock/useStock';
import { useVentas } from '@/hooks/finanzas/venta/useVenta';
import VentaComponent from '../venta/Venta';
import ProduccionComponent from '../produccion/Produccion';
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import CrearVenta from '../venta/CrearVenta';
import CrearProduccion from '../produccion/CrearProduccion';
import { PlusCircle, Package, Loader2, MoreVertical, ChevronDown, ChevronUp, Activity, DollarSign } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

const SeccionDesplegable = ({
  titulo,
  icono,
  cantidad,
  abierta,
  onToggle,
  children
}: {
  titulo: string;
  icono: React.ReactNode;
  cantidad: number;
  abierta: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {icono}
          <h3 className="font-medium">{titulo}</h3>
          <span className="text-sm text-gray-500">({cantidad})</span>
        </div>
        {abierta ? <ChevronUp /> : <ChevronDown />}
      </button>
      {abierta && (
        <div className="p-4 border-t">
          {children}
        </div>
      )}
    </div>
  );
};

const StockDashboard = () => {
  const { data: producciones, isLoading: isProduccionesLoading, error: produccionesError, refetch } = useProducciones();
  const { data: allStock, isLoading: isAllStockLoading, error: allStockError } = useAllStock();
  const { data: ventas, isLoading: isVentasLoading, error: ventasError } = useVentas();
  const [selectedProduccionId, setSelectedProduccionId] = useState<number | null>(null);
  const [isMovimientosModalOpen, setIsMovimientosModalOpen] = useState(false);
  const [isProductosModalOpen, setIsProductosModalOpen] = useState(false);
  const [isValorModalOpen, setIsValorModalOpen] = useState(false);
  const [isVentaModalOpen, setIsVentaModalOpen] = useState(false);
  const [isProduccionModalOpen, setIsProduccionModalOpen] = useState(false);
  const [seccionAbierta, setSeccionAbierta] = useState<string | null>(null);

  console.log('Producciones:', producciones);
  console.log('Movimientos:', allStock);
  console.log('Ventas:', ventas);

  const toggleSeccion = (seccion: string) => {
    setSeccionAbierta(seccionAbierta === seccion ? null : seccion);
  };

  const openMovimientosModal = (produccionId: number) => {
    setSelectedProduccionId(produccionId);
    setIsMovimientosModalOpen(true);
  };

  const closeMovimientosModal = () => {
    setSelectedProduccionId(null);
    setIsMovimientosModalOpen(false);
  };

  const closeProductosModal = () => {
    setIsProductosModalOpen(false);
  };

  const closeValorModal = () => {
    setIsValorModalOpen(false);
  };

  const cerrarModalConExito = () => {
    setIsVentaModalOpen(false);
    setIsProduccionModalOpen(false);
    refetch();
  };

  const renderMovimientosDetails = () => {
    if (!producciones || producciones.length === 0) return (
      <p className="text-center text-gray-500 py-4">No hay datos disponibles.</p>
    );

    const produccion = producciones.find(p => p.id === selectedProduccionId);
    if (!produccion) return <p className="text-center text-gray-500 py-4">Producción no encontrada.</p>;

    const precioSugerido = produccion.precio_sugerido_venta;
    const precioSugeridoNumero = typeof precioSugerido === 'string' ? parseFloat(precioSugerido) : precioSugerido;

    return (
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Detalles de Producción
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-semibold">Nombre:</span> {produccion.nombre_produccion}</p>
          <p><span className="font-semibold">Stock Disponible:</span> {produccion.stock_disponible} {produccion.fk_unidad_medida?.unidad_base || 'N/A'}</p>
          <p><span className="font-semibold">Unidad de Medida:</span> {produccion.fk_unidad_medida?.nombre_medida || 'N/A'}</p>
          <p><span className="font-semibold">Precio Sugerido:</span> {precioSugeridoNumero != null && !isNaN(precioSugeridoNumero) ? `$${precioSugeridoNumero.toFixed(2)}` : 'N/A'}</p>
        </div>
      </div>
    );
  };

  const renderProductosDetails = () => {
    const productosConStock = producciones?.filter(p => p.stock_disponible >= 1) || [];
    if (productosConStock.length === 0) return (
      <p className="text-center text-gray-500 py-4">No hay productos con stock disponible.</p>
    );

    return (
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Productos con Stock
        </h3>
        <table className="w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="py-2 px-3 text-left rounded-tl-lg">Nombre</th>
              <th className="py-2 px-3 text-left rounded-tr-lg">Stock Disponible</th>
            </tr>
          </thead>
          <tbody>
            {productosConStock.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-green-50">
                <td className="py-2 px-3">{p.nombre_produccion}</td>
                <td className="py-2 px-3">{p.stock_disponible} {p.fk_unidad_medida?.unidad_base || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderValorDetails = () => {
    const productosConStock = producciones?.filter(p => p.stock_disponible >= 1) || [];
    if (productosConStock.length === 0) return (
      <p className="text-center text-gray-500 py-4">No hay productos con stock disponible.</p>
    );

    return (
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Valor Estimado por Producto
        </h3>
        <table className="w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="py-2 px-3 text-left rounded-tl-lg">Nombre</th>
              <th className="py-2 px-3 text-left rounded-tr-lg">Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {productosConStock.map((p) => {
              const precioSugerido = p.precio_sugerido_venta;
              const precioSugeridoNumero = typeof precioSugerido === 'string' ? parseFloat(precioSugerido) : precioSugerido;
              const valorTotal = precioSugeridoNumero != null && !isNaN(precioSugeridoNumero) ? precioSugeridoNumero * p.stock_disponible : 0;

              return (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-green-50">
                  <td className="py-2 px-3">{p.nombre_produccion}</td>
                  <td className="py-2 px-3">${valorTotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  if (isProduccionesLoading || isAllStockLoading || isVentasLoading) return (
    <div className="text-center py-8 text-gray-500 flex justify-center items-center">
      <Loader2 className="animate-spin mr-2" size={24} />
      Cargando datos...
    </div>
  );

  if (produccionesError) return (
    <div className="text-center py-8 text-red-500">
      Error al cargar producciones: {produccionesError.message}
    </div>
  );

  if (allStockError) return (
    <div className="text-center py-8 text-red-500">
      Error al cargar movimientos: {allStockError.message}
    </div>
  );

  if (ventasError) return (
    <div className="text-center py-8 text-red-500">
      Error al cargar ventas: {ventasError.message}
    </div>
  );

  const totalProductos = producciones?.filter(p => p.stock_disponible >= 1).length || 0;
  const valorEstimado = producciones?.reduce((sum, p) => {
    if (p.stock_disponible < 1) return sum;
    const precio = typeof p.precio_sugerido_venta === 'string' ? parseFloat(p.precio_sugerido_venta) : p.precio_sugerido_venta;
    return sum + ((precio != null && !isNaN(precio) ? precio : 0) * p.stock_disponible);
  }, 0) || 0;

  const mappedProducciones = (producciones || []).map((produccion) => {
    const precioSugerido = produccion.precio_sugerido_venta;
    const precioSugeridoNumero = typeof precioSugerido === 'string' ? parseFloat(precioSugerido) : precioSugerido;

    return {
      id: produccion.id,
      nombre: <span className="font-semibold text-gray-800">{produccion.nombre_produccion}</span>,
      stock_disponible: (
        <span className={produccion.stock_disponible > 0 ? "text-green-600" : "text-red-600"}>
          {produccion.stock_disponible} {produccion.fk_unidad_medida?.unidad_base || 'N/A'}
        </span>
      ),
      unidad_medida: produccion.fk_unidad_medida?.nombre_medida || 'N/A',
      precio_sugerido: precioSugeridoNumero != null && !isNaN(precioSugeridoNumero) ? `$${precioSugeridoNumero.toFixed(2)}` : 'N/A',
    };
  });

  const mappedMovimientos = (allStock || []).map((movimiento) => {
    const nombreProducto = movimiento.fk_id_produccion?.nombre_produccion || movimiento.fk_id_item_venta?.produccion?.nombre_produccion || 'N/A';
    const unidadBase = movimiento.fk_id_produccion?.fk_unidad_medida?.unidad_base || movimiento.fk_id_item_venta?.unidad_medida?.unidad_base || 'N/A';

    return {
      id: movimiento.id,
      producto: nombreProducto,
      tipo: (
        <span className={movimiento.movimiento === "Entrada" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
          {movimiento.movimiento}
        </span>
      ),
      cantidad: `${movimiento.cantidad} ${unidadBase}`,
      fecha: format(new Date(movimiento.fecha), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es }),
    };
  });

  const produccionesHeaders = ["ID", "Nombre", "Stock Disponible", "Unidad Medida", "Precio Sugerido"];
  const movimientosHeaders = ["ID", "Producto", "Tipo", "Cantidad", "Fecha"];

  return (
    <div className="mx-auto p-6 space-y-6 bg-transparent"> {/* Fondo transparente y espacio entre contenedores */}
      {/* Contenedor 1: Título y Botones */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-gray-800 text-center flex items-center gap-2">
            <Package size={24} className="text-green-600" />
            Stock Actual
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsVentaModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center gap-1 transition-colors"
              type="button"
            >
              <PlusCircle size={16} />
              Registrar Venta
            </button>
            <button
              onClick={() => setIsProduccionModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center gap-1 transition-colors"
              type="button"
            >
              <PlusCircle size={16} />
              Registrar Producción
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor 2: Tarjetas y Secciones Desplegables */}
      <div className="bg-white p-4 rounded-lg shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setIsProductosModalOpen(true)}
            className="bg-green-100 p-3 rounded-lg border border-green-200 hover:bg-green-200 transition-colors flex-1"
          >
            <h3 className="font-semibold text-sm text-green-700">Total Productos</h3>
            <p className="text-lg font-bold text-green-600">{totalProductos}</p>
          </button>
          <button
            onClick={() => setIsValorModalOpen(true)}
            className="bg-purple-100 p-3 rounded-lg border border-purple-200 hover:bg-purple-200 transition-colors flex-1"
          >
            <h3 className="font-semibold text-sm text-purple-700">Valor Estimado</h3>
            <p className="text-lg font-bold text-purple-600">${valorEstimado.toLocaleString()}</p>
          </button>
        </div>

        <SeccionDesplegable
          titulo="Inventario de Productos"
          icono={<Package className="h-5 w-5 text-green-600" />}
          cantidad={producciones?.length || 0}
          abierta={seccionAbierta === 'productos'}
          onToggle={() => toggleSeccion('productos')}
        >
          {producciones && producciones.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No hay productos registrados.</p>
          ) : (
            <Tabla
              title=""
              headers={produccionesHeaders}
              data={mappedProducciones}
              rowClassName={() => "hover:bg-green-50 transition-colors duration-150"}
              className="[&_table]:w-full [&_th]:py-2 [&_th]:bg-green-700 [&_th]:text-white [&_th]:font-bold [&_th]:text-sm [&_th:first-child]:rounded-tl-lg [&_th:last-child]:rounded-tr-lg [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm"
            />
          )}
        </SeccionDesplegable>

        <SeccionDesplegable
          titulo="Movimientos de Stock"
          icono={<Activity className="h-5 w-5 text-blue-600" />}
          cantidad={allStock?.length || 0}
          abierta={seccionAbierta === 'movimientos'}
          onToggle={() => toggleSeccion('movimientos')}
        >
          {allStock && allStock.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No hay movimientos registrados.</p>
          ) : (
            <Tabla
              title=""
              headers={movimientosHeaders}
              data={mappedMovimientos}
              rowClassName={() => "hover:bg-gray-50 transition-colors duration-150"}
              className="[&_table]:w-full [&_th]:py-2 [&_th]:bg-gray-700 [&_th]:text-white [&_th]:font-bold [&_th]:text-sm [&_th:first-child]:rounded-tl-lg [&_th:last-child]:rounded-tr-lg [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm"
            />
          )}
        </SeccionDesplegable>

        <SeccionDesplegable
          titulo="Ventas"
          icono={<DollarSign className="h-5 w-5 text-green-600" />}
          cantidad={ventas?.length || 0}
          abierta={seccionAbierta === 'ventas'}
          onToggle={() => toggleSeccion('ventas')}
        >
          <VentaComponent showButtons={false} />
        </SeccionDesplegable>

        <SeccionDesplegable
          titulo="Producciones"
          icono={<Package className="h-5 w-5 text-purple-600" />}
          cantidad={producciones?.length || 0}
          abierta={seccionAbierta === 'producciones'}
          onToggle={() => toggleSeccion('producciones')}
        >
          <ProduccionComponent showButtons={false} />
        </SeccionDesplegable>
      </div>

      {selectedProduccionId && (
        <VentanaModal
          isOpen={isMovimientosModalOpen}
          onClose={closeMovimientosModal}
          titulo="Detalles de Producción"
          contenido={renderMovimientosDetails()}
          size="md"
          className="bg-white rounded-lg shadow-md max-w-lg mx-auto"
        />
      )}

      <VentanaModal
        isOpen={isProductosModalOpen}
        onClose={closeProductosModal}
        titulo="Productos con Stock"
        contenido={renderProductosDetails()}
        size="md"
        className="bg-white rounded-lg shadow-md max-w-lg mx-auto"
      />

      <VentanaModal
        isOpen={isValorModalOpen}
        onClose={closeValorModal}
        titulo="Valor Estimado por Producto"
        contenido={renderValorDetails()}
        size="md"
        className="bg-white rounded-lg shadow-md max-w-lg mx-auto"
      />

      {isVentaModalOpen && (
        <VentanaModal
          isOpen={isVentaModalOpen}
          onClose={cerrarModalConExito}
          titulo="Registrar Venta"
          size="1.5xl"
          contenido={<CrearVenta onClose={cerrarModalConExito} onSuccess={cerrarModalConExito} />}
          className="bg-white rounded-lg shadow-md"
        />
      )}

      {isProduccionModalOpen && (
        <VentanaModal
          isOpen={isProduccionModalOpen}
          onClose={cerrarModalConExito}
          titulo="Registrar Producción"
          contenido={<CrearProduccion onClose={cerrarModalConExito} onSuccess={cerrarModalConExito} />}
          className="bg-white rounded-lg shadow-md"
        />
      )}
    </div>
  );
};

export default StockDashboard;