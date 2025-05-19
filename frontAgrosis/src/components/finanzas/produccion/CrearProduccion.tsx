import { useState } from "react";
import { useCrearProduccion } from '@/hooks/finanzas/produccion/useCrearProduccion';
import { usePlantacion } from '@/hooks/trazabilidad/plantacion/usePlantacion';
import { useMedidas } from '@/hooks/inventario/unidadMedida/useMedidad';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';
import CrearUnidadMedida from "@/components/inventario/unidadMedida/UnidadMedida";
import VentanaModal from "@/components/globales/VentanasModales";
import CrearPlantacion from "@/components/trazabilidad/plantacion/CrearPlantacion";
import { addToast } from "@heroui/react";

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

  const formFields = [
    {
      id: 'fk_id_plantacion',
      label: 'Plantación',
      type: 'select',
      options: plantacion.map((p: any) => ({
        value: p.id.toString(),
        label: `Plantación ${p.id} - ${p.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo'}`,
      })),
      hasExtraButton: true,
      extraButtonText: "+",
      onExtraButtonClick: abrirModalPlantacion,
      required: true,
    },
    {
      id: 'nombre_produccion',
      label: 'Nombre Producción',
      type: 'text',
      required: true
    },
    {
      id: 'cantidad_producida',
      label: 'Cantidad Producida',
      type: 'number',
      step: '0.1',
      required: true,
      min: 0.01
    },
    {
      id: 'fk_unidad_medida',
      label: 'Unidad de Medida',
      type: 'select',
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
      id: 'fecha',
      label: 'Fecha',
      type: 'date',
      required: true
    },
    {
      id: 'stock_disponible',
      label: 'Stock Disponible',
      type: 'number',
      step: '0.1',
      min: 0
    },
  ];

  const handleSubmit = (formData: { [key: string]: string | File }) => {
    setErrorMessage(null);

    // Validaciones básicas:
    const errors: string[] = [];

    if (!formData.fk_id_plantacion) errors.push("Plantación es obligatoria");
    if (!formData.nombre_produccion || (formData.nombre_produccion as string).trim() === "") errors.push("Nombre Producción es obligatorio");
    if (!formData.cantidad_producida || parseFloat(formData.cantidad_producida as string) <= 0) errors.push("Cantidad Producida debe ser mayor a cero");
    if (!formData.fk_unidad_medida) errors.push("Unidad de Medida es obligatoria");
    if (!formData.fecha) errors.push("Fecha es obligatoria");

    if (errors.length > 0) {
      const mensajeError = errors.join(", ");
      setErrorMessage(mensajeError);
      addToast({
        title: "Error al validar el formulario",
        description: mensajeError,
        timeout: 6000
      });
      return;
    }

    const nuevaProduccion = {
      nombre_produccion: formData.nombre_produccion as string,
      cantidad_producida: parseFloat(formData.cantidad_producida as string),
      fecha: formData.fecha as string,
      fk_id_plantacion: formData.fk_id_plantacion ? parseInt(formData.fk_id_plantacion as string, 10) : null,
      fk_unidad_medida: formData.fk_unidad_medida ? parseInt(formData.fk_unidad_medida as string, 10) : null,
      stock_disponible: formData.stock_disponible ? parseFloat(formData.stock_disponible as string) : undefined,
    };

    mutation.mutate(nuevaProduccion, {
      onSuccess: () => {
        addToast({
          title: "Producción creada exitosamente",
          description: "La producción ha sido registrada correctamente",
          timeout: 4000
        });
        onSuccess ? onSuccess() : navigate("/stock");
        onClose?.();
      },
      onError: (error: any) => {
        const mensajeError = error?.message || "Ocurrió un error al crear la producción";
        addToast({
          title: "Error al crear producción",
          description: mensajeError,
          timeout: 5000
        });
        setErrorMessage("Error al crear la producción. Intente de nuevo.");
        console.error("Error al crear la producción:", error.message);
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

      {/* Modal Plantación */}
      <VentanaModal
        isOpen={modalPlantacionAbierto}
        onClose={cerrarModalPlantacion}
        contenido={<CrearPlantacion onSuccess={cerrarModalPlantacion} />}
        titulo="Crear Plantación"
      />

      {/* Modal Unidad de Medida */}
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
