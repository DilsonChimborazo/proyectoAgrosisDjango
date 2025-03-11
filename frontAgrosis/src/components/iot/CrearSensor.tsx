import { Sensores } from '@/hooks/iot/useCrearSensores';
import { useCrearSensores } from '../../hooks/iot/useCrearSensores';
import Formulario from '../globales/Formulario';


const CrearSensor = () => {
const mutation = useCrearSensores()

const formFields = [
    { id: 'nombre_sensor', label: 'nombre_sensor', type: 'text' },
    { id: 'tipo_sensor', label: 'tipo_sensor ', type: 'text' },
    { id: 'unidad_medida', label: 'unidad_medida ', type: 'text' },
    { id: 'descripcion', label: 'descripcion ', type: 'text' },
    { id: 'medida_minima', label: 'medida_minima ', type: 'number' },
    { id: 'medida_maxima', label: 'medida_maxima ', type: 'number' },
];

const handleSubmit = (formData: { [key: string]: string }) => {
    const newUser: Sensores = {
        nombre_sensor: formData.nombre_sensor,
        tipo_sensor: formData.tipo_sensor,
        unidad_medida: formData.unidad_medida,
        descripcion: formData.descripcion,
        medida_minima: parseFloat(formData.medida_minima),
        medida_maxima: parseFloat(formData.medida_maxima),
    };
    mutation.mutate(newUser);
};

return (
    <div className="p-10">
        <Formulario fields={formFields} 
        onSubmit={handleSubmit} 
        isError={mutation.isError} 
        isSuccess={mutation.isSuccess}
        title="Crear Sensor"  />
    </div>
    );
};

export default CrearSensor;
