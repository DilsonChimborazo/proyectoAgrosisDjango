import { Especie } from '@/hooks/trazabilidad/especie/useCrearEspecie';
import Formulario from '../../globales/Formulario';
import { useCrearEspecie } from '@/hooks/trazabilidad/especie/useCrearEspecie';


const CrearEspecie = () => {
const mutation = useCrearEspecie()

const formFields = [
    { id: 'nombre_comun', label: 'Nombre Común', type: 'text' },
    { id: 'nombre_cientifico', label: 'Nombre Cientifico ', type: 'text' },
    { id: 'descripcion', label: 'Descripcion', type: 'text' },
    { id: 'fk_id_tipo_cultivo', label: 'Tipo De Cultivo ', type: 'number' },
   
];

const handleSubmit = (formData: { [key: string]: string }) => {
    const newEspecie: Especie = {
        nombre_comun: formData.nombre_cultivo, 
        nombre_cientifico: formData.nombre_cientifico,
        descripcion: formData.descripcion,
        fk_id_tipo_cultivo: parseInt(formData.fk_id_tipo_cultivo),
        
    };
    mutation.mutate(newEspecie);
};


return (
    <div className="max-w-4xl mx-auto p-4">
        <Formulario fields={formFields} 
        onSubmit={handleSubmit} 
        isError={mutation.isError} 
        isSuccess={mutation.isSuccess}
        title="Crear Especie"  
       
        
        />
        
    </div>
    );
};

export default CrearEspecie;
