import { useState } from "react";
import { useCrearProduccion } from '@/hooks/finanzas/produccion/useCrearProduccion';
import { usePlantacion } from '@/hooks/trazabilidad/plantacion/usePlantacion';
import { useMedidas } from '@/hooks/inventario/unidadMedida/useMedidad';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';
import CrearUnidadMedida from "@/components/inventario/unidadMedida/UnidadMedida";
import VentanaModal from "@/components/globales/VentanasModales";
import CrearPlantacion from "@/components/trazabilidad/plantacion/CrearPlantacion";

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
      required: true
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
      step: '0.1'
    },
  ];

  const handleSubmit = (formData: { [key: string]: string | File }) => {
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
        onSuccess ? onSuccess() : navigate("/stock");
        onClose?.();
      },
      onError: (error) => {
        console.error("Error al crear la producción:", error.message);
      },
    });
  };

  return (
    <div>
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
