import { useState, useEffect } from 'react';
import { useSemilleroPorId } from '@/hooks/trazabilidad/semillero/useSemilleroPorId';
import { useActualizarSemillero } from '@/hooks/trazabilidad/semillero/useActualizarSemillero';
import Formulario from '../../globales/Formulario';
import { showToast } from '@/components/globales/Toast';

interface ActualizarSemilleroProps {
  id: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const ActualizarSemillero = ({ id, onSuccess }: ActualizarSemilleroProps) => {
  const { data: semillero, isLoading, error } = useSemilleroPorId(id.toString());
  const { mutate: actualizarSemillero, isPending } = useActualizarSemillero();

  const formFields = [
    { id: 'nombre_semilla', label: 'Nombre del Semillero', type: 'text', required: true },
    { id: 'fecha_siembra', label: 'Fecha de Siembra', type: 'date', required: true },
    { id: 'fecha_estimada', label: 'Fecha Estimada', type: 'date', required: true },
    { id: 'cantidad', label: 'Cantidad', type: 'number', required: true, min: 1 },
  ];

  const [initialValues, setInitialValues] = useState({
    nombre_semilla: '',
    fecha_siembra: '',
    fecha_estimada: '',
    cantidad: '',
  });

  useEffect(() => {
    if (semillero) {
      setInitialValues({
        nombre_semilla: semillero.nombre_semilla || '',
        fecha_siembra: semillero.fecha_siembra?.split('T')[0] || '',
        fecha_estimada: semillero.fecha_estimada?.split('T')[0] || '',
        cantidad: semillero.cantidad?.toString() || '',
      });
    }
  }, [semillero]);

  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const handleSubmit = (formData: { [key: string]: string | File | string[] }) => {
    // Convertimos los valores a string, manejando string[] si es necesario
    const nombreSemilla = Array.isArray(formData.nombre_semilla)
      ? formData.nombre_semilla[0]
      : typeof formData.nombre_semilla === 'string'
      ? formData.nombre_semilla
      : '';
    const fechaSiembra = Array.isArray(formData.fecha_siembra)
      ? formData.fecha_siembra[0]
      : typeof formData.fecha_siembra === 'string'
      ? formData.fecha_siembra
      : '';
    const fechaEstimada = Array.isArray(formData.fecha_estimada)
      ? formData.fecha_estimada[0]
      : typeof formData.fecha_estimada === 'string'
      ? formData.fecha_estimada
      : '';
    const cantidad = Array.isArray(formData.cantidad)
      ? formData.cantidad[0]
      : typeof formData.cantidad === 'string'
      ? formData.cantidad
      : '';

    // Verificamos que no se hayan recibido Files
    if (
      formData.nombre_semilla instanceof File ||
      formData.fecha_siembra instanceof File ||
      formData.fecha_estimada instanceof File ||
      formData.cantidad instanceof File
    ) {
      showToast({
        title: 'Error al actualizar semillero',
        description: 'Los campos no pueden contener archivos',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    // Validamos que los valores no sean arrays
    if (
      Array.isArray(formData.nombre_semilla) ||
      Array.isArray(formData.fecha_siembra) ||
      Array.isArray(formData.fecha_estimada) ||
      Array.isArray(formData.cantidad)
    ) {
      showToast({
        title: 'Error al actualizar semillero',
        description: 'Todos los campos deben ser valores de texto o números',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    // Validamos campos obligatorios
    if (!nombreSemilla || !fechaSiembra || !fechaEstimada || !cantidad) {
      showToast({
        title: 'Error al actualizar semillero',
        description: 'Todos los campos son obligatorios',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    // Validamos fechas
    if (!isValidDate(fechaSiembra)) {
      showToast({
        title: 'Error al actualizar semillero',
        description: 'La fecha de siembra no es válida',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    if (!isValidDate(fechaEstimada)) {
      showToast({
        title: 'Error al actualizar semillero',
        description: 'La fecha estimada no es válida',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    // Validamos cantidad
    const cantidadNum = parseInt(cantidad, 10);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      showToast({
        title: 'Error al actualizar semillero',
        description: 'La cantidad debe ser un número mayor que 0',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    const semilleroActualizado = {
      id,
      nombre_semilla: nombreSemilla.trim(),
      fecha_siembra: new Date(fechaSiembra).toISOString().split('T')[0],
      fecha_estimada: new Date(fechaEstimada).toISOString().split('T')[0],
      cantidad: cantidadNum,
    };

    actualizarSemillero(semilleroActualizado, {
      onSuccess: () => {
        showToast({
          title: 'Semillero actualizado exitosamente',
          description: 'El semillero ha sido actualizado en el sistema',
          timeout: 4000,
          variant: 'success',
        });
        onSuccess();
      },
      onError: (error: any) => {
        showToast({
          title: 'Error al actualizar semillero',
          description: error.response?.data?.detail || 'Ocurrió un error al actualizar el semillero',
          timeout: 5000,
          variant: 'error',
        });
      },
    });
  };

  if (isLoading) {
    return <div className="text-center text-gray-500">Cargando datos...</div>;
  }

  if (error) {
    showToast({
      title: 'Error al cargar semillero',
      description: error.message || 'No se pudo cargar los datos del semillero',
      timeout: 5000,
      variant: 'error',
    });
    return <div className="text-center text-red-500">Error al cargar el semillero</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isError={isPending}
        isSuccess={false}
        title="Actualizar Semillero"
      />
    </div>
  );
};

export default ActualizarSemillero;