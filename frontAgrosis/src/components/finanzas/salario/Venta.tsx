// components/finanzas/venta/VentaComponent.tsx
import { useState } from 'react';
import { useVentas } from '@/hooks/finanzas/venta/useVenta';
import Tabla from '@/components/globales/Tabla';
import VentanaModal from '@/components/globales/VentanasModales';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import Button from '@/components/globales/Button';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
}

interface VentaComponentProps {
  showButtons?: boolean;
}

const VentaComponent = ({ showButtons = true }: VentaComponentProps) => {
  const navigate = useNavigate();
  const { data: ventas, isLoading, error } = useVentas();
  const [selectedVenta, setSelectedVenta] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalHandler = (venta: any) => {
    setSelectedVenta(venta);
    setIsModalOpen(true);
  };

  const handleRowClick = (venta: any) => {
    openModalHandler(venta);
  };

  const handleCreate = () => {
    navigate('/Registrar-Venta');
  };

  const handleUpdate = (venta: any) => {
    navigate(`/actualizarventa/${venta.id}`);
  };

  if (isLoading) return <div className="text-center text-gray-500">Cargando ventas...</div>;
  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  const parseTotal = (total: any) => {
    if (total === null || total === undefined) return 0;
    if (typeof total === 'number') return total;
    if (typeof total === 'string') {
      const parsed = parseFloat(total);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const mappedVentas = (Array.isArray(ventas) ? ventas : []).map((venta) => {
    const total = parseTotal(venta.total);
    return {
      id: venta.id,
      fecha: new Date(venta.fecha).toLocaleDateString(),
      vendedor: venta.usuario ? `${venta.usuario.nombre} ${venta.usuario.apellido}` : 'No asignado',
      total: `$${total.toFixed(2)}`,
      cantidad_items: venta.items?.length || 0,
      detalles: venta.items?.map((item: any) =>
        `${item.produccion?.nombre_produccion || 'Producto'} (${item.cantidad} ${item.unidad_medida?.nombre_medida || 'u'}, Desc: ${item.descuento_porcentaje}%, Precio con Desc: $${item.precio_unidad_con_descuento})`
      ).join(', ') || 'Sin detalles',
      items: venta.items || [],
      totalNumerico: total,
      usuario: venta.usuario || null
    };
  });

  const headers = ["ID", "Vendedor", "Fecha", "Total", "Detalles"];

  const generarFacturaPDF = (venta: any) => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'normal');
    const primaryColor = [26, 60, 52] as [number, number, number];
    const textColor = [45, 55, 72] as [number, number, number];
    const bgColor = [247, 250, 252] as [number, number, number];

    const logoUrl = '/agrosoft.png';
    doc.addImage(logoUrl, 'PNG', 15, 10, 60, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    doc.text('Sistema de Gestión Agrícola', 15, 52);

    // Información del vendedor
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Vendedor:', 15, 70);
    doc.setFont('helvetica', 'bold');
    doc.text(`${venta.usuario?.nombre || 'N/A'} ${venta.usuario?.apellido || ''}`, 40, 70);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('FACTURA', 195, 20, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.text(`Número: ${venta.id}`, 195, 28, { align: 'right' });
    doc.text(`Fecha: ${new Date(venta.fecha).toLocaleDateString()}`, 195, 36, { align: 'right' });

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.3);
    doc.line(15, 85, 195, 85);

    let yPosition = 95;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('Detalles de la Venta', 15, yPosition);
    yPosition += 10;

    const items = venta.items || [];
    items.forEach((item: any, index: number) => {
      const precio = parseFloat(item.precio_unidad) || 0;
      const precioConDescuento = parseFloat(item.precio_unidad_con_descuento) || precio;
      const cantidad = parseFloat(item.cantidad) || 0;
      const descuentoPorcentaje = parseFloat(item.descuento_porcentaje) || 0;
      const subtotalConDescuento = precioConDescuento * cantidad;

      doc.setFillColor(...bgColor);
      doc.rect(15, yPosition, 180, 30, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      doc.text(`Producto: ${item.produccion?.nombre_produccion || 'Producto'}`, 20, yPosition + 8);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Cantidad: ${cantidad} ${item.unidad_medida?.nombre_medida || 'u'}`, 20, yPosition + 15);
      doc.text(`Precio Unitario: $${precio.toFixed(2)}`, 20, yPosition + 22);
      doc.text(`Descuento: ${descuentoPorcentaje.toFixed(2)}%`, 90, yPosition + 15);
      doc.text(`Precio c/Descuento: $${precioConDescuento.toFixed(2)}`, 90, yPosition + 22);
      doc.text(`Subtotal: $${subtotalConDescuento.toFixed(2)}`, 175, yPosition + 22, { align: 'right' });
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.line(15, yPosition + 32, 195, yPosition + 32);
      yPosition += 35;
    });

    yPosition += 10;
    doc.setFillColor(...bgColor);
    doc.rect(130, yPosition, 65, 15, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('Total:', 135, yPosition + 10);
    doc.setTextColor(...textColor);
    doc.text(`$${venta.totalNumerico.toFixed(2)}`, 190, yPosition + 10, { align: 'right' });

    yPosition += 30;
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.3);
    doc.line(15, yPosition, 195, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Gracias por su preferencia', 105, yPosition + 10, { align: 'center' });
    doc.text('Sistema AgroSoft - www.agrosoft.com', 105, yPosition + 16, { align: 'center' });

    doc.save(`factura_${venta.id}.pdf`);
  };

  const renderDetallesVenta = (venta: any) => {
    if (!venta) return <p>No hay detalles disponibles</p>;

    const total = venta.totalNumerico !== undefined ? venta.totalNumerico : parseTotal(venta.total);
    const items = venta.items || [];

    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-lg">Información General</h3>
          <p><strong>ID:</strong> {venta.id}</p>
          <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}</p>
          <p><strong>Total:</strong> ${total.toFixed(2)}</p>
          <p><strong>Vendedor:</strong> {venta.usuario?.nombre || 'N/A'} {venta.usuario?.apellido || ''}</p>
          <p><strong>Email:</strong> {venta.usuario?.email || 'N/A'}</p>
        </div>
        <div>
          <h3 className="font-bold text-lg">Productos Vendidos</h3>
          {items.length > 0 ? (
            <>
              <table className="min-w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2">Producto</th>
                    <th className="border px-4 py-2">Cantidad</th>
                    <th className="border px-4 py-2">Precio Unitario</th>
                    <th className="border px-4 py-2">Descuento</th>
                    <th className="border px-4 py-2">Precio c/Desc</th>
                    <th className="border px-4 py-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, index: number) => {
                    const precio = typeof item.precio_unidad === 'string' ? parseFloat(item.precio_unidad) : item.precio_unidad || 0;
                    const precioConDescuento = typeof item.precio_unidad_con_descuento === 'string' ? parseFloat(item.precio_unidad_con_descuento) : item.precio_unidad_con_descuento || precio;
                    const cantidad = typeof item.cantidad === 'string' ? parseFloat(item.cantidad) : item.cantidad || 0;
                    const descuentoPorcentaje = typeof item.descuento_porcentaje === 'string' ? parseFloat(item.descuento_porcentaje) : item.descuento_porcentaje || 0;
                    const subtotalConDescuento = precioConDescuento * cantidad;

                    return (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border px-4 py-2">{item.produccion?.nombre_produccion || 'Producto'}</td>
                        <td className="border px-4 py-2 text-center">{cantidad} {item.unidad_medida?.nombre_medida || 'u'}</td>
                        <td className="border px-4 py-2 text-right">${precio.toFixed(2)}</td>
                        <td className="border px-4 py-2 text-center">{descuentoPorcentaje.toFixed(2)}%</td>
                        <td className="border px-4 py-2 text-right">${precioConDescuento.toFixed(2)}</td>
                        <td className="border px-4 py-2 text-right">${subtotalConDescuento.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-4 text-right">
                <Button text="Descargar Factura" onClick={() => generarFacturaPDF(venta)} variant="success" />
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-4">No hay productos en esta venta</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {showButtons && (
        <div className="flex gap-4">
          <Button text="Registrar Venta" onClick={handleCreate} variant="green" />
          <Button
            text="Generar Reporte"
            onClick={() => {
              if (ventas && ventas.length > 0) {
                generarFacturaPDF({
                  id: 'general',
                  fecha: new Date().toISOString(),
                  total: mappedVentas.reduce((sum, v) => sum + v.totalNumerico, 0),
                  items: ventas.flatMap(v => v.items || []),
                  usuario: { nombre: 'Reporte', apellido: 'General', email: 'reporte@agrosoft.com' }
                });
              } else {
                alert('No hay ventas para generar el reporte');
              }
            }}
            variant="success"
          />
        </div>
      )}
      {mappedVentas.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No hay ventas registradas.</p>
      ) : (
        <Tabla
          title=""
          headers={headers}
          data={mappedVentas}
          onClickAction={handleRowClick}
          showCreateButton={false}
          className="[&_table]:w-full [&_th]:py-2 [&_th]:bg-green-700 [&_th]:text-white [&_th]:font-bold [&_th]:text-sm [&_th:first-child]:rounded-tl-lg [&_th:last-child]:rounded-tr-lg [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm"
        />
      )}
      {selectedVenta && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          titulo={`Detalles de Venta #${selectedVenta.id}`}
          contenido={renderDetallesVenta(selectedVenta)}
          size="lg"
        />
      )}
    </div>
  );
};

export default VentaComponent;