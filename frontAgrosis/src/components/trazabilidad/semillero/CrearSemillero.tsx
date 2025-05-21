import { useState } from 'react';
import { useCrearSemillero, Semillero } from '@/hooks/trazabilidad/semillero/useCrearSemillero';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/components/globales/Toast';

const CrearSemillero = ({ onSuccess }: { onSuccess: () => void }) => {
  const mutation = useCrearSemillero();
  const navigate = useNavigate();

  const formFields = [
    { id: 'nombre_semilla', label: 'Nombre del Semillero', type: 'text', required: true },
    { id: 'fecha_siembra', label: 'Fecha de Siembra', type: 'date', required: true },
    { id: 'fecha_estimada', label: 'Fecha Estimada', type: 'date', required: true },
    { id: 'cantidad', label: 'Cantidad', type: 'number', required: true, min: 1 },
  ];

  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const handleSubmit = (formData: { [key: string]: string | File }) => {
    const nombreSemilla = formData.nombre_semilla as string;
    const fechaSiembra = formData.fecha_siembra as string;
    const fechaEstimada = formData.fecha_estimada as string;
    const cantidad = formData.cantidad as string;

    if (!nombreSemilla || !fechaSiembra || !fechaEstimada || !cantidad) {
      showToast({
        title: 'Error al crear semillero',
        description: 'Todos los campos son obligatorios',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    if (!isValidDate(fechaSiembra)) {
      showToast({
        title: 'Error al crear semillero',
        description: 'La fecha de siembra no es válida',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    if (!isValidDate(fechaEstimada)) {
      showToast({
        title: 'Error al crear semillero',
        description: 'La fecha estimada no es válida',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    const cantidadNum = parseInt(cantidad, 10);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      showToast({
        title: 'Error al crear semillero',
        description: 'La cantidad debe ser un número mayor que 0',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    const nuevoSemillero: Semillero = {
      id: 0,
      nombre_semilla: nombreSemilla.trim(),
      fecha_siembra: new Date(fechaSiembra).toISOString().split('T')[0],
      fecha_estimada: new Date(fechaEstimada).toISOString().split('T')[0],
      cantidad: cantidadNum,
    };

    mutation.mutate(nuevoSemillero, {
      onSuccess: () => {
        showToast({
          title: 'Semillero creado exitosamente',
          description: 'El semillero ha sido registrado en el sistema',
          timeout: 4000,
          variant: 'success',
        });
        onSuccess();
        navigate('');
      },
      onError: (error: any) => {
        showToast({
          title: 'Error al crear semillero',
          description: error.response?.data?.detail || 'Ocurrió un error al registrar el semillero',
          timeout: 5000,
          variant: 'error',
        });
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Registrar Semillero"
      />
    </div>
  );
};

export default CrearSemillero;