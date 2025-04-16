import { Sensores } from '@/hooks/iot/sensores/useCrearSensores';
import { useCrearSensores } from '../../../hooks/iot/sensores/useCrearSensores';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';

const CrearSensor = () => {
  const mutation = useCrearSensores();
  const navigate = useNavigate();

  // Definimos las opciones para tipo_sensor basadas en el modelo de Django
  const TIPO_SENSOR_OPTIONS = [
    { value: 'TEMPERATURA', label: 'Temperatura' },
    { value: 'HUMEDAD_AMBIENTAL', label: 'Humedad ambiental' },
    { value: 'ILUMINACION', label: 'Iluminación' }, // Corregimos la capitalización para mejor legibilidad
    { value: 'HUMEDAD TERRENO', label: 'Humedad terreno' },
    { value: 'VELOCIDAD VIENTO', label: 'Velocidad viento' },
    { value: 'NIVEL DE PH', label: 'Nivel de pH' }, // Corregimos "ph" a "pH" para mejor legibilidad
  ];

  // Definimos los campos del formulario
  const formFields = [
    { id: 'nombre_sensor', label: 'Nombre del Sensor', type: 'text' },
    {
      id: 'tipo_sensor',
      label: 'Tipo de Sensor',
      type: 'select',
      options: TIPO_SENSOR_OPTIONS, // Usamos las opciones definidas
    },
    { id: 'unidad_medida', label: 'Unidad de Medida', type: 'text' },
    { id: 'descripcion', label: 'Descripción', type: 'text' },
    { id: 'medida_minima', label: 'Medida Mínima', type: 'number' },
    { id: 'medida_maxima', label: 'Medida Máxima', type: 'number' },
  ];

  // Manejar el envío del formulario
  const handleSubmit = (formData: { [key: string]: string }) => {
    // Validar que los campos requeridos estén presentes
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
      tipo_sensor: formData.tipo_sensor, // El valor ya será uno de los definidos en TIPO_SENSOR_OPTIONS
      unidad_medida: formData.unidad_medida,
      descripcion: formData.descripcion,
      medida_minima: parseFloat(formData.medida_minima),
      medida_maxima: parseFloat(formData.medida_maxima),
    };

    mutation.mutate(newSensor, {
      onSuccess: () => {
        console.log('✅ Sensor creado correctamente');
        navigate('/iot');
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