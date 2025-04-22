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

  const [stockSeleccionado, setStockSeleccionado] = useState<number | null>(null);

  // Opciones de Producciones
  const produccionOptions = producciones.map((produccion) => ({
    value: String(produccion.id), // Convertir a string
    label: `${produccion.nombre_produccion} - ${produccion.fecha}`,
  }));

  // Función para manejar el cambio de producción y actualizar el stock
  const handleProduccionChange = (idProduccion: string) => {
    const id = Number(idProduccion);
    const produccionSeleccionada = producciones.find((produccion) => produccion.id === id);
    if (produccionSeleccionada) {
      setStockSeleccionado(produccionSeleccionada.stock_disponible);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (formData: { [key: string]: string | File }) => {
    const idProduccion = Number(formData.fk_id_produccion as string);

    const produccionSeleccionada = producciones.find(p => p.id === idProduccion);

    if (!formData.fk_id_produccion || !formData.cantidad || !formData.precio_unidad || !formData.fecha || !produccionSeleccionada) {
      console.error("❌ Todos los campos son obligatorios");
      return;
    }

    const nuevaVenta: NuevaVenta = {
      fk_id_produccion: idProduccion,
      cantidad: parseFloat(formData.cantidad as string),
      precio_unidad: parseFloat(formData.precio_unidad as string),
      total_venta: parseFloat(formData.cantidad as string) * parseFloat(formData.precio_unidad as string),
      fecha: formData.fecha as string,
    };

    console.log("🚀 Enviando venta al backend:", nuevaVenta);

    // Enviar la venta
    mutation.mutate(nuevaVenta, {
      onSuccess: () => {
        console.log("✅ Venta creada exitosamente");
        navigate("/ventas");
      },
      onError: (error) => {
        console.error("❌ Error al crear la venta:", error);
      },
    });
  };

  if (isLoadingProducciones) {
    return <div className="text-center text-gray-500">Cargando producciones...</div>;
  }

  const formFields = [
    {
      id: "fk_id_produccion",
      label: "Producción",
      type: "select",
      options: produccionOptions,
    },
    { id: "cantidad", label: "Cantidad", type: "number" },
    { id: "precio_unidad", label: "Precio por Unidad", type: "number" },
    { id: "fecha", label: "Fecha", type: "date" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        onFieldChange={(id, value) => {
          if (id === "fk_id_produccion") {
            handleProduccionChange(value);
          }
        }}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Registrar Nueva Venta"
        stockMessage={
          stockSeleccionado !== null
            ? `Stock disponible: ${stockSeleccionado} unidades`
            : ""
        }
      />
    </div>
  );
};

export default CrearVenta;
