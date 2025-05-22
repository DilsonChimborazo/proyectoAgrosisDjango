import { useParams } from 'react-router-dom';
import { useVenta } from '@/hooks/finanzas/venta/useVenta';
import { useActualizarVenta } from '@/hooks/finanzas/venta/useVenta';
import Button from '@/components/globales/Button';
import { showToast } from "@/components/globales/Toast";
const DetalleVenta = () => {
  const { id } = useParams<{ id: string }>();
  const ventaId = parseInt(id || '0', 10);
  const { data: venta, isLoading, error } = useVenta(ventaId);
  const actualizarVenta = useActualizarVenta();

  const marcarComoCompletada = () => {
    if (!venta) return;
    
    actualizarVenta.mutate({
      id: venta.id,
      ventaData: { completada: true }
    }, {
      onSuccess: () => {
        showToast({
          title: "Venta completada",
          description: "La venta ha sido marcada como completada",
          timeout: 4000
        });
      }
    });
  };

  if (isLoading) return <div className="text-center text-gray-500">Cargando venta...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;
  if (!venta) return <div className="text-center text-gray-500">Venta no encontrada</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Venta #{venta.id} - {new Date(venta.fecha).toLocaleDateString()}
        </h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          venta.completada 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {venta.completada ? 'Completada' : 'Pendiente'}
        </span>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Resumen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Venta</p>
            <p className="text-2xl font-bold">${venta.total.toFixed(2)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Productos</p>
            <p className="text-2xl font-bold">{venta.items.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Fecha</p>
            <p className="text-xl">{new Date(venta.fecha).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Productos Vendidos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Producto</th>
                <th className="border px-4 py-2 text-center">Cantidad</th>
                <th className="border px-4 py-2 text-right">Precio Unitario</th>
                <th className="border px-4 py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {venta.items.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border px-4 py-2">{item.produccion.nombre_produccion}</td>
                  <td className="border px-4 py-2 text-center">
                    {item.cantidad} {item.unidad_medida.unidad_base}
                  </td>
                  <td className="border px-4 py-2 text-right">${item.precio_unidad.toFixed(2)}</td>
                  <td className="border px-4 py-2 text-right">
                    ${(item.cantidad * item.precio_unidad).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100">
              <tr>
                <td colSpan={3} className="border px-4 py-2 text-right font-bold">Total:</td>
                <td className="border px-4 py-2 text-right font-bold">${venta.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {!venta.completada && (
        <div className="flex justify-end">
          <Button
            text="Marcar como Completada"
            onClick={marcarComoCompletada}
            variant="primary"
          />
        </div>
      )}
    </div>
  );
};

export default DetalleVenta;