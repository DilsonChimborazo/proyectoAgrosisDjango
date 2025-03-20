import { Semilleros } from '@/hooks/trazabilidad/semillero/useCrearSemillero';
import { useCrearSemillero } from '../../../hooks/trazabilidad/semillero/useCrearSemillero';
import Formulario from '../../globales/Formulario';


const CrearSemillero = () => {
const mutation = useCrearSemillero()

const formFields = [
    { id: 'nombre_semilla', label: 'Nombre De Semilla', type: 'text' },
    { id: 'fecha_siembra', label: 'Fecha De Siembra ', type: 'Date' },
    { id: 'fecha_estimada', label: 'Fecha Estimada ', type: 'Date' },
    { id: 'cantidad', label: 'Cantidad', type: 'number' },
   
];

const handleSubmit = (formData: { [key: string]: string }) => {
    const newSemillero: Semilleros = {
        nombre_semilla: formData.nombre_semilla,
        fecha_siembra: new Date(formData.fecha_siembra).toISOString(), 
        fecha_estimada: new Date(formData.fecha_estimada).toISOString(), 
        cantidad: parseInt(formData.cantidad),
        
    };
    mutation.mutate(newSemillero);
};


return (
    <div className="max-w-4xl mx-auto p-4">
        <Formulario fields={formFields} 
        onSubmit={handleSubmit} 
        isError={mutation.isError} 
        isSuccess={mutation.isSuccess}
        title="Crear Semillero"  />
    </div>
    );
};

export default CrearSemillero;
