import { useState, useEffect } from 'react';
import { useActualizarEspecie } from '@/hooks/trazabilidad/especie/useActualizarEspecie';
import { useEspeciePorId } from '@/hooks/trazabilidad/especie/useEspeciePorId';
import { useTipoCultivo } from '@/hooks/trazabilidad/tipoCultivo/useTipoCultivo';
import Formulario from '../../globales/Formulario';
import { showToast } from '@/components/globales/Toast';

interface ActualizarEspecieProps {
  id: number;
  initialValues: {
    nombre_comun: string;
    nombre_cientifico: string;
    descripcion: string;
    fk_id_tipo_cultivo: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const ActualizarEspecie = ({ id, initialValues, onSuccess }: ActualizarEspecieProps) => {
  const { data: especie, isLoading, error } = useEspeciePorId(id);
  const { mutate: actualizarEspecie, isError } = useActualizarEspecie();
  const { data: tiposCultivo = [], isLoading: isLoadingTiposCultivo } = useTipoCultivo();

  const tipoCultivoOptions = [
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
    },
  ];

  const [formValues, setFormValues] = useState(initialValues);

  useEffect(() => {
    if (especie && tiposCultivo.length > 0) {
      const fkIdTipoCultivo = especie.fk_id_tipo_cultivo?.toString() || '';
      const tipoCultivoExists = tiposCultivo.some((tipo) => tipo.id.toString() === fkIdTipoCultivo);
      setFormValues({
        nombre_comun: especie.nombre_comun || '',
        nombre_cientifico: especie.nombre_cientifico || '',
        descripcion: especie.descripcion || '',
        fk_id_tipo_cultivo: tipoCultivoExists ? fkIdTipoCultivo : '',
      });
    }
  }, [especie, tiposCultivo]);

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
        title: 'Error',
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
        title: 'Error',
        description: 'Todos los campos deben ser valores de texto',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    // Validamos campos obligatorios
    if (!nombreComun || !nombreCientifico || !fkIdTipoCultivo) {
      showToast({
        title: 'Error',
        description: 'Todos los campos obligatorios deben estar completos',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    // Validamos que el tipo de cultivo exista
    const tipoCultivoExists = tiposCultivo.some((tipo) => tipo.id.toString() === fkIdTipoCultivo);
    if (!tipoCultivoExists) {
      showToast({
        title: 'Error',
        description: 'El tipo de cultivo seleccionado no es válido',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    const especieActualizada = {
      id: id, // Ya es number
      nombre_comun: nombreComun.trim(),
      nombre_cientifico: nombreCientifico.trim(),
      descripcion: descripcion.trim() || '',
      fk_id_tipo_cultivo: Number(fkIdTipoCultivo),
    };

    actualizarEspecie(especieActualizada, {
      onSuccess: () => {
        showToast({
          title: 'Éxito',
          description: 'La especie ha sido actualizada exitosamente',
          timeout: 4000,
          variant: 'success',
        });
        onSuccess();
      },
    });
  };

  if (isLoading || isLoadingTiposCultivo) {
    return <div className="text-center text-gray-500">Cargando datos...</div>;
  }

  if (error) {
    showToast({
      title: 'Error',
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
        initialValues={formValues}
        onSubmit={handleSubmit}
        isError={isError}
        isSuccess={false}
        title="Actualizar Especie"
      />
    </div>
  );
};

export default ActualizarEspecie;