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
      // No se muestra toast, solo se puede manejar en la UI si es necesario
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

  const handleSubmit = (formData: { [key: string]: string | File | string[] }) => {
    // Convertimos los valores a string, manejando string[] si es necesario
    const nombreComun = Array.isArray(formData.nombre_comun)
      ? formData.nombre_comun[0]
      : typeof formData.nombre_comun === 'string'
      ? formData.nombre_comun
      : '';
    const nombreCientifico = Array.isArray(formData.nombre_cientifico)
      ? formData.nombre_cientifico[0]
      : typeof formData.nombre_cientifico === 'string'
      ? formData.nombre_cientifico
      : '';
    const descripcion = Array.isArray(formData.descripcion)
      ? formData.descripcion[0]
      : typeof formData.descripcion === 'string'
      ? formData.descripcion
      : '';
    const fkIdTipoCultivo = Array.isArray(formData.fk_id_tipo_cultivo)
      ? formData.fk_id_tipo_cultivo[0]
      : typeof formData.fk_id_tipo_cultivo === 'string'
      ? formData.fk_id_tipo_cultivo
      : '';

    // Verificamos que no se hayan recibido Files
    if (
      formData.nombre_comun instanceof File ||
      formData.nombre_cientifico instanceof File ||
      formData.descripcion instanceof File ||
      formData.fk_id_tipo_cultivo instanceof File
    ) {
      showToast({
        title: 'Error al crear especie',
        description: 'Los campos no pueden contener archivos',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    // Validamos que los valores no sean arrays
    if (
      Array.isArray(formData.nombre_comun) ||
      Array.isArray(formData.nombre_cientifico) ||
      Array.isArray(formData.descripcion) ||
      Array.isArray(formData.fk_id_tipo_cultivo)
    ) {
      showToast({
        title: 'Error al crear especie',
        description: 'Todos los campos deben ser valores de texto',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    // Validamos campos obligatorios
    if (!nombreComun || !nombreCientifico || !fkIdTipoCultivo) {
      showToast({
        title: 'Error al crear especie',
        description: 'Todos los campos son obligatorios',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    // Validamos que el tipo de cultivo exista
    const tipoCultivoExists = tiposCultivo.some((tipo) => tipo.id === Number(fkIdTipoCultivo));
    if (!tipoCultivoExists) {
      showToast({
        title: 'Error al crear especie',
        description: 'El tipo de cultivo seleccionado no es válido',
        timeout: 5000,
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
          description: 'La especie ha sido registrada en el nuty sistema',
          timeout: 4000,
          variant: 'success',
        });
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      },
      onError: (error: any) => {
        showToast({
          title: 'Error al crear especie',
          description: error.response?.data?.detail || 'Ocurrió un error al registrar la especie',
          timeout: 5000,
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
        titulo=""
      />
    </div>
  );
};

export default CrearEspecie;