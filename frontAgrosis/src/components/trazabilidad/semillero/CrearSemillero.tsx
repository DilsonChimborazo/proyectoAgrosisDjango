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
        title: 'Error al crear semillero',
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
        title: 'Error al crear semillero',
        description: 'Todos los campos deben ser valores de texto o números',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    // Validamos campos obligatorios
    if (!nombreSemilla || !fechaSiembra || !fechaEstimada || !cantidad) {
      showToast({
        title: 'Error al crear semillero',
        description: 'Todos los campos son obligatorios',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    // Validamos fechas
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

    // Validamos cantidad
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