import { useState } from "react";
import { useCrearVenta } from "@/hooks/finanzas/venta/useCrearVenta";
import Formulario from "@/components/globales/Formulario";
import { useNavigate } from "react-router-dom";
import { useProduccion } from "@/hooks/finanzas/produccion/useProduccion";
import { useMedidas } from "@/hooks/inventario/unidadMedida/useMedidad";
import { NuevaVenta } from "@/hooks/finanzas/venta/useCrearVenta";
import CrearUnidadMedida from "@/components/inventario/unidadMedida/UnidadMedida";
import CrearProduccion from "@/components/finanzas/produccion/CrearProduccion";
import VentanaModal from "@/components/globales/VentanasModales";
import { addToast } from "@heroui/react";

interface CrearVentaProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

interface FormField {
  id: string;
  label: string;
  type: "text" | "date" | "number" | "select";
  options?: { value: string; label: string }[];
  hasExtraButton?: boolean;
  extraButtonText?: string;
  onExtraButtonClick?: () => void;
  extraContent?: React.ReactNode;
  required?: boolean;
  min?: number;
  max?: number;
  step?: string;
  placeholder?: string;
}

// Función para formatear números con separadores de miles (p.ej. 1000 -> 1.000)
const formatearNumero = (num: number | string) => {
  if (num === null || num === undefined || num === "") return "";
  const numero = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(numero)) return "";
  return numero.toLocaleString("es-ES"); // formato español, separador de miles es punto
};

const CrearVenta = ({ onClose, onSuccess }: CrearVentaProps) => {
  const mutation = useCrearVenta();
  const navigate = useNavigate();

  const { data: producciones = [], refetch: refetchProduccion, isLoading: isLoadingProducciones } = useProduccion();
  const { data: unidades = [], refetch: refetchUnidades, isLoading: isLoadingUnidades } = useMedidas();

  const [modalMedidaAbierto, setModalMedidaAbierto] = useState(false);
  const [modalProduccionAbierto, setModalProduccionAbierto] = useState(false);
  const [selectedProduccionId, setSelectedProduccionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Encontrar la producción seleccionada para obtener su stock
  const selectedProduccion = producciones.find(
    (produccion) => String(produccion.id) === selectedProduccionId
  );

  const abrirModalMedida = () => setModalMedidaAbierto(true);
  const cerrarModalMedida = () => {
    setModalMedidaAbierto(false);
    refetchUnidades();
  };

  const abrirModalProduccion = () => setModalProduccionAbierto(true);
  const cerrarModalProduccion = () => {
    setModalProduccionAbierto(false);
    refetchProduccion();
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    if (fieldId === "fk_id_produccion") {
      setSelectedProduccionId(value);
    }
  };

  const handleSubmit = (formData: { [key: string]: string | File }) => {
    setErrorMessage(null);

    const errors: string[] = [];
    if (!formData.fk_id_produccion) errors.push("Producción es obligatoria");
    if (!formData.cantidad || parseFloat(formData.cantidad as string) <= 0) {
      errors.push("Cantidad debe ser mayor a cero");
    }
    if (!formData.fk_unidad_medida) errors.push("Unidad de medida es obligatoria");
    if (!formData.precio_unidad || parseFloat(formData.precio_unidad as string) <= 0) {
      errors.push("Precio por unidad debe ser mayor a cero");
    }
    if (!formData.fecha) errors.push("Fecha de venta es obligatoria");

    if (selectedProduccion && formData.cantidad &&
      parseFloat(formData.cantidad as string) > selectedProduccion.stock_disponible) {
      errors.push(`La cantidad no puede superar el stock disponible (${formatearNumero(selectedProduccion.stock_disponible)})`);
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join(", "));
      return;
    }

    if (!selectedProduccion) {
      setErrorMessage("Seleccione una producción válida");
      return;
    }

    const cantidad = parseFloat(formData.cantidad as string);
    const precioUnidad = parseFloat(formData.precio_unidad as string);
    const unidadMedidaId = parseInt(formData.fk_unidad_medida as string, 10);

    const unidadSeleccionada = unidades.find((u) => u.id === unidadMedidaId);
    const factorConversion = unidadSeleccionada?.factor_conversion ?? 1;

    const nuevaVenta: NuevaVenta = {
      fk_id_produccion: selectedProduccion.id,
      cantidad,
      precio_unidad: precioUnidad,
      fecha: formData.fecha as string,
      fk_unidad_medida: unidadMedidaId,
      cantidad_en_base: cantidad * factorConversion,
    };

    mutation.mutate(nuevaVenta, {
      onSuccess: () => {
        addToast({
          title: "Venta creada exitosamente",
          description: "La venta ha sido registrada correctamente",
          timeout: 4000
        });

        // Refrescar producciones para actualizar el stock
        refetchProduccion();

        onSuccess ? onSuccess() : navigate("/stock");
        onClose?.();
      },
      onError: (error) => {
        addToast({
          title: "Error al crear venta",
          description: error.message || "Ocurrió un error al procesar la venta",
          timeout: 5000
        });
        setErrorMessage("Error al crear la venta. Intente de nuevo.");
      },
    });
  };

  if (isLoadingProducciones || isLoadingUnidades) {
    return <div className="text-center text-gray-500">Cargando opciones...</div>;
  }

  const produccionOptions = producciones.map((p) => ({
    value: String(p.id),
    label: `${p.nombre_produccion} - ${p.fecha}`,
  }));

  const formFields: FormField[] = [
    {
      id: "fk_id_produccion",
      label: "Producción",
      type: "select",
      options: produccionOptions,
      hasExtraButton: true,
      extraButtonText: "+",
      onExtraButtonClick: abrirModalProduccion,
      required: true,
      extraContent: selectedProduccion && (
        <div className="mt-2 p-2 bg-blue-50 text-blue-800 rounded-lg text-sm">
          <p className="font-semibold">
            Stock disponible: {formatearNumero(selectedProduccion.stock_disponible)}{" "}
            {selectedProduccion.fk_unidad_medida?.unidad_base || ""}
          </p>
        </div>
      )
    },
    {
      id: "cantidad",
      label: "Cantidad",
      type: "number",
      min: 0.01,
      step: "any",
      required: true,
      max: selectedProduccion?.stock_disponible,
      placeholder: selectedProduccion ? `Máximo ${formatearNumero(selectedProduccion.stock_disponible)} unidades` : ""
    },
    {
      id: "fk_unidad_medida",
      label: "Unidad de Medida",
      type: "select",
      options: unidades.map((u: any) => ({
        value: u.id.toString(),
        label: `${u.nombre_medida} (${u.unidad_base})`,
      })),
      hasExtraButton: true,
      extraButtonText: "+",
      onExtraButtonClick: abrirModalMedida,
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
    <div className="max-w-4xl mx-auto p-4">
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{errorMessage}</p>
        </div>
      )}

      <Formulario
        title="Crear Venta"
        fields={formFields}
        onSubmit={handleSubmit}
        onFieldChange={handleFieldChange}
      />

      {/* Modal de unidad de medida */}
      <VentanaModal
        isOpen={modalMedidaAbierto}
        onClose={cerrarModalMedida}
        contenido={<CrearUnidadMedida onSuccess={cerrarModalMedida} />}
        titulo="Crear Unidad de Medida"
      />

      {/* Modal de producción */}
      <VentanaModal
        isOpen={modalProduccionAbierto}
        onClose={cerrarModalProduccion}
        contenido={<CrearProduccion onSuccess={cerrarModalProduccion} />}
        titulo="Crear Producción"
      />
    </div>
  );
};

export default CrearVenta;
