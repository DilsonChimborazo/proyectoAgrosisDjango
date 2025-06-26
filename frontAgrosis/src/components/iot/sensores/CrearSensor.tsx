import { Sensores } from '@/hooks/iot/sensores/useCrearSensores';
import { useCrearSensores } from '../../../hooks/iot/sensores/useCrearSensores';
import Formulario from '../../globales/Formulario';
import { showToast } from '@/components/globales/Toast';

interface CrearSensorProps {
  onSuccess?: (sensor: Sensores) => void;
}

const CrearSensor = ({ onSuccess }: CrearSensorProps) => {
  const mutation = useCrearSensores();

  const TIPO_SENSOR_OPTIONS = [
    { value: 'TEMPERATURA', label: 'Temperatura' },
    { value: 'HUMEDAD_AMBIENTAL', label: 'Humedad ambiental' },
    { value: 'ILUMINACION', label: 'Iluminación' },
    { value: 'HUMEDAD_TERRENO', label: 'Humedad terreno' },
    { value: 'VELOCIDAD_VIENTO', label: 'Velocidad viento' },
    { value: 'NIVEL_DE_PH', label: 'Nivel de pH' },
    { value: 'PRESION_ATMOSFERICA', label: 'Presión atmosférica' },
    { value: 'RADIACION_SOLAR', label: 'Radiación solar' },
  ];

  const UNIDAD_MEDIDA_OPTIONS = [
    { value: '°C', label: '°C' },
    { value: '%', label: '%' },
    { value: 'Lux', label: 'Lux' },
    { value: 'm/s', label: 'm/s' },
    { value: 'pH', label: 'pH' },
    { value: 'hPa', label: 'hPa' },
    { value: 'W/m²', label: 'W/m²' },
  ];

  const formFields = [
    { id: 'nombre_sensor', label: 'Nombre del Sensor', type: 'text' },
    {
      id: 'tipo_sensor',
      label: 'Tipo de Sensor',
      type: 'select',
      options: TIPO_SENSOR_OPTIONS,
    },
    {
      id: 'unidad_medida',
      label: 'Unidad de Medida',
      type: 'select',
      options: UNIDAD_MEDIDA_OPTIONS,
    },
    { id: 'descripcion', label: 'Descripción', type: 'text' },
    { id: 'medida_minima', label: 'Medida Mínima', type: 'number' },
    { id: 'medida_maxima', label: 'Medida Máxima', type: 'number' },
  ];

  const handleSubmit = (formData: { [key: string]: string | string[] | File }) => {
    // Validar que los campos sean strings y no estén vacíos
    if (
      typeof formData.nombre_sensor !== 'string' ||
      typeof formData.tipo_sensor !== 'string' ||
      typeof formData.unidad_medida !== 'string' ||
      typeof formData.descripcion !== 'string' ||
      typeof formData.medida_minima !== 'string' ||
      typeof formData.medida_maxima !== 'string' ||
      !formData.nombre_sensor ||
      !formData.tipo_sensor ||
      !formData.unidad_medida ||
      !formData.descripcion ||
      !formData.medida_minima ||
      !formData.medida_maxima
    ) {
      showToast({
        title: 'Error',
        description: 'Todos los campos son obligatorios y deben ser válidos',
        variant: 'error',
      });
      return;
    }

    const newSensor: Sensores = {
      nombre_sensor: formData.nombre_sensor,
      tipo_sensor: formData.tipo_sensor,
      unidad_medida: formData.unidad_medida,
      descripcion: formData.descripcion,
      medida_minima: parseFloat(formData.medida_minima),
      medida_maxima: parseFloat(formData.medida_maxima),
    };

    mutation.mutate(newSensor, {
      onSuccess: (data) => {
        showToast({
          title: 'Éxito',
          description: 'Sensor creado exitosamente',
          variant: 'success',
        });
        if (onSuccess) onSuccess(data);
      },
      onError: (error: any) => {
        console.error('❌ Error al crear el sensor:', error.message);
        showToast({
          title: 'Error',
          description: 'No se pudo crear el sensor',
          variant: 'error',
        });
      },
    });
  };

  return (
    <div className="p-10">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Crear Sensor"
      />
    </div>
  );
};

export default CrearSensor;