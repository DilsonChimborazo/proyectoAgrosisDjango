import { useState } from "react";
import { useCrearVenta } from "../../../hooks/finanzas/venta/useCrearVenta";
import Formulario from "../../globales/Formulario";
import { useNavigate } from "react-router-dom";
import { useProduccion } from "@/hooks/finanzas/produccion/useProduccion";
import { NuevaVenta } from "@/hooks/finanzas/venta/useCrearVenta";

const CrearVenta = () => {
  const mutation = useCrearVenta();
  const navigate = useNavigate();
  const { data: producciones = [], isLoading: isLoadingProducciones } = useProduccion();

  // Estado para gestionar el stock de los productos
  const [stockProductos, setStockProductos] = useState<{ [key: number]: number }>({});

  // Opciones de Producciones
  const produccionOptions = producciones.map((produccion) => ({
    value: String(produccion.id_produccion), // Convertir a string
    label: `${produccion.nombre_produccion} - ${produccion.fecha}`, // Formato: Producción - Fecha
  }));

  // Definición de los campos del formulario
  const formFields = [
    { id: "fk_id_produccion", label: "Producción", type: "select", options: produccionOptions },
    { id: "cantidad", label: "Cantidad", type: "number" },
    { id: "precio_unidad", label: "Precio por Unidad", type: "number" },
    { id: "fecha", label: "Fecha", type: "date" },
  ];

  // Función para actualizar el stock después de registrar una venta
  const handleVentaCreada = (venta: NuevaVenta) => {
    console.log(`Venta creada: Producción ${venta.fk_id_produccion}, cantidad vendida: ${venta.cantidad}`);

    // Actualiza el stock en el estado local
    setStockProductos((prevState) => {
      const nuevoStock = { ...prevState };
      if (nuevoStock[venta.fk_id_produccion]) {
        nuevoStock[venta.fk_id_produccion] -= venta.cantidad; // Restar la cantidad vendida
      } else {
        nuevoStock[venta.fk_id_produccion] = -venta.cantidad; // Si no existe el stock, establecer valor negativo
      }
      return nuevoStock;
    });
  };

  // Función que maneja el envío del formulario
  const handleSubmit = (formData: { [key: string]: string }) => {
    if (!formData.fk_id_produccion || !formData.cantidad || !formData.precio_unidad || !formData.fecha) {
      console.error("❌ Todos los campos son obligatorios");
      return;
    }

    const nuevaVenta: NuevaVenta = {
      fk_id_produccion: Number(formData.fk_id_produccion), // Convertir a número
      cantidad: parseFloat(formData.cantidad),
      precio_unidad: parseFloat(formData.precio_unidad),
      total_venta: parseFloat(formData.cantidad) * parseFloat(formData.precio_unidad),
      fecha: formData.fecha,
    };

    console.log("🚀 Enviando venta al backend:", nuevaVenta);

    mutation.mutate(nuevaVenta, {
      onSuccess: () => {
        // Llamar a handleVentaCreada para actualizar el stock
        handleVentaCreada(nuevaVenta);

        console.log("✅ Venta creada exitosamente");
        navigate("/ventas"); // Redirigir a la lista de ventas
      },
      onError: (error) => {
        console.error("❌ Error al crear la venta:", error);
      },
    });
  };

  if (isLoadingProducciones) {
    return <div className="text-center text-gray-500">Cargando producciones...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Registrar Nueva Venta"
      />

      {/* Mostrar el stock actualizado en la interfaz */}
      <div className="mt-4">
        <h3>Stock Actual:</h3>
        <ul>
          {Object.keys(stockProductos).map((idProduccion) => (
            <li key={idProduccion}>
              Producción ID: {idProduccion} - Stock restante: {stockProductos[parseInt(idProduccion)]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CrearVenta;
