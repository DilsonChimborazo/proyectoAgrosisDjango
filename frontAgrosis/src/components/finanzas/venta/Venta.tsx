import { useState } from 'react';
import { useVentas } from '@/hooks/finanzas/venta/useVenta';
import Tabla from '@/components/globales/Tabla';
import VentanaModal from '@/components/globales/VentanasModales';
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Button from '@/components/globales/Button';

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
    navigate("/Registrar-Venta");
  };

  const handleUpdate = (venta: any) => {
    navigate(`/actualizarventa/${venta.id}`);
  };

  if (isLoading) return <div className="text-center text-gray-500">Cargando ventas...</div>;
  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  // Asegurarse de que ventas es un array y convertir total a número si es necesario
  const mappedVentas = (Array.isArray(ventas) ? ventas : []).map((venta) => {
    // Convertir total a número si es una cadena
    const total = typeof venta.total === 'string' ? parseFloat(venta.total) : venta.total;
    
    return {
      id: venta.id,
      fecha: new Date(venta.fecha).toLocaleDateString(),
      total: typeof total === 'number' ? `$${total.toFixed(2)}` : 'N/A',
      completada: venta.completada ? 'Sí' : 'No',
      cantidad_items: venta.items?.length || 0,
      detalles: venta.items?.map((item: any) => 
        `${item.produccion?.nombre_produccion || 'Producto'} (${item.cantidad} ${item.unidad_medida?.unidad_base || 'u'})`
      ).join(', ') || 'Sin detalles'
    };
  });

  const headers = ["ID", "Fecha", "Total","Detalles"];

  // Generar reporte PDF
  const generarReportePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte de Ventas", 14, 20);

    const tableData = (Array.isArray(ventas) ? ventas : []).map(venta => [
      venta.id,
      new Date(venta.fecha).toLocaleDateString(),
      `$${typeof venta.total === 'number' ? venta.total.toFixed(2) : '0.00'}`,
      venta.completada ? 'Sí' : 'No',
      venta.items?.length || 0
    ]);

    autoTable(doc, {
      startY: 30,
      head: [headers.slice(0, 5)], // Solo las primeras 5 columnas para el PDF
      body: tableData,
      styles: {
        fontSize: 10,
        halign: 'center'
      },
      headStyles: {
        fillColor: [34, 139, 34], // Verde forestal
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    doc.save('reporte_ventas.pdf');
  };

  // Detalles de venta para el modal
  const renderDetallesVenta = (venta: any) => {
    if (!venta) return <p>No hay detalles disponibles</p>;

    const total = typeof venta.total === 'string' ? parseFloat(venta.total) : venta.total;

    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-lg">Información General</h3>
          <p><strong>ID:</strong> {venta.id}</p>
          <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}</p>
          <p><strong>Total:</strong> ${typeof total === 'number' ? total.toFixed(2) : '0.00'}</p>
          <p><strong>Estado:</strong> {venta.completada ? 'Completada' : 'Pendiente'}</p>
        </div>

        <div>
          <h3 className="font-bold text-lg">Productos Vendidos</h3>
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
              {venta.items?.map((item: any, index: number) => {
                const precio = typeof item.precio_unidad === 'string' ? 
                  parseFloat(item.precio_unidad) : item.precio_unidad;
                const cantidad = typeof item.cantidad === 'string' ? 
                  parseFloat(item.cantidad) : item.cantidad;
                const subtotal = precio * cantidad;

                return (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border px-4 py-2">{item.produccion?.nombre_produccion || 'Producto'}</td>
                    <td className="border px-4 py-2 text-center">
                      {cantidad} {item.unidad_medida?.unidad_base || 'u'}
                    </td>
                    <td className="border px-4 py-2 text-right">${precio.toFixed(2)}</td>
                    <td className="border px-4 py-2 text-right">${subtotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto p-4">
      <div className="flex gap-4 my-4">
        <Button 
          text="Registrar Venta" 
          onClick={handleCreate} 
          variant="green" 
        />
        <Button 
          text="Generar Reporte" 
          onClick={generarReportePDF}
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