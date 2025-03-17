import { Cultivos } from '@/hooks/trazabilidad/useCrearCultivo';
import { useCrearCultivo } from '../../hooks/trazabilidad/useCrearCultivo';
import Formulario from '../globales/Formulario';


const CrearCultivo = () => {
const mutation = useCrearCultivo()

const formFields = [
    { id: 'nombre_cultivo', label: 'Nombre Del Cultivo', type: 'text' },
    { id: 'fecha_plantacion', label: 'Fecha De Plantacion ', type: 'date' },
    { id: 'descripcion', label: 'Descripcion', type: 'text' },
    { id: 'fk_id_actividad', label: 'Seleccione La Actividad ', type: 'number' },
    { id: 'fk_id_semillero', label: 'Seleccione El Semillero', type: 'number' },

];

const handleSubmit = (formData: { [key: string]: string }) => {
    const newCultivo: Cultivos = {
        nombre_cultivo: formData.nombre_cultivo, 
        fecha_plantacion: new Date(formData.fecha_plantacion).toISOString(),
        descripcion: formData.descripcion,
        fk_id_especie: parseInt(formData.fk_id_especie),
        fk_id_semillero: parseInt(formData.fk_id_semillero),
    };
    mutation.mutate(newCultivo);
};


return (
    <div className="max-w-4xl mx-auto p-4">
        <Formulario fields={formFields} 
        onSubmit={handleSubmit} 
        isError={mutation.isError} 
        isSuccess={mutation.isSuccess}
        title="Crear Cultivo"  />
    </div>
    );
};

export default CrearCultivo;
