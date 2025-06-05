import { useState, useMemo, useEffect } from 'react';
import { useCrearEspecie } from '@/hooks/trazabilidad/especie/useCrearEspecie';
import { useTipoCultivo, TipoCultivo } from '@/hooks/trazabilidad/tipoCultivo/useTipoCultivo';
import VentanaModal from '../../globales/VentanasModales';
import CrearTipoCultivo from '../tipocultivo/CrearTipoCultivo';
import Formulario from '../../globales/Formulario';
import { showToast } from '@/components/globales/Toast';

interface CrearEspecieProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CrearEspecie = ({ onSuccess }: CrearEspecieProps) => {
  const mutation = useCrearEspecie();
  const { data: tiposCultivo = [], isLoading: isLoadingTiposCultivo, refetch: refetchTiposCultivo } = useTipoCultivo();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tipoCultivoOptions = useMemo(() => {
    return [
      ...tiposCultivo.map((tipo: TipoCultivo) => ({
        value: tipo.id.toString(),
        label: tipo.nombre || 'Sin nombre',
      })),
    ];
  }, [tiposCultivo]);

  useEffect(() => {
    if (!isLoadingTiposCultivo && tiposCultivo.length === 0) {
      showToast({
        title: 'Error al crear especie',
        description: 'No hay tipos de cultivo registrados',
        timeout: 3000,
        variant: 'error',
      });
    }
  }, [isLoadingTiposCultivo, tiposCultivo.length]);

  const formFields = [
    { id: 'nombre_comun', label: 'Nombre Común', type: 'text', required: true },
    { id: 'nombre_cientifico', label: 'Nombre Científico', type: 'text', required: true },
    { id: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
    {
      id: 'fk_id_tipo_cultivo',
      label: 'Tipo de Cultivo',
      type: 'select',
      options: tipoCultivoOptions,
      required: true,
      hasExtraButton: true,
      extraButtonText: '+',
      onExtraButtonClick: () => setIsModalOpen(true),
    },
  ];

  const handleSubmit = (formData: { [key: string]: string | File }) => {
    const nombreComun = formData.nombre_comun as string;
    const nombreCientifico = formData.nombre_cientifico as string;
    const descripcion = formData.descripcion as string;
    const fkIdTipoCultivo = formData.fk_id_tipo_cultivo as string;

    if (!nombreComun || !nombreCientifico || !fkIdTipoCultivo) {
      showToast({
        title: 'Error al crear especie',
        description: 'Todos los campos son obligatorios',
        timeout: 3000,
        variant: 'error',
      });
      return;
    }

    const nuevaEspecie = {
      nombre_comun: nombreComun.trim(),
      nombre_cientifico: nombreCientifico.trim(),
      descripcion: descripcion.trim() || '',
      fk_id_tipo_cultivo: parseInt(fkIdTipoCultivo, 10),
    };

    mutation.mutate(nuevaEspecie, {
      onSuccess: () => {
        showToast({
          title: 'Especie creada exitosamente',
          description: 'La especie ha sido registrada en el sistema',
          timeout: 3000,
          variant: 'success',
        });
        console.log('✅ onSuccess de CrearEspecie ejecutado');
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      },
      onError: (error: any) => {
        showToast({
          title: 'Error al crear especie',
          description: error.response?.data?.detail,
          timeout: 3000,
          variant: 'error',
        });
      },
    });
  };

  if (isLoadingTiposCultivo) {
    return <div className="text-center text-gray-500">Cargando tipos de cultivo...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Crear Especie"
      />
      <VentanaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          refetchTiposCultivo();
        }}
        contenido={<CrearTipoCultivo onSuccess={() => setIsModalOpen(false)} />}
        titulo="Crear Tipo de Cultivo"
      />
    </div>
  );
};

export default CrearEspecie;