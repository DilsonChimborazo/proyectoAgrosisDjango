import { useState } from 'react';
import { useVentas } from '@/hooks/finanzas/venta/useVenta';
import Tabla from '@/components/globales/Tabla';
import VentanaModal from '@/components/globales/VentanasModales';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import Button from '@/components/globales/Button';

// Extender el tipo de jsPDF para incluir lastAutoTable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
}

const VentaComponent = () => {
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

  // Función para parsear el total de manera segura
  const parseTotal = (total: any) => {
    if (total === null || total === undefined) return 0;
    if (typeof total === 'number') return total;
    if (typeof total === 'string') {
      const parsed = parseFloat(total);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Asegurarse de que ventas es un array y convertir total a número si es necesario
  const mappedVentas = (Array.isArray(ventas) ? ventas : []).map((venta) => {
    const total = parseTotal(venta.total);
    return {
      id: venta.id,
      fecha: new Date(venta.fecha).toLocaleDateString(),
      total: `$${total.toFixed(2)}`,
      cantidad_items: venta.items?.length || 0,
      detalles: venta.items?.map((item: any) =>
        `${item.produccion?.nombre_produccion || 'Producto'} (${item.cantidad} ${item.unidad_medida?.nombre_medida || 'u'})`
      ).join(', ') || 'Sin detalles',
      // Guardamos los items completos para usarlos en el PDF
      items: venta.items || [],
      // Guardamos el total numérico para cálculos
      totalNumerico: total
    };
  });

  const headers = ["ID", "Fecha", "Total", "Detalles"];
  const generarFacturaPDF = (venta: any) => {
    const doc = new jsPDF();

    // Configuración base
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    // Color principal
    const primaryColor = [34, 139, 34] as [number, number, number];

    // Logo
    const logoUrl = '/agrosoft.png';
    doc.addImage(logoUrl, 'PNG', 15, 15, 30, 15);

    // Encabezado derecho
    const rightMargin = 180;
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.text('FACTURA', rightMargin, 20, { align: 'right' });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`N° ${venta.id}`, rightMargin, 26, { align: 'right' });
    doc.text(`Fecha: ${new Date(venta.fecha).toLocaleDateString()}`, rightMargin, 32, { align: 'right' });

    // Línea divisoria
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.3);
    doc.line(15, 40, 195, 40);

    // Sección de productos
    let yPosition = 50;

    // Encabezado de productos
    doc.setFillColor(...primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.rect(15, yPosition, 180, 10, 'F');
    doc.text('PRODUCTO', 20, yPosition + 7);
    doc.text('TOTAL', 170, yPosition + 7, { align: 'right' });

    yPosition += 15;

    // Items de productos
    doc.setTextColor(0, 0, 0);
    const items = venta.items || [];
    const lineHeight = 8;

    items.forEach((item: any) => {
      const precio = parseFloat(item.precio_unidad) || 0;
      const cantidad = parseFloat(item.cantidad) || 0;
      const subtotal = precio * cantidad;

      // Nombre del producto
      doc.setFont('helvetica', 'bold');
      doc.text(item.produccion?.nombre_produccion || 'Producto', 20, yPosition);
      doc.setFont('helvetica', 'normal');

      // Detalles
      doc.text(`${cantidad} ${item.unidad_medida?.nombre_medida || 'u'} x $${precio.toFixed(2)}`, 20, yPosition + lineHeight);

      // Subtotal
      doc.text(`$${subtotal.toFixed(2)}`, 170, yPosition + (lineHeight / 2), { align: 'right' });

      // Línea divisoria
      doc.setDrawColor(230, 230, 230);
      doc.line(15, yPosition + lineHeight * 1.5, 195, yPosition + lineHeight * 1.5);

      yPosition += lineHeight * 2;
    });

    // Totales - CÁLCULO CORREGIDO
    const total = venta.totalNumerico !== undefined ? venta.totalNumerico : parseTotal(venta.total);
    const descuentoPorcentaje = venta.descuento_porcentaje || 0;
    const subtotal = descuentoPorcentaje > 0 ? total / (1 - descuentoPorcentaje / 100) : total;

    yPosition += 15;

    // Línea decorativa
    doc.setDrawColor(...primaryColor);
    doc.line(120, yPosition, 180, yPosition);
    yPosition += 10;

    // Subtotal
    doc.text('SUBTOTAL:', 130, yPosition);
    doc.text(`$${subtotal.toFixed(2)}`, 170, yPosition, { align: 'right' });
    yPosition += lineHeight;

    // Descuento - SOLO SI HAY DESCUENTO
    if (descuentoPorcentaje > 0) {
      doc.text('DESCUENTO:', 130, yPosition);
      doc.text(`${descuentoPorcentaje.toFixed(2)}%`, 170, yPosition, { align: 'right' });
      yPosition += lineHeight;
    }

    // Total
    yPosition += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL:', 130, yPosition);
    doc.text(`$${total.toFixed(2)}`, 170, yPosition, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    // Pie de página
    yPosition += 25;
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text('Gracias por su preferencia', 105, yPosition, { align: 'center' });
    doc.text('Sistema AgroSoft - www.agrosoft.com', 105, yPosition + 6, { align: 'center' });

    doc.save(`factura_${venta.id}.pdf`);
  };

  // Detalles de venta para el modal
  const renderDetallesVenta = (venta: any) => {
    if (!venta) return <p>No hay detalles disponibles</p>;

    const total = venta.totalNumerico !== undefined ? venta.totalNumerico : parseTotal(venta.total);
    const descuentoPorcentaje = venta.descuento_porcentaje || 0;
    const subtotal = descuentoPorcentaje > 0 ? total / (1 - descuentoPorcentaje / 100) : total;
    const items = venta.items || [];

    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-lg">Información General</h3>
          <p><strong>ID:</strong> {venta.id}</p>
          <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}</p>
          <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
          {descuentoPorcentaje > 0 && (
            <p><strong>Descuento:</strong> {descuentoPorcentaje.toFixed(2)}%</p>
          )}
          <p><strong>Total:</strong> ${total.toFixed(2)}</p>
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
                    <th className="border px-4 py-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, index: number) => {
                    const precio = typeof item.precio_unidad === 'string' ? parseFloat(item.precio_unidad) : item.precio_unidad || 0;
                    const cantidad = typeof item.cantidad === 'string' ? parseFloat(item.cantidad) : item.cantidad || 0;
                    const subtotal = precio * cantidad;

                    return (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border px-4 py-2">{item.produccion?.nombre_produccion || 'Producto'}</td>
                        <td className="border px-4 py-2 text-center">
                          {cantidad} {item.unidad_medida?.nombre_medida || 'u'}
                        </td>
                        <td className="border px-4 py-2 text-right">${precio.toFixed(2)}</td>
                        <td className="border px-4 py-2 text-right">${subtotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-4 text-right">
                <Button
                  text="Descargar Factura"
                  onClick={() => generarFacturaPDF(venta)}
                  variant="success"
                />
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
    <div className="mx-auto p-4">
      <div className="flex gap-4 my-4">
        <Button text="Registrar Venta" onClick={handleCreate} variant="green" />
        <Button
          text="Generar Reporte"
          onClick={() => {
            if (ventas && ventas.length > 0) {
              generarFacturaPDF({
                id: 'general',
                fecha: new Date().toISOString(),
                total: mappedVentas.reduce((sum, v) => sum + v.totalNumerico, 0),
                descuento_porcentaje: 0,
                items: ventas.flatMap(v => v.items || [])
              });
            } else {
              alert('No hay ventas para generar el reporte');
            }
          }}
          variant="success"
        />
      </div>

      <Tabla
        title="Lista de Ventas"
        headers={headers}
        data={mappedVentas}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
      />

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