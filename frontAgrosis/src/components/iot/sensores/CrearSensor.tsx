import { Sensores } from '@/hooks/iot/sensores/useCrearSensores';
import { useCrearSensores } from '../../../hooks/iot/sensores/useCrearSensores';
import Formulario from '../../globales/Formulario';

interface CrearSensorProps {
  onSuccess?: () => void;
}

const CrearSensor = ({ onSuccess }: CrearSensorProps) => {
  const mutation = useCrearSensores();

  const TIPO_SENSOR_OPTIONS = [
    { value: 'TEMPERATURA', label: 'Temperatura' },
    { value: 'HUMEDAD_AMBIENTAL', label: 'Humedad ambiental' },
    { value: 'ILUMINACION', label: 'Iluminación' },
    { value: 'HUMEDAD_TERRENO', label: 'Humedad terreno' },
    { value: 'VELOCIDAD_VIENTO', label: 'Velocidad viento' },
    { value: 'NIVEL DE PH', label: 'Nivel de pH' },
    { value: 'RADIACION_SOLAR', label: 'Radiacion solar'} 
  ];

  const formFields = [
    { id: 'nombre_sensor', label: 'Nombre del Sensor', type: 'text' },
    {
      id: 'tipo_sensor',
      label: 'Tipo de Sensor',
      type: 'select',
      options: TIPO_SENSOR_OPTIONS,
    },
    { id: 'unidad_medida', label: 'Unidad de Medida', type: 'text' },
    { id: 'descripcion', label: 'Descripción', type: 'text' },
    { id: 'medida_minima', label: 'Medida Mínima', type: 'number' },
    { id: 'medida_maxima', label: 'Medida Máxima', type: 'number' },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    if (
      !formData.nombre_sensor ||
      !formData.tipo_sensor ||
      !formData.unidad_medida ||
      !formData.descripcion ||
      !formData.medida_minima ||
      !formData.medida_maxima
    ) {
      console.log('Campos faltantes');
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
      onSuccess: () => {
        console.log('✅ Sensor creado correctamente');
        if (onSuccess) onSuccess();
      },
      onError: (error) => {
        console.error('❌ Error al crear el sensor:', error);
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