import { useState } from 'react';
import { useCrearTipoCultivo } from '@/hooks/trazabilidad/tipoCultivo/useCrearTipoCultivo';
import Formulario from '../../globales/Formulario';
import { showToast } from '@/components/globales/Toast';

interface CrearTipoCultivoProps {
  onSuccess: () => void;
}

const CICLO_OPCIONES = [
  { value: '', label: 'Seleccione el tipo de cultivo' },
  { value: 'Perennes', label: 'Perennes' },
  { value: 'Semiperennes', label: 'Semiperennes' },
  { value: 'Transitorios', label: 'Transitorios' },
];

const CrearTipoCultivo = ({ onSuccess }: CrearTipoCultivoProps) => {
  const { mutate: createTipoCultivo, isPending } = useCrearTipoCultivo();

  const formFields = [
    { id: 'nombre', label: 'Nombre', type: 'text', required: true },
    { id: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
    {
      id: 'ciclo_duracion',
      label: 'Ciclo de Duración',
      type: 'select',
      options: CICLO_OPCIONES,
      required: true,
    },
  ];

  const handleSubmit = (formData: { [key: string]: string | File }) => {
    const nombre = formData.nombre as string;
    const descripcion = formData.descripcion as string;
    const cicloDuracion = formData.ciclo_duracion as string;

    if (!nombre) {
      showToast({
        title: 'Error al crear tipo de cultivo',
        description: 'El nombre es obligatorio',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    if (!cicloDuracion) {
      showToast({
        title: 'Error al crear tipo de cultivo',
        description: 'Debe seleccionar un ciclo de duración',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    createTipoCultivo(
      { nombre, descripcion: descripcion || '', ciclo_duracion: cicloDuracion },
      {
        onSuccess: () => {
          showToast({
            title: 'Tipo de cultivo creado exitosamente',
            description: 'El tipo de cultivo ha sido registrado en el sistema',
            timeout: 4000,
            variant: 'success',
          });
          onSuccess();
        },
        onError: (error: any) => {
          showToast({
            title: 'Error al crear tipo de cultivo',
            description: error.response?.data?.detail || 'Ocurrió un error al registrar el tipo de cultivo',
            timeout: 5000,
            variant: 'error',
          });
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={isPending}
        isSuccess={false}
        title="Crear Nuevo Tipo de Cultivo"
      />
    </div>
  );
};

export default CrearTipoCultivo;