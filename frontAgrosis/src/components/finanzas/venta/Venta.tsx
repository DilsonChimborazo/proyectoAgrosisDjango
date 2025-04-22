import { useState } from 'react';
import { useVenta } from '../../../hooks/finanzas/venta/useVenta'; 
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Button from '@/components/globales/Button';


const VentaComponent = () => {
  const navigate = useNavigate();
  const { data: ventas, isLoading, error } = useVenta();
  const [selectedVenta, setSelectedVenta] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalHandler = (venta: object) => {
    setSelectedVenta(venta);
    setIsModalOpen(true);
  };

  const handleRowClick = (venta: { id_venta: number }) => {
    openModalHandler(venta);
  };

  const closeModal = () => {
    setSelectedVenta(null);
    setIsModalOpen(false);
  };

  const handleUpdate = (cultivo: { id_venta: number }) => {
    navigate(`/actualizarventa/${cultivo.id_venta}`);
  };

  const handleCreate = () => {
    navigate("/Registrar-Venta");
  };

  if (isLoading) return <div className="text-center text-gray-500">Cargando ventas...</div>;
  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  const ventasList = Array.isArray(ventas) ? ventas : [];
  const mappedVentas = ventasList.map((venta) => {
    const cantidadProduccion = venta.fk_id_produccion?.cantidad_produccion ?? 0;
    const cantidadVendida = venta.cantidad ?? 0;
    const stock = cantidadProduccion > cantidadVendida ? cantidadProduccion - cantidadVendida : 0;

    return {
      id_venta: venta.id,
      cantidad_vendida: cantidadVendida,
      precio_unitario: venta.precio_unidad,
      total_venta: cantidadVendida * venta.precio_unidad,
      fecha_venta: venta.fecha,
      cantidad_producción: cantidadProduccion,
      fecha_producción: venta.fk_id_produccion?.fecha ?? "No disponible",
      nombre_produccion: venta.fk_id_produccion?.nombre_produccion ?? "No disponible",
      stock,
    };
  });

  const headers = [
    "ID", "Cantidad Vendida", "Precio Unitario", "Total Venta", "Fecha Venta",
    "Cantidad Producción", "Fecha Producción", "Nombre Produccion", "Stock"
  ];

  // Agrupar por nombre_produccion
  const produccionMap = new Map<string, { totalVendida: number, totalGanancia: number }>();
  mappedVentas.forEach(venta => {
    const nombre = venta.nombre_produccion;
    const cantidad = venta.cantidad_vendida;
    const ganancia = venta.total_venta;
    if (produccionMap.has(nombre)) {
      const entry = produccionMap.get(nombre)!;
      entry.totalVendida += cantidad;
      entry.totalGanancia += ganancia;
    } else {
      produccionMap.set(nombre, { totalVendida: cantidad, totalGanancia: ganancia });
    }
  });
  const productos = Array.from(produccionMap.entries());
  const productoMasVendido = productos.reduce((prev, current) =>
    current[1].totalVendida > prev[1].totalVendida ? current : prev
  , productos[0]);

  const exportarProductoMasVendidoPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Producto Más Vendido", 14, 20);

    const [nombre, datos] = productoMasVendido;

    autoTable(doc, {
      startY: 30,
      head: [["Nombre del Producto", "Cantidad Vendida", "Total Generado"]],
      body: [[
        nombre,
        datos.totalVendida,
        `S/. ${datos.totalGanancia.toFixed(2)}`
      ]],
      styles: {
        fontSize: 12,
        halign: "center",
      },
      headStyles: {
        fillColor: [0, 128, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold"
      },
    });

    doc.save("producto_mas_vendido.pdf");
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
          text="Exportar Más Vendido" 
          onClick={exportarProductoMasVendidoPDF}
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
          onClose={closeModal}
          titulo="Detalles de Venta"
          contenido={selectedVenta}
        />
      )}
    </div>
  );
};

export default VentaComponent;