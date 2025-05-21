import { useState } from 'react';
import { useCrearVenta } from '@/hooks/finanzas/venta/useVenta';
import { useProduccion } from '@/hooks/finanzas/produccion/useProduccion';
import { useMedidas } from '@/hooks/inventario/unidadMedida/useMedidad';
import Button from '@/components/globales/Button';
import VentanaModal from '@/components/globales/VentanasModales';
import CrearUnidadMedida from '@/components/inventario/unidadMedida/UnidadMedida';
import CrearProduccion from '@/components/finanzas/produccion/CrearProduccion';
import { addToast } from '@heroui/react';
import { Trash2 } from 'lucide-react';

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

const CrearVenta = () => {
  const { data: producciones = [], isLoading: isLoadingProducciones } = useProduccion();
  const { data: unidades = [], isLoading: isLoadingUnidades } = useMedidas();
  const crearVentaMutation = useCrearVenta();

  const [productos, setProductos] = useState<ProductoSeleccionado[]>([]);
  const [productoActual, setProductoActual] = useState<Partial<ProductoSeleccionado>>({});
  const [totalVenta, setTotalVenta] = useState(0);
  const [modalMedidaAbierto, setModalMedidaAbierto] = useState(false);
  const [modalProduccionAbierto, setModalProduccionAbierto] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unidadSeleccionada = unidades.find(u => u.id === productoActual.unidadMedidaId);

  const seleccionarProducto = (produccionId: number, unidadMedidaId?: number) => {
    setProductoActual({
      ...productoActual,
      produccionId,
      unidadMedidaId
    });
  };

  const agregarProducto = () => {
    if (
      !productoActual.produccionId ||
      !productoActual.cantidad ||
      !productoActual.precioUnidad ||
      !productoActual.unidadMedidaId
    ) {
      setError("Todos los campos son obligatorios");
      addToast({ title: "Faltan campos por completar", timeout: 3000 });
      return;
    }

    const produccion = producciones.find(p => p.id === productoActual.produccionId);
    if (!produccion) {
      setError("Producción no encontrada");
      addToast({ title: "Producción no encontrada", timeout: 3000 });
      return;
    }

    const unidad = unidades.find(u => u.id === productoActual.unidadMedidaId);
    if (!unidad) {
      setError("Unidad de medida no encontrada");
      addToast({ title: "Unidad de medida no encontrada", timeout: 3000 });
      return;
    }

    if (productoActual.cantidad > produccion.stock_disponible) {
      setError(`La cantidad supera el stock disponible (${produccion.stock_disponible} ${unidad.unidad_base})`);
      addToast({ title: `La cantidad supera el stock disponible (${produccion.stock_disponible} ${unidad.unidad_base})`, timeout: 3000 });
      return;
    }

    if (productoActual.cantidad <= 0 || productoActual.precioUnidad <= 0) {
      setError("La cantidad y el precio deben ser mayores a 0");
      addToast({ title: "La cantidad y el precio deben ser mayores a 0", timeout: 3000 });
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
      subtotal: productoActual.precioUnidad!
    };

    setProductos([...productos, nuevoProducto]);
    setTotalVenta(totalVenta + nuevoProducto.subtotal);
    setProductoActual({});
    setError(null);
    addToast({ title: "Producto agregado correctamente", timeout: 3000 });
  };

  const eliminarProducto = (index: number) => {
    const productoEliminado = productos[index];
    setProductos(productos.filter((_, i) => i !== index));
    setTotalVenta(totalVenta - productoEliminado.subtotal);
    addToast({ title: "Producto eliminado", timeout: 3000 });
  };

  const finalizarVenta = () => {
    if (productos.length === 0) {
      setError("Debe agregar al menos un producto");
      addToast({ title: "Debe agregar al menos un producto", timeout: 3000 });
      return;
    }

    const items = productos.map(producto => ({
      produccion: producto.produccionId,
      cantidad: producto.cantidad,
      precio_unidad: producto.precioUnidad,
      unidad_medida: producto.unidadMedidaId,
      cantidad_en_base: producto.cantidad * (unidades.find(u => u.id === producto.unidadMedidaId)?.factor_conversion || 1)
    }));

    console.log("Datos enviados a crearVentaMutation:", { items });

    crearVentaMutation.mutate({ items }, {
      onSuccess: () => {
        addToast({ title: "Venta creada exitosamente", timeout: 3000 });
        setProductos([]);
        setTotalVenta(0);
      },
      onError: (error) => {
        console.error("Error en crearVentaMutation:", error);
        addToast({ title: "Error al crear la venta", timeout: 3000 });
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-gray-50 rounded-xl shadow-sm">
      <h1 className="text-xl font-bold mb-4 text-gray-900">Caja de Ventas</h1>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {isLoadingProducciones || isLoadingUnidades ? (
        <div className="text-sm text-gray-500">Cargando productos y unidades...</div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <h2 className="text-sm font-semibold mb-2 text-gray-800">Productos Disponibles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {producciones
              .filter(p => p.stock_disponible >= 1)
              .map((p) => (
                <div
                  key={p.id}
                  className={`p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition cursor-pointer ${
                    productoActual.produccionId === p.id ? 'border-green-300' : ''
                  }`}
                  onClick={() => seleccionarProducto(p.id, p.fk_unidad_medida?.id)}
                >
                  <h3 className="text-sm font-semibold text-gray-800">{p.nombre_produccion}</h3>
                  <p className="text-xs text-gray-600">
                    Stock: {p.stock_disponible} {p.fk_unidad_medida?.unidad_base}
                  </p>
                  <Button
                    text="Seleccionar"
                    variant={productoActual.produccionId === p.id ? 'solid' : 'green'}
                    size="xs"
                    className={`mt-2 w-full ${
                      productoActual.produccionId === p.id
                        ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                        : 'text-green-600 border-green-600 hover:bg-green-50'
                    }`}
                    onClick={() => seleccionarProducto(p.id, p.fk_unidad_medida?.id)}
                  />
                </div>
              ))}
            {producciones.filter(p => p.stock_disponible > 1).length === 0 && (
              <p className="text-sm text-gray-500 col-span-full">No hay productos con stock mayor a 1</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="w-28">
              <label className="block text-xs font-medium text-gray-600 mb-1">Cantidad</label>
              <input
                type="number"
                min="0.01"
                step="any"
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-300 text-sm"
                value={productoActual.cantidad || ''}
                onChange={(e) => setProductoActual({
                  ...productoActual,
                  cantidad: parseFloat(e.target.value)
                })}
              />
            </div>

            <div className="w-28">
              <label className="block text-xs font-medium text-gray-600 mb-1">Precio Total</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-300 text-sm"
                value={productoActual.precioUnidad || ''}
                onChange={(e) => setProductoActual({
                  ...productoActual,
                  precioUnidad: parseFloat(e.target.value)
                })}
              />
            </div>

            <div className="w-36">
              <label className="block text-xs font-medium text-gray-600 mb-1">Unidad</label>
              <select
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-300 text-sm"
                value={productoActual.unidadMedidaId || ''}
                onChange={(e) => setProductoActual({
                  ...productoActual,
                  unidadMedidaId: parseInt(e.target.value)
                })}
                disabled={!productoActual.produccionId}
              >
                <option value="">Seleccionar unidad</option>
                {unidades.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre_medida} ({u.unidad_base})
                  </option>
                ))}
              </select>
            </div>

            <Button
              text="Agregar"
              onClick={agregarProducto}
              variant="green"
              size="sm"
              className="h-10"
              disabled={
                !productoActual.produccionId ||
                !productoActual.cantidad ||
                !productoActual.precioUnidad ||
                !productoActual.unidadMedidaId
              }
            />
          </div>

          {unidadSeleccionada && productoActual.cantidad && productoActual.precioUnidad && (
            <div className="mt-2 text-xs text-gray-600">
              <p>
                Precio por {unidadSeleccionada.nombre_medida}: $
                {(productoActual.precioUnidad / productoActual.cantidad).toFixed(2)}
              </p>
              <p>
                Precio por {unidadSeleccionada.unidad_base}: $
                {((productoActual.precioUnidad / productoActual.cantidad) / unidadSeleccionada.factor_conversion).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      )}

      {productos.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Productos Agregados</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 w-1/3">Producto</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">Cantidad</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Precio Total</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Precio/Unidad</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Precio/Base</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Subtotal</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">Acción</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-semibold text-gray-800">{producto.nombreProduccion}</td>
                    <td className="px-3 py-2 text-sm text-center">{producto.cantidad} {producto.unidadBase}</td>
                    <td className="px-3 py-2 text-sm text-right">${producto.precioUnidad.toFixed(2)}</td>
                    <td className="px-3 py-2 text-sm text-right">${producto.precioPorUnidad.toFixed(2)}</td>
                    <td className="px-3 py-2 text-sm text-right">${producto.precioPorUnidadBase.toFixed(2)}</td>
                    <td className="px-3 py-2 text-sm text-right">${producto.subtotal.toFixed(2)}</td>
                    <td className="px-3 py-2 text-center">
                      <Button
                        text=""
                        icon={Trash2}
                        variant="danger"
                        size="xs"
                        onClick={() => eliminarProducto(index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100">
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-right text-sm font-bold">Total:</td>
                  <td className="px-3 py-2 text-right text-sm font-bold">${totalVenta.toFixed(2)}</td>
                  <td className="px-3 py-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button
          text="Crear Unidad"
          variant="outline"
          size="sm"
          onClick={() => setModalMedidaAbierto(true)}
        />
        <Button
          text="Crear Producción"
          variant="outline"
          size="sm"
          onClick={() => setModalProduccionAbierto(true)}
        />
        <Button
          text="Cancelar"
          variant="danger"
          size="sm"
          onClick={() => window.history.back()}
        />
        <Button
          text="Finalizar Venta"
          variant="green"
          size="sm"
          onClick={finalizarVenta}
          disabled={productos.length === 0}
        />
      </div>

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