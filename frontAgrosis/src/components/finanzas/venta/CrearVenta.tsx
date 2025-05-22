// CrearVenta.tsx
import { useState } from 'react';
import { useCrearVenta } from '@/hooks/finanzas/venta/useVenta';
import { useProduccion } from '@/hooks/finanzas/produccion/useProduccion';
import { useMedidas } from '@/hooks/inventario/unidadMedida/useMedidad';
import Button from '@/components/globales/Button';
import VentanaModal from '@/components/globales/VentanasModales';
import CrearUnidadMedida from '@/components/inventario/unidadMedida/UnidadMedida';
import CrearProduccion from '@/components/finanzas/produccion/CrearProduccion';
import { showToast } from '@/components/globales/Toast';
import { Trash2, PlusCircle, X, Package, Scale, ShoppingCart } from 'lucide-react';

interface ProductoSeleccionado {
  produccionId: number;
  cantidad: number;
  precioUnidad: number;
  precioPorUnidad: number;
  precioPorUnidadBase: number;
  unidadMedidaId: number;
  nombreProduccion: string;
  stockDisponible: number;
  unidadBase: string;
  subtotal: number;
}

interface CrearVentaProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CrearVenta: React.FC<CrearVentaProps> = ({ onClose, onSuccess }) => {
  const { data: producciones = [], isLoading: isLoadingProducciones } = useProduccion();
  const { data: unidades = [], isLoading: isLoadingUnidades } = useMedidas();
  const crearVentaMutation = useCrearVenta();

  const [productos, setProductos] = useState<ProductoSeleccionado[]>([]);
  const [productoActual, setProductoActual] = useState<Partial<ProductoSeleccionado>>({});
  const [totalVenta, setTotalVenta] = useState(0);
  const [modalMedidaAbierto, setModalMedidaAbierto] = useState(false);
  const [modalProduccionAbierto, setModalProduccionAbierto] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unidadSeleccionada = unidades.find((u) => u.id === productoActual.unidadMedidaId);

  const seleccionarProducto = (produccionId: number, unidadMedidaId?: number) => {
    setProductoActual({
      ...productoActual,
      produccionId,
      unidadMedidaId,
    });
  };

  const agregarProducto = () => {
    if (
      !productoActual.produccionId ||
      !productoActual.cantidad ||
      !productoActual.precioUnidad ||
      !productoActual.unidadMedidaId
    ) {
      setError('Todos los campos son obligatorios');
      showToast({ title: 'Faltan campos por completar', timeout: 3000 });
      return;
    }

    const produccion = producciones.find((p) => p.id === productoActual.produccionId);
    if (!produccion) {
      setError('Producción no encontrada');
      showToast({ title: 'Producción no encontrada', timeout: 3000 });
      return;
    }

    const unidad = unidades.find((u) => u.id === productoActual.unidadMedidaId);
    if (!unidad) {
      setError('Unidad de medida no encontrada');
      showToast({ title: 'Unidad de medida no encontrada', timeout: 3000 });
      return;
    }

    if (productoActual.cantidad > produccion.stock_disponible) {
      setError(
        `La cantidad supera el stock disponible (${produccion.stock_disponible} ${unidad.unidad_base})`,
      );
      showToast({
        title: `La cantidad supera el stock disponible (${produccion.stock_disponible} ${unidad.unidad_base})`,
        timeout: 3000,
      });
      return;
    }

    if (productoActual.cantidad <= 0 || productoActual.precioUnidad <= 0) {
      setError('La cantidad y el precio deben ser mayores a 0');
      showToast({ title: 'La cantidad y el precio deben ser mayores a 0', timeout: 3000 });
      return;
    }

    const precioPorUnidad = productoActual.precioUnidad / productoActual.cantidad;
    const precioPorUnidadBase = precioPorUnidad / unidad.factor_conversion;

    const nuevoProducto: ProductoSeleccionado = {
      produccionId: productoActual.produccionId!,
      cantidad: productoActual.cantidad!,
      precioUnidad: productoActual.precioUnidad!,
      precioPorUnidad,
      precioPorUnidadBase,
      unidadMedidaId: productoActual.unidadMedidaId!,
      nombreProduccion: produccion.nombre_produccion,
      stockDisponible: produccion.stock_disponible,
      unidadBase: unidad.unidad_base,
      subtotal: productoActual.precioUnidad!,
    };

    setProductos([...productos, nuevoProducto]);
    setTotalVenta(totalVenta + nuevoProducto.subtotal);
    setProductoActual({});
    setError(null);
    showToast({ title: 'Producto agregado correctamente', timeout: 3000 });
  };

  const eliminarProducto = (index: number) => {
    const productoEliminado = productos[index];
    setProductos(productos.filter((_, i) => i !== index));
    setTotalVenta(totalVenta - productoEliminado.subtotal);
    showToast({ title: 'Producto eliminado', timeout: 3000 });
  };

  const finalizarVenta = () => {
    if (productos.length === 0) {
      setError('Debe agregar al menos un producto');
      showToast({ title: 'Debe agregar al menos un producto', timeout: 3000 });
      return;
    }

    const items = productos.map((producto) => ({
      produccion: producto.produccionId,
      cantidad: producto.cantidad,
      precio_unidad: producto.precioUnidad,
      unidad_medida: producto.unidadMedidaId,
      cantidad_en_base:
        producto.cantidad * (unidades.find((u) => u.id === producto.unidadMedidaId)?.factor_conversion || 1),
    }));

    crearVentaMutation.mutate(
      { items },
      {
        onSuccess: () => {
          showToast({ title: 'Venta creada exitosamente', timeout: 3000 });
          setProductos([]);
          setTotalVenta(0);
          onSuccess(); // Call onSuccess to trigger refetch and close modal
          onClose(); // Close the modal
        },
        onError: (error: any) => {
          console.error('Error en crearVentaMutation:', error);
          showToast({ title: 'Error al crear la venta', timeout: 3000 });
        },
      },
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {error && (
        <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-start">
          <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Panel de Productos */}
        <div className="lg:col-span-2 bg-gray-50 p-5 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Package className="h-5 w-5 text-gray-600 mr-2" />
              Productos Disponibles
            </h2>
            <Button
              text="Nueva Producción"
              icon={PlusCircle}
              variant="outline"
              size="sm"
              onClick={() => setModalProduccionAbierto(true)}
            />
          </div>

          {isLoadingProducciones || isLoadingUnidades ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-pulse text-gray-500">Cargando productos...</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {producciones
                  .filter((p) => p.stock_disponible >= 1)
                  .map((p) => (
                    <div
                      key={p.id}
                      className={`p-4 border rounded-lg transition-all cursor-pointer ${
                        productoActual.produccionId === p.id
                          ? 'border-green-500 bg-green-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-white'
                      }`}
                      onClick={() => seleccionarProducto(p.id, p.fk_unidad_medida?.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{p.nombre_produccion}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Stock:{' '}
                            <span className="font-medium">
                              {p.stock_disponible} {p.fk_unidad_medida?.unidad_base}
                            </span>
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            productoActual.produccionId === p.id
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {p.fk_unidad_medida?.unidad_base}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              {producciones.filter((p) => p.stock_disponible > 1).length === 0 && (
                <div className="text-center py-6 bg-white border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No hay productos disponibles con stock</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Panel de Detalles */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Scale className="h-5 w-5 text-gray-600 mr-2" />
            Detalles del Producto
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
              <input
                type="number"
                min="0.01"
                step="any"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                value={productoActual.cantidad || ''}
                onChange={(e) =>
                  setProductoActual({
                    ...productoActual,
                    cantidad: parseFloat(e.target.value),
                  })
                }
                placeholder="Ej: 2.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Total</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="w-full pl-8 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  value={productoActual.precioUnidad || ''}
                  onChange={(e) =>
                    setProductoActual({
                      ...productoActual,
                      precioUnidad: parseFloat(e.target.value),
                    })
                  }
                  placeholder="Ej: 12.99"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidad de Medida</label>
              <div className="flex gap-2">
                <select
                  className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  value={productoActual.unidadMedidaId || ''}
                  onChange={(e) =>
                    setProductoActual({
                      ...productoActual,
                      unidadMedidaId: parseInt(e.target.value),
                    })
                  }
                  disabled={!productoActual.produccionId}
                >
                  <option value="">Seleccionar unidad</option>
                  {unidades.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombre_medida} ({u.unidad_base})
                    </option>
                  ))}
                </select>
                <Button
                  text="Nueva"
                  icon={PlusCircle}
                  variant="outline"
                  size="sm"
                  onClick={() => setModalMedidaAbierto(true)}
                />
              </div>
            </div>

            {unidadSeleccionada && productoActual.cantidad && productoActual.precioUnidad && (
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-600">Precio por unidad:</div>
                  <div className="font-medium text-right">
                    ${(productoActual.precioUnidad / productoActual.cantidad).toFixed(2)} /{' '}
                    {unidadSeleccionada.nombre_medida}
                  </div>
                  <div className="text-gray-600">Precio por unidad base:</div>
                  <div className="font-medium text-right">
                    ${((productoActual.precioUnidad / productoActual.cantidad) / unidadSeleccionada.factor_conversion).toFixed(2)} /{' '}
                    {unidadSeleccionada.unidad_base}
                  </div>
                </div>
              </div>
            )}

            <Button
              text="Agregar a la venta"
              onClick={agregarProducto}
              variant="green"
              size="md"
              className="w-full mt-2"
              disabled={
                !productoActual.produccionId ||
                !productoActual.cantidad ||
                !productoActual.precioUnidad ||
                !productoActual.unidadMedidaId
              }
            />
          </div>
        </div>
      </div>

      {/* Lista de Productos Agregados */}
      {productos.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
          <div className="bg-gray-800 text-white px-5 py-3">
            <h2 className="font-medium flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Resumen de Venta
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P. Unitario
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P. Base
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productos.map((producto, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {producto.nombreProduccion}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-center text-gray-500">
                      {producto.cantidad} {producto.unidadBase}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-right text-gray-500">
                      ${producto.precioPorUnidad.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-right text-gray-500">
                      ${producto.precioPorUnidadBase.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                      ${producto.subtotal.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-center">
                      <button
                        onClick={() => eliminarProducto(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                        title="Eliminar producto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-3 text-right text-sm font-medium text-gray-500"
                  >
                    Total:
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-bold text-gray-900">
                    ${totalVenta.toFixed(2)}
                  </td>
                  <td className="px-3 py-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Botones de Acción */}
      <div className="flex flex-wrap justify-end gap-3">
        <Button text="Cancelar" variant="outline" size="md" onClick={onClose} />
        <Button
          text="Finalizar Venta"
          variant="green"
          size="md"
          onClick={finalizarVenta}
          disabled={productos.length === 0}
          className="bg-green-600 hover:bg-green-700"
        />
      </div>

      {/* Modales */}
      <VentanaModal
        isOpen={modalMedidaAbierto}
        onClose={() => setModalMedidaAbierto(false)}
        titulo="Crear Unidad de Medida"
        contenido={<CrearUnidadMedida onSuccess={() => setModalMedidaAbierto(false)} />}
        size="lg"
      />

      <VentanaModal
        isOpen={modalProduccionAbierto}
        onClose={() => setModalProduccionAbierto(false)}
        titulo="Crear Producción"
        contenido={<CrearProduccion onSuccess={() => setModalProduccionAbierto(false)} />}
        size="lg"
      />
    </div>
  );
};

export default CrearVenta;