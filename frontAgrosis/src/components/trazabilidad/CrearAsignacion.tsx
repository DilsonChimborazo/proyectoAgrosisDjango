import { Asignacion } from '@/hooks/trazabilidad/useCrearAsignacion';
import { useCrearAsignacion } from '../../hooks/trazabilidad/useCrearAsignacion';
import Formulario from '../globales/Formulario';


const CrearSensor = () => {
const mutation = useCrearAsignacion()

const formFields = [
    { id: 'fecha', label: 'Fecha', type: 'Date' },
    { id: 'observaciones', label: 'Observaciones ', type: 'text' },
    { id: 'fk_id_actividad', label: 'Actividad ', type: 'number' },
    { id: 'id_identificacion', label: 'Identificacion usuario ', type: 'number' },

];

const handleSubmit = (formData: { [key: string]: string }) => {
    const newAsignacion: Asignacion = {
        fecha: new Date(formData.fecha).toISOString(), 
        observaciones: formData.observaciones,
        fk_id_actividad: parseInt(formData.fk_id_actividad),
        id_identificacion: parseInt(formData.id_identificacion),
    };
    mutation.mutate(newAsignacion);
};


return (
    <div className="max-w-4xl mx-auto p-4">
        <Formulario fields={formFields} 
        onSubmit={handleSubmit} 
        isError={mutation.isError} 
        isSuccess={mutation.isSuccess}
        title="Crear Asignacion"  />
    </div>
    );
};

export default CrearSensor;
