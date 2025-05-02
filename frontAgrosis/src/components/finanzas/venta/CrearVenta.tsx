import { useState } from "react";
import { useCrearVenta } from "@/hooks/finanzas/venta/useCrearVenta";
import Formulario from "@/components/globales/Formulario";
import { useNavigate } from "react-router-dom";
import { useProduccion } from "@/hooks/finanzas/produccion/useProduccion";
import { useMedidas } from "@/hooks/inventario/unidadMedida/useMedidad";
import { NuevaVenta } from "@/hooks/finanzas/venta/useCrearVenta";
import { Produccion } from "@/hooks/finanzas/venta/useVenta";

// Definimos las props que recibirá el componente
interface CrearVentaProps {
  onClose?: () => void; // Función opcional para cerrar el modal
  onSuccess?: () => void; // Función opcional para manejar éxito
}

const CrearVenta = ({ onClose, onSuccess }: CrearVentaProps) => {
  const mutation = useCrearVenta();
  const navigate = useNavigate();

  // Obtener producciones y unidades de medida
  const { data: producciones = [], isLoading: isLoadingProducciones } = useProduccion();
  const { data: unidadesMedida = [], isLoading: isLoadingUnidades } = useMedidas();

  const [stockSeleccionado, setStockSeleccionado] = useState<number | null>(null);
  const [produccionSeleccionada, setProduccionSeleccionada] = useState<Produccion | null>(null);

  // Opciones para los selects
  const produccionOptions = producciones.map((produccion: Produccion) => ({
    value: String(produccion.id),
    label: `${produccion.nombre_produccion} - ${produccion.fecha}`
  }));

  const unidadMedidaOptions = unidadesMedida.map((unidad) => ({
    value: String(unidad.id),
    label: `${unidad.nombre_medida} (${unidad.unidad_base})`
  }));

  // Función para manejar el cambio de producción
  const handleProduccionChange = (idProduccion: string) => {
    const id = Number(idProduccion);
    const produccion = producciones.find((p: Produccion) => p.id === id);

    if (produccion) {
      setProduccionSeleccionada(produccion);
      setStockSeleccionado(produccion.stock_disponible);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (formData: { [key: string]: string | File }) => {
    if (!produccionSeleccionada) {
      console.error("Error: Debe seleccionar una producción");
      return;
    }

    const cantidad = parseFloat(formData.cantidad as string);
    const precioUnidad = parseFloat(formData.precio_unidad as string);
    const unidadMedidaId = parseInt(formData.fk_unidad_medida as string, 10);

    // Validaciones
    if (cantidad <= 0) {
      console.error("Error: La cantidad debe ser mayor a cero");
      return;
    }

    if (precioUnidad <= 0) {
      console.error("Error: El precio por unidad debe ser mayor a cero");
      return;
    }

    if (stockSeleccionado !== null && cantidad > stockSeleccionado) {
      console.error("Error: La cantidad no puede ser mayor al stock disponible");
      return;
    }

    const unidadSeleccionada = unidadesMedida.find(u => u.id === unidadMedidaId);
    const factorConversion = unidadSeleccionada?.factor_conversion || 1;

    const nuevaVenta: NuevaVenta = {
      fk_id_produccion: produccionSeleccionada.id,
      cantidad: cantidad,
      precio_unidad: precioUnidad,
      fecha: formData.fecha as string,
      fk_unidad_medida: unidadMedidaId,
      cantidad_en_base: cantidad * factorConversion,
    };

    mutation.mutate(nuevaVenta, {
      onSuccess: () => {
        // Ejecutamos onSuccess si existe, sino navegamos a /stock
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/stock");
        }
        // También cerramos el modal si existe la función onClose
        onClose?.();
      },
      onError: (error) => {
        console.error("Error al crear la venta:", error.message);
      },
    });
  };

  if (isLoadingProducciones || isLoadingUnidades) {
    return <div className="text-center text-gray-500">Cargando opciones...</div>;
  }

  const formFields = [
    {
      id: "fk_id_produccion",
      label: "Producción",
      type: "select",
      options: produccionOptions,
      required: true,
    },
    {
      id: "cantidad",
      label: "Cantidad",
      type: "number",
      min: 0.01,
      step: "any",
      required: true,
      max: stockSeleccionado || undefined,
    },
    {
      id: "fk_unidad_medida",
      label: "Unidad de Medida",
      type: "select",
      options: unidadMedidaOptions,
      required: true,
    },
    {
      id: "precio_unidad",
      label: "Precio por Unidad",
      type: "number",
      min: 0.01,
      step: "0.01",
      required: true,
    },
    {
      id: "fecha",
      label: "Fecha de Venta",
      type: "date",
      required: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto ">
      {stockSeleccionado !== null && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg">
          <p className="font-semibold">Stock disponible: {stockSeleccionado}</p>
        </div>
      )}

      <Formulario
        title="Crear Venta"
        fields={formFields}
        onSubmit={handleSubmit}
        onFieldChange={(id, value) => {
          if (id === "fk_id_produccion") {
            handleProduccionChange(value);
          }
        }}
        stockMessage={
          stockSeleccionado !== null
            ? `Stock disponible: ${stockSeleccionado} unidades`
            : ""
        }
      />

      {mutation.isError && (
        <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{mutation.error.message}</p>
        </div>
      )}
    </div>
  );
};

export default CrearVenta;