import { useState, useEffect } from 'react';
import { useCrearVenta } from '@/hooks/finanzas/venta/useVenta';
import { useProduccion } from '@/hooks/finanzas/produccion/useProduccion';
import { useMedidas } from '@/hooks/inventario/unidadMedida/useMedidad';
import Button from '@/components/globales/Button';
import VentanaModal from '@/components/globales/VentanasModales';
import CrearUnidadMedida from '@/components/inventario/unidadMedida/UnidadMedida';
import CrearProduccion from '@/components/finanzas/produccion/CrearProduccion';
import { showToast } from '@/components/globales/Toast';
import { Trash2, PlusCircle, X, Package, Scale, ShoppingCart } from 'lucide-react';

import { Produccion as ProduccionType } from '@/hooks/finanzas/produccion/useProduccion';
import { UnidadMedida as UnidadMedidaType } from '@/hooks/inventario/unidadMedida/useMedidad';

interface ProductoSeleccionado {
  produccionId: number;
  cantidad: number;
  precioUnidad: number;
  precioUnidadConDescuento: number;
  unidadMedidaId: number;
  nombreProduccion: string;
  stockDisponible: number;
  unidadBaseProduccion: string;
  nombreUnidadMedidaProduccion: string;
  nombreUnidadMedidaVenta: string;
  factorConversionUnidadVenta: number;
  subtotal: number;
  descuentoPorcentaje: number;
}

interface CrearVentaProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CrearVenta: React.FC<CrearVentaProps> = ({ onClose, onSuccess }) => {
  const { data: producciones = [], isLoading: isLoadingProducciones, refetch: refetchProducciones } = useProduccion();
  const { data: unidades = [], isLoading: isLoadingUnidades, refetch: refetchUnidades } = useMedidas();
  const crearVentaMutation = useCrearVenta();

  const [productos, setProductos] = useState<ProductoSeleccionado[]>([]);
  const [productoActual, setProductoActual] = useState<Partial<ProductoSeleccionado>>({});
  const [error, setError] = useState<string | null>(null);
  const [stockAjustado, setStockAjustado] = useState<{ [key: number]: number }>({});
  const [modalMedidaAbierto, setModalMedidaAbierto] = useState(false);
  const [modalProduccionAbierto, setModalProduccionAbierto] = useState(false);

  const produccionActual = producciones.find((p) => p.id === productoActual.produccionId);
  const unidadSeleccionadaParaVenta = unidades.find((u) => u.id === productoActual.unidadMedidaId);
  const unidadProduccionOriginal = unidades.find((u) => u.id === produccionActual?.fk_unidad_medida?.id);

  // Inicializar stockAjustado solo si está vacío
  useEffect(() => {
    if (Object.keys(stockAjustado).length === 0) {
      const initialStock: { [key: number]: number } = {};
      producciones.forEach((prod) => {
        initialStock[prod.id] = prod.stock_disponible;
      });
      setStockAjustado(initialStock);
      console.log('Inicializando stockAjustado:', initialStock);
    }
  }, [producciones, stockAjustado]);

  const calcularPrecioPorUnidadDeVenta = (
    produccion: ProduccionType | undefined,
    unidadVenta: UnidadMedidaType | undefined,
    unidadProduccion: UnidadMedidaType | undefined,
  ): number | undefined => {
    if (
      !produccion ||
      produccion.precio_sugerido_venta === null ||
      produccion.precio_sugerido_venta === undefined ||
      !unidadVenta ||
      !unidadProduccion ||
      unidadProduccion.factor_conversion === 0
    ) {
      return undefined;
    }

    const precioPorUnidadBase = produccion.precio_sugerido_venta / unidadProduccion.factor_conversion;
    if (isNaN(precioPorUnidadBase)) {
      return undefined;
    }

    return precioPorUnidadBase * unidadVenta.factor_conversion;
  };

  const precioUnitarioCalculado = calcularPrecioPorUnidadDeVenta(
    produccionActual,
    unidadSeleccionadaParaVenta,
    unidadProduccionOriginal,
  );
  const precioUnitarioConDescuento = precioUnitarioCalculado && productoActual.descuentoPorcentaje !== undefined
    ? precioUnitarioCalculado * (1 - productoActual.descuentoPorcentaje / 100)
    : precioUnitarioCalculado;
  const subtotalProductoActual = (productoActual.cantidad || 0) * (precioUnitarioCalculado || 0);
  const subtotalConDescuentoProductoActual = (productoActual.cantidad || 0) * (precioUnitarioConDescuento || 0);
  const totalVenta = productos.reduce((sum, item) => sum + item.subtotal * (1 - item.descuentoPorcentaje / 100), 0);

  useEffect(() => {
    setProductoActual((prev) => ({
      ...prev,
      precioUnidad:
        typeof precioUnitarioCalculado === 'number' && !isNaN(precioUnitarioCalculado)
          ? precioUnitarioCalculado
          : undefined,
      precioUnidadConDescuento:
        typeof precioUnitarioConDescuento === 'number' && !isNaN(precioUnitarioConDescuento)
          ? precioUnitarioConDescuento
          : undefined,
    }));
  }, [produccionActual, unidadSeleccionadaParaVenta, productoActual.descuentoPorcentaje]);

  const seleccionarProducto = (produccion: ProduccionType) => {
    const unidadProduccion = unidades.find((u) => u.id === produccion.fk_unidad_medida?.id);

    setProductoActual({
      produccionId: produccion.id,
      nombreProduccion: produccion.nombre_produccion,
      stockDisponible: stockAjustado[produccion.id] ?? produccion.stock_disponible,
      unidadBaseProduccion: unidadProduccion?.unidad_base || '',
      nombreUnidadMedidaProduccion: unidadProduccion?.nombre_medida || '',
      cantidad: undefined,
      precioUnidad: undefined,
      precioUnidadConDescuento: undefined,
      unidadMedidaId: produccion.fk_unidad_medida?.id || undefined,
      descuentoPorcentaje: 0,
    });
    setError(null);
    console.log('Producto seleccionado:', produccion.id, 'Stock ajustado:', stockAjustado[produccion.id]);
  };

  const agregarProducto = () => {
    if (
      !productoActual.produccionId ||
      !productoActual.cantidad ||
      productoActual.cantidad <= 0 ||
      !unidadSeleccionadaParaVenta ||
      precioUnitarioCalculado === undefined ||
      isNaN(precioUnitarioCalculado) ||
      precioUnitarioCalculado <= 0 ||
      productoActual.descuentoPorcentaje === undefined ||
      productoActual.descuentoPorcentaje < 0 ||
      productoActual.descuentoPorcentaje > 100
    ) {
      setError('Por favor, complete todos los campos requeridos y asegure que la cantidad, el precio y el descuento sean válidos.');
      showToast({ title: 'Faltan campos o datos inválidos en el producto', timeout: 3000 });
      return;
    }

    if (precioUnitarioConDescuento !== undefined && precioUnitarioConDescuento < 0) {
      setError('El descuento aplicado resulta en un precio negativo. Por favor, ajuste el porcentaje de descuento.');
      showToast({ title: 'El descuento no puede resultar en un precio negativo', timeout: 3000 });
      return;
    }

    const produccion = producciones.find((p) => p.id === productoActual.produccionId);
    if (!produccion) {
      setError('Producción no encontrada. Seleccione una producción válida.');
      showToast({ title: 'Producción no encontrada', timeout: 3000 });
      return;
    }

    const cantidadEnBaseParaStock = productoActual.cantidad * unidadSeleccionadaParaVenta.factor_conversion;
    const stockActual = stockAjustado[produccion.id] ?? produccion.stock_disponible;
    if (cantidadEnBaseParaStock > stockActual) {
      setError(
        `La cantidad (${productoActual.cantidad} ${unidadSeleccionadaParaVenta.nombre_medida}) supera el stock disponible (${stockActual.toFixed(0)} ${unidadProduccionOriginal?.unidad_base})`,
      );
      showToast({
        title: `La cantidad supera el stock disponible (${stockActual.toFixed(0)} ${unidadProduccionOriginal?.unidad_base})`,
        timeout: 3000,
      });
      return;
    }

    // Buscar si ya existe un producto igual en la venta
    const productoExistenteIndex = productos.findIndex(
      (p) =>
        p.produccionId === productoActual.produccionId &&
        p.unidadMedidaId === productoActual.unidadMedidaId &&
        p.descuentoPorcentaje === productoActual.descuentoPorcentaje
    );

    const nuevoStock = Math.max(0, stockActual - cantidadEnBaseParaStock);
    console.log(`Agregando producto: ${produccion.nombre_produccion}, Cantidad en base: ${cantidadEnBaseParaStock}, Stock actual: ${stockActual}, Nuevo stock: ${nuevoStock}`);

    if (productoExistenteIndex >= 0) {
      // Si existe, actualizamos la cantidad
      const productosActualizados = [...productos];
      const productoExistente = productosActualizados[productoExistenteIndex];

      const nuevaCantidad = productoExistente.cantidad + (productoActual.cantidad || 0);
      const nuevoSubtotal = nuevaCantidad * productoExistente.precioUnidad;

      productosActualizados[productoExistenteIndex] = {
        ...productoExistente,
        cantidad: nuevaCantidad,
        subtotal: nuevoSubtotal,
        stockDisponible: nuevoStock,
      };

      setProductos(productosActualizados);
    } else {
      // Si no existe, agregamos como nuevo producto
      const nuevoProducto: ProductoSeleccionado = {
        produccionId: productoActual.produccionId!,
        cantidad: productoActual.cantidad!,
        precioUnidad: precioUnitarioCalculado!,
        precioUnidadConDescuento: precioUnitarioConDescuento!,
        unidadMedidaId: productoActual.unidadMedidaId!,
        nombreProduccion: produccion.nombre_produccion,
        stockDisponible: nuevoStock,
        unidadBaseProduccion: unidadProduccionOriginal!.unidad_base,
        nombreUnidadMedidaProduccion: unidadProduccionOriginal!.nombre_medida,
        nombreUnidadMedidaVenta: unidadSeleccionadaParaVenta.nombre_medida,
        factorConversionUnidadVenta: unidadSeleccionadaParaVenta.factor_conversion,
        subtotal: subtotalProductoActual!,
        descuentoPorcentaje: productoActual.descuentoPorcentaje!,
      };

      setProductos([...productos, nuevoProducto]);
    }

    // Actualizar el stock ajustado
    setStockAjustado((prev) => ({
      ...prev,
      [produccion.id]: nuevoStock,
    }));

    setProductoActual({});
    setError(null);
    showToast({ title: 'Producto agregado correctamente', timeout: 3000 });
  };

  const eliminarProducto = (index: number) => {
    const productoEliminado = productos[index];
    const cantidadEnBase = productoEliminado.cantidad * productoEliminado.factorConversionUnidadVenta;

    setStockAjustado((prev) => {
      const nuevoStock = (prev[productoEliminado.produccionId] || 0) + cantidadEnBase;
      console.log(`Eliminando producto: ${productoEliminado.nombreProduccion}, Cantidad en base: ${cantidadEnBase}, Nuevo stock: ${nuevoStock}`);
      return {
        ...prev,
        [productoEliminado.produccionId]: nuevoStock,
      };
    });

    setProductos(productos.filter((_, i) => i !== index));
    showToast({ title: 'Producto eliminado', timeout: 3000 });
  };

  const finalizarVenta = () => {
    if (productos.length === 0) {
      setError('Debe agregar al menos un producto a la venta');
      showToast({ title: 'Debe agregar al menos un producto', timeout: 3000 });
      return;
    }

    const itemsParaEnviar = productos.map((producto) => ({
      produccion: producto.produccionId,
      cantidad: producto.cantidad,
      unidad_medida: producto.unidadMedidaId,
      precio_unidad: producto.precioUnidad,
      descuento_porcentaje: producto.descuentoPorcentaje,
    }));

    crearVentaMutation.mutate(
      { items: itemsParaEnviar },
      {
        onSuccess: () => {
          showToast({ title: 'Venta creada exitosamente', timeout: 3000 });
          setProductos([]);
          setStockAjustado({}); // Reiniciar stockAjustado después de la venta
          onSuccess();
          onClose();
        },
        onError: (error: any) => {
          console.error('Error en crearVentaMutation:', error);
          const errorMessage = error?.message || 'Error al crear la venta. Revise los datos.';
          showToast({ title: errorMessage, timeout: 5000 });

          productos.forEach((producto) => {
            const cantidadEnBase = producto.cantidad * producto.factorConversionUnidadVenta;
            setStockAjustado((prev) => ({
              ...prev,
              [producto.produccionId]: (prev[producto.produccionId] || 0) + cantidadEnBase,
            }));
          });
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
        <div className="lg:col-span-2 bg-gray-50 p-5 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Package className="h-5 w-5 text-gray-600 mr-2" />
              Productos Disponibles
            </h2>
          </div>

          {isLoadingProducciones || isLoadingUnidades ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-pulse text-gray-500">Cargando productos...</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 overflow-y-auto max-h-80 pr-2">
                {producciones
                  .filter((p) => (stockAjustado[p.id] ?? p.stock_disponible) > 0)
                  .map((p) => {
                    const prodUnit = unidades.find((u) => u.id === p.fk_unidad_medida?.id);
                    const displayPrecioSugerido =
                      p.precio_sugerido_venta !== null &&
                      p.precio_sugerido_venta !== undefined &&
                      typeof p.precio_sugerido_venta === 'number'
                        ? p.precio_sugerido_venta
                        : null;

                    return (
                      <div
                        key={p.id}
                        className={`p-4 border rounded-lg transition-all cursor-pointer ${productoActual.produccionId === p.id
                          ? 'border-green-500 bg-green-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-white'
                        }`}
                        onClick={() => seleccionarProducto(p)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800">{p.nombre_produccion}</h3>
                            <p className="text-xs text-gray-500 mt-1">
                              Stock:{' '}
                              <span className="font-medium">
                                {(stockAjustado[p.id] ?? p.stock_disponible).toFixed(0)} {prodUnit?.unidad_base}
                              </span>
                            </p>
                            {displayPrecioSugerido !== null && (
                              <p className="text-xs text-gray-500">
                                Precio Sugerido: <span className="font-medium">${Number(displayPrecioSugerido).toFixed(2)} por {prodUnit?.nombre_medida}</span>
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${productoActual.produccionId === p.id
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {prodUnit?.unidad_base}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {producciones.filter((p) => (stockAjustado[p.id] ?? p.stock_disponible) > 0).length === 0 && (
                <div className="text-center py-6 bg-white border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No hay productos disponibles con stock</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Scale className="h-5 w-5 text-gray-600 mr-2" />
            Detalles del Producto
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Producción</label>
              <div className="relative">
                <select
                  className="w-full p-2.5 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none"
                  value={productoActual.produccionId || ''}
                  onChange={(e) => {
                    const selectedProdId = parseInt(e.target.value);
                    const selectedProd = producciones.find((p) => p.id === selectedProdId);
                    if (selectedProd) {
                      seleccionarProducto(selectedProd);
                    } else {
                      setProductoActual({});
                    }
                  }}
                >
                  <option value="">Seleccionar una producción</option>
                  {producciones
                    .filter((p) => (stockAjustado[p.id] ?? p.stock_disponible) > 0)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre_produccion} (Stock: {(stockAjustado[p.id] ?? p.stock_disponible).toFixed(0)}{' '}
                        {p.fk_unidad_medida?.unidad_base})
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={() => setModalProduccionAbierto(true)}
                  className="absolute right-0 top-0 bottom-0 h-full w-10 flex items-center justify-center text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-r-md shadow-sm transition-colors"
                  title="Nueva Producción"
                >
                  <PlusCircle className="h-5 w-5" />
                </button>
                <div className="pointer-events-none absolute inset-y-0 right-10 flex items-center pr-2 text-gray-700">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
              <input
                type="number"
                min="0.01"
                step="any"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                value={productoActual.cantidad !== undefined ? productoActual.cantidad : ''}
                onChange={(e) =>
                  setProductoActual({
                    ...productoActual,
                    cantidad: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Ej: 2.5"
                disabled={!productoActual.produccionId}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidad de Medida de Venta</label>
              <div className="relative">
                <select
                  className="w-full p-2.5 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none"
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
                <button
                  type="button"
                  onClick={() => setModalMedidaAbierto(true)}
                  className="absolute right-0 top-0 bottom-0 h-full w-10 flex items-center justify-center text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-r-md shadow-sm transition-colors"
                  title="Nueva Unidad de Medida"
                >
                  <PlusCircle className="h-5 w-5" />
                </button>
                <div className="pointer-events-none absolute inset-y-0 right-10 flex items-center pr-2 text-gray-700">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total sin Descuento</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  className="w-full pl-8 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-gray-100 cursor-not-allowed"
                  value={
                    subtotalProductoActual !== undefined && !isNaN(subtotalProductoActual)
                      ? subtotalProductoActual.toFixed(2)
                      : ''
                  }
                  readOnly
                  disabled={true}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descuento (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                value={productoActual.descuentoPorcentaje !== undefined ? productoActual.descuentoPorcentaje : ''}
                onChange={(e) => {
                  const descuento = parseFloat(e.target.value) || 0;
                  if (descuento > 100) {
                    setProductoActual({
                      ...productoActual,
                      descuentoPorcentaje: 100,
                    });
                    showToast({ title: 'El descuento no puede exceder el 100%', timeout: 3000, variant:"error"});
                  } else {
                    setProductoActual({
                      ...productoActual,
                      descuentoPorcentaje: descuento,
                    });
                  }
                }}
                placeholder="Ej: 10"
                disabled={!productoActual.produccionId}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio con Descuento (por unidad)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  className="w-full pl-8 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-gray-100 cursor-not-allowed"
                  value={
                    precioUnitarioConDescuento !== undefined && !isNaN(precioUnitarioConDescuento)
                      ? precioUnitarioConDescuento.toFixed(2)
                      : ''
                  }
                  readOnly
                  disabled={true}
                />
                {unidadSeleccionadaParaVenta && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    /{unidadSeleccionadaParaVenta.nombre_medida}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total con Descuento</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  className="w-full pl-8 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-gray-100 cursor-not-allowed"
                  value={
                    subtotalConDescuentoProductoActual !== undefined && !isNaN(subtotalConDescuentoProductoActual)
                      ? subtotalConDescuentoProductoActual.toFixed(2)
                      : ''
                  }
                  readOnly
                  disabled={true}
                />
              </div>
            </div>

            <Button
              text="Agregar a la venta"
              onClick={agregarProducto}
              variant="green"
              size="md"
              className="w-full mt-2"
              disabled={
                !productoActual.produccionId ||
                !productoActual.cantidad ||
                productoActual.cantidad <= 0 ||
                !unidadSeleccionadaParaVenta ||
                precioUnitarioCalculado === undefined ||
                isNaN(precioUnitarioCalculado) ||
                precioUnitarioCalculado <= 0 ||
                productoActual.descuentoPorcentaje === undefined ||
                productoActual.descuentoPorcentaje < 0 ||
                productoActual.descuentoPorcentaje > 100 ||
                (precioUnitarioConDescuento !== undefined && precioUnitarioConDescuento < 0)
              }
            />
          </div>
        </div>
      </div>

      {productos.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
          <div className="bg-green-800 text-white px-5 py-3">
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
                    Precio por Unidad
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descuento (%)
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio c/Desc
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
                      {producto.cantidad} {producto.nombreUnidadMedidaVenta}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-right text-gray-500">
                      ${producto.precioUnidad.toFixed(2)}/{producto.nombreUnidadMedidaVenta}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-center text-gray-500">
                      {producto.descuentoPorcentaje.toFixed(2)}%
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-right text-gray-500">
                      ${producto.precioUnidadConDescuento.toFixed(2)}/{producto.nombreUnidadMedidaVenta}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                      ${(producto.subtotal * (1 - producto.descuentoPorcentaje / 100)).toFixed(2)}
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
                  <td colSpan={5} className="px-5 py-3 text-right text-lg font-bold text-gray-800">
                    Total Final:
                  </td>
                  <td className="px-3 py-3 text-right text-lg font-extrabold text-green-700">
                    ${totalVenta.toFixed(2)}
                  </td>
                  <td className="px-3 py-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <Button text="Cancelar" variant="outline" size="md" onClick={onClose} />
        <Button
          text="Finalizar Venta"
          variant="green"
          size="md"
          onClick={finalizarVenta}
          disabled={productos.length === 0 || crearVentaMutation.isPending}
          className="bg-green-600 hover:bg-green-700 px-6 py-2"
        />
      </div>

      <VentanaModal
        isOpen={modalMedidaAbierto}
        onClose={() => setModalMedidaAbierto(false)}
        titulo="Crear Unidad de Medida"
        contenido={<CrearUnidadMedida onSuccess={() => { setModalMedidaAbierto(false); refetchUnidades(); }} />}
        size="lg"
      />

      <VentanaModal
        isOpen={modalProduccionAbierto}
        onClose={() => setModalProduccionAbierto(false)}
        titulo="Crear Producción"
        contenido={<CrearProduccion onSuccess={() => { setModalProduccionAbierto(false); refetchProducciones(); }} />}
        size="lg"
      />
    </div>
  );
};

export default CrearVenta;