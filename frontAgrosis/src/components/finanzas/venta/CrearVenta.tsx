import { useState } from "react";
import { useCrearVenta } from "@/hooks/finanzas/venta/useCrearVenta";
import Formulario from "@/components/globales/Formulario";
import { useNavigate } from "react-router-dom";
import { useProduccion } from "@/hooks/finanzas/produccion/useProduccion";
import { useMedidas } from "@/hooks/inventario/unidadMedida/useMedidad";
import { NuevaVenta } from "@/hooks/finanzas/venta/useCrearVenta";
import { Produccion } from "@/hooks/finanzas/venta/useVenta";
import CrearUnidadMedida from "@/components/inventario/unidadMedida/UnidadMedida";
import CrearProduccion from "@/components/finanzas/produccion/CrearProduccion";
import VentanaModal from "@/components/globales/VentanasModales";

interface CrearVentaProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

const CrearVenta = ({ onClose, onSuccess }: CrearVentaProps) => {
  const mutation = useCrearVenta();
  const navigate = useNavigate();

  const { data: producciones = [], refetch: refetchProduccion, isLoading: isLoadingProducciones } = useProduccion();
  const { data: unidades = [], refetch: refetchUnidades, isLoading: isLoadingUnidades } = useMedidas();

  const [modalMedidaAbierto, setModalMedidaAbierto] = useState(false);
  const [modalProduccionAbierto, setModalProduccionAbierto] = useState(false);
  const [stockSeleccionado, setStockSeleccionado] = useState<number | null>(null);
  const [produccionSeleccionada, setProduccionSeleccionada] = useState<Produccion | null>(null);

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

  const handleProduccionChange = (idProduccion: string) => {
    const id = Number(idProduccion);
    const produccion = producciones.find((p: Produccion) => p.id === id);
    if (produccion) {
      setProduccionSeleccionada(produccion);
      setStockSeleccionado(produccion.stock_disponible);
    }
  };

  const handleSubmit = (formData: { [key: string]: string | File }) => {
    if (!produccionSeleccionada) {
      console.error("Error: Debe seleccionar una producción");
      return;
    }

    const cantidad = parseFloat(formData.cantidad as string);
    const precioUnidad = parseFloat(formData.precio_unidad as string);
    const unidadMedidaId = parseInt(formData.fk_unidad_medida as string, 10);

    if (cantidad <= 0 || precioUnidad <= 0) {
      console.error("Error: Cantidad y precio deben ser mayores a cero");
      return;
    }

    if (stockSeleccionado !== null && cantidad > stockSeleccionado) {
      console.error("Error: La cantidad no puede ser mayor al stock disponible");
      return;
    }

    const unidadSeleccionada = unidades.find((u) => u.id === unidadMedidaId);
    const factorConversion = unidadSeleccionada?.factor_conversion ?? 1;

    const nuevaVenta: NuevaVenta = {
      fk_id_produccion: produccionSeleccionada.id,
      cantidad,
      precio_unidad: precioUnidad,
      fecha: formData.fecha as string,
      fk_unidad_medida: unidadMedidaId,
      cantidad_en_base: cantidad * factorConversion,
    };

    mutation.mutate(nuevaVenta, {
      onSuccess: () => {
        onSuccess ? onSuccess() : navigate("/stock");
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

  const produccionOptions = producciones.map((p) => ({
    value: String(p.id),
    label: `${p.nombre_produccion} - ${p.fecha}`,
  }));

  const formFields = [
    {
      id: "fk_id_produccion",
      label: "Producción",
      type: "select",
      options: produccionOptions,
      hasExtraButton: true,
      extraButtonText: "+",
      onExtraButtonClick: abrirModalProduccion,
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
    <div className="max-w-4xl mx-auto">
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
          if (id === "fk_id_produccion") handleProduccionChange(value);
        }}
        stockMessage={
          stockSeleccionado !== null
            ? `Stock disponible: ${stockSeleccionado} unidades`
            : ""
        }
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
