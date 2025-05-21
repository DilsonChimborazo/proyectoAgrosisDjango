import { useState, useEffect } from 'react';
import { useActualizarEspecie } from '@/hooks/trazabilidad/especie/useActualizarEspecie';
import { useEspeciePorId } from '@/hooks/trazabilidad/especie/useEspeciePorId';
import { useTipoCultivo } from '@/hooks/trazabilidad/tipoCultivo/useTipoCultivo';
import VentanaModal from '../../globales/VentanasModales';
import CrearTipoCultivo from '../tipocultivo/CrearTipoCultivo';
import Formulario from '../../globales/Formulario';
import { showToast } from '@/components/globales/Toast';

interface ActualizarEspecieProps {
  id: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const ActualizarEspecie = ({ id, onSuccess, onCancel }: ActualizarEspecieProps) => {
  const { data: especie, isLoading, error } = useEspeciePorId(id);
  const { mutate: actualizarEspecie, isPending } = useActualizarEspecie();
  const { data: tiposCultivo = [], refetch: refetchTiposCultivo, isLoading: isLoadingTiposCultivo } = useTipoCultivo();

  const tipoCultivoOptions = [
    { value: '', label: 'Seleccione un tipo de cultivo' },
    ...tiposCultivo.map((tipo) => ({
      value: tipo.id.toString(),
      label: tipo.nombre || 'Sin nombre',
    })),
  ];

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

  const [initialValues, setInitialValues] = useState({
    nombre_comun: '',
    nombre_cientifico: '',
    descripcion: '',
    fk_id_tipo_cultivo: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (especie) {
      setInitialValues({
        nombre_comun: especie.nombre_comun || '',
        nombre_cientifico: especie.nombre_cientifico || '',
        descripcion: especie.descripcion || '',
        fk_id_tipo_cultivo: especie.fk_id_tipo_cultivo?.toString() || '',
      });
    }
  }, [especie]);

  const handleSubmit = (formData: { [key: string]: string | File }) => {
    const nombreComun = formData.nombre_comun as string;
    const nombreCientifico = formData.nombre_cientifico as string;
    const descripcion = formData.descripcion as string;
    const fkIdTipoCultivo = formData.fk_id_tipo_cultivo as string;

    if (!nombreComun || !nombreCientifico || !fkIdTipoCultivo) {
      showToast({
        title: 'Error al actualizar especie',
        description: 'Todos los campos son obligatorios',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    const tipoCultivoExists = tiposCultivo.some((tipo) => tipo.id === Number(fkIdTipoCultivo));
    if (!tipoCultivoExists) {
      showToast({
        title: 'Error al actualizar especie',
        description: 'El tipo de cultivo seleccionado no es válido',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    const especieActualizada = {
      id,
      nombre_comun: nombreComun.trim(),
      nombre_cientifico: nombreCientifico.trim(),
      descripcion: descripcion.trim() || '',
      fk_id_tipo_cultivo: Number(fkIdTipoCultivo),
    };

    actualizarEspecie(especieActualizada, {
      onSuccess: () => {
        showToast({
          title: 'Especie actualizada exitosamente',
          description: 'La especie ha sido actualizada en el sistema',
          timeout: 4000,
          variant: 'success',
        });
        onSuccess();
      },
      onError: (error: any) => {
        showToast({
          title: 'Error al actualizar especie',
          description: error.response?.data?.detail || 'Ocurrió un error al actualizar la especie',
          timeout: 5000,
          variant: 'error',
        });
      },
    });
  };

  if (isLoading || isLoadingTiposCultivo) {
    return <div className="text-center text-gray-500">Cargando datos...</div>;
  }

  if (error) {
    showToast({
      title: 'Error al cargar especie',
      description: error.message || 'No se pudo cargar los datos de la especie',
      timeout: 5000,
      variant: 'error',
    });
    return <div className="text-center text-red-500">Error al cargar los datos de la especie</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        isError={isPending}
        isSuccess={false}
        title="Actualizar Especie"
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

export default ActualizarEspecie;