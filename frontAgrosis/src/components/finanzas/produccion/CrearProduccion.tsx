import { useState, useMemo, ChangeEvent } from "react";
import { useCrearProduccion } from "@/hooks/finanzas/produccion/useCrearProduccion";
import { usePlantacion } from "@/hooks/trazabilidad/plantacion/usePlantacion";
import { useMedidas } from "@/hooks/inventario/unidadMedida/useMedidad";
import Formulario from "../../globales/Formulario";
import { useNavigate } from "react-router-dom";
import CrearUnidadMedida from "@/components/inventario/unidadMedida/UnidadMedida";
import VentanaModal from "@/components/globales/VentanasModales";
import CrearPlantacion from "@/components/trazabilidad/plantacion/CrearPlantacion";
import { showToast } from "@/components/globales/Toast";

interface CrearProduccionProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

const CrearProduccion = ({ onClose, onSuccess }: CrearProduccionProps) => {
  const mutation = useCrearProduccion();
  const navigate = useNavigate();

  const { data: unidades = [], refetch: refetchUnidades } = useMedidas();
  const { data: plantacion = [], refetch: refetchPlantacion } = usePlantacion();

  const [modalMedidaAbierto, setModalMedidaAbierto] = useState(false);
  const [modalPlantacionAbierto, setModalPlantacionAbierto] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedFkUnidadMedida, setSelectedFkUnidadMedida] = useState<number | null>(null);

  const abrirModalMedida = () => setModalMedidaAbierto(true);
  const cerrarModalMedida = () => {
    setModalMedidaAbierto(false);
    refetchUnidades();
  };

  const abrirModalPlantacion = () => setModalPlantacionAbierto(true);
  const cerrarModalPlantacion = () => {
    setModalPlantacionAbierto(false);
    refetchPlantacion();
  };

  const formFields = useMemo(() => {
    const currentSelectedUnit = unidades.find(u => u.id === selectedFkUnidadMedida);

    const today = new Date().toISOString().split("T")[0];

    return [
      {
        id: "fk_id_plantacion",
        label: "Plantación",
        type: "select",
        options: plantacion.map((p: any) => ({
          value: p.id.toString(),
          label: `Plantación ${p.id} - ${p.fk_id_cultivo?.nombre_cultivo || "Sin cultivo"}`,
        })),
        hasExtraButton: true,
        extraButtonText: "+",
        onExtraButtonClick: abrirModalPlantacion,
        required: true,
      },
      {
        id: "nombre_produccion",
        label: "Nombre Producción",
        type: "text",
        required: true,
      },
      {
        id: "cantidad_producida",
        label: "Cantidad Producida",
        type: "number",
        step: "0.1",
        required: true,
        min: 0.01,
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
        onChange: (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
          if (e.target instanceof HTMLSelectElement) {
            setSelectedFkUnidadMedida(parseInt(e.target.value, 10));
          }
        },
        initialValue: selectedFkUnidadMedida?.toString() || "",
      },
      {
        id: "fecha",
        label: "Fecha",
        type: "date",
        required: true,
        max: today,
      },
      {
        id: "precio_sugerido_venta",
        label: `Precio Sugerido de Venta ${currentSelectedUnit ? `(por ${currentSelectedUnit.nombre_medida})` : "(seleccione unidad)"}`,
        type: "number",
        step: "0.01",
        min: 0,
        placeholder: `Ej: 1000.00 ${currentSelectedUnit ? `(por ${currentSelectedUnit.nombre_medida})` : ""}`,
        required: false,
      },
    ];
  }, [plantacion, unidades, selectedFkUnidadMedida]);

  const handleSubmit = (formData: { [key: string]: string | string[] | File }) => {
    setErrorMessage(null);

    const errors: string[] = [];

    const selectedDate = new Date(formData.fecha as string);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
      errors.push("La fecha no puede ser posterior a la fecha actual");
    }

    const fkIdPlantacion = Array.isArray(formData.fk_id_plantacion)
      ? formData.fk_id_plantacion[0]
      : formData.fk_id_plantacion;
    if (!fkIdPlantacion) errors.push("Plantación es obligatoria");

    const nombreProduccion = Array.isArray(formData.nombre_produccion)
      ? formData.nombre_produccion[0]
      : formData.nombre_produccion;
    if (!nombreProduccion || (nombreProduccion as string).trim() === "") {
      errors.push("Nombre Producción es obligatorio");
    }

    const cantidadProducida = Array.isArray(formData.cantidad_producida)
      ? formData.cantidad_producida[0]
      : formData.cantidad_producida;
    if (!cantidadProducida || parseFloat(cantidadProducida as string) <= 0) {
      errors.push("Cantidad Producida debe ser mayor a cero");
    }

    const fkUnidadMedida = Array.isArray(formData.fk_unidad_medida)
      ? formData.fk_unidad_medida[0]
      : formData.fk_unidad_medida;
    if (!fkUnidadMedida) errors.push("Unidad de Medida es obligatoria");

    if (!formData.fecha) errors.push("Fecha es obligatoria");

    const precioSugeridoVenta = Array.isArray(formData.precio_sugerido_venta)
      ? formData.precio_sugerido_venta[0]
      : formData.precio_sugerido_venta;
    if (precioSugeridoVenta && parseFloat(precioSugeridoVenta as string) < 0) {
      errors.push("El precio sugerido de venta no puede ser negativo");
    }

    if (errors.length > 0) {
      const mensajeError = errors.join(", ");
      setErrorMessage(mensajeError);
      showToast({
        title: "Error al validar el formulario",
        description: mensajeError,
        variant: "error",
        timeout: 6000,
      });
      return;
    }

    const nuevaProduccion = {
      nombre_produccion: nombreProduccion as string,
      cantidad_producida: parseFloat(cantidadProducida as string),
      fecha: formData.fecha as string,
      fk_id_plantacion: fkIdPlantacion ? parseInt(fkIdPlantacion as string, 10) : null,
      fk_unidad_medida: fkUnidadMedida ? parseInt(fkUnidadMedida as string, 10) : null,
      precio_sugerido_venta: precioSugeridoVenta ? parseFloat(precioSugeridoVenta as string) : null,
    };

    mutation.mutate(nuevaProduccion, {
      onSuccess: () => {
        showToast({
          title: "Producción creada exitosamente",
          description: "La producción ha sido registrada correctamente",
          timeout: 4000,
        });
        onSuccess ? onSuccess() : navigate("/stock");
        onClose?.();
      },
      onError: (error: any) => {
        const mensajeError = error?.message || "Ocurrió un error al crear la producción";
        showToast({
          title: "Error al crear producción",
          description: mensajeError,
          variant: "error",
          timeout: 5000,
        });
        setErrorMessage("Error al crear la producción. Intente de nuevo.");
      },
    });
  };

  return (
    <div>
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{errorMessage}</p>
        </div>
      )}

      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Crear Producción"
      />

      <VentanaModal
        isOpen={modalPlantacionAbierto}
        onClose={cerrarModalPlantacion}
        contenido={<CrearPlantacion onSuccess={cerrarModalPlantacion} />}
        titulo="Crear Plantación"
      />

      <VentanaModal
        isOpen={modalMedidaAbierto}
        onClose={cerrarModalMedida}
        contenido={<CrearUnidadMedida onSuccess={cerrarModalMedida} />}
        titulo="Crear Unidad de Medida"
      />
    </div>
  );
};

export default CrearProduccion;