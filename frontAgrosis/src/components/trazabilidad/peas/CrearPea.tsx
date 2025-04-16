import { Pea, useCrearPea } from '../../../hooks/trazabilidad/pea/useCrearPea';
import Formulario from '../../globales/Formulario';
import { useNavigate } from "react-router-dom";

const CrearPea = () => {
    const mutation = useCrearPea();
    const navigate = useNavigate();

    const formFields = [
        { id: 'nombre_pea', label: 'Nombre del PEA', type: 'text' },
        { id: 'descripcion', label: 'Descripción', type: 'text' },
        { 
            id: 'tipo_pea', 
            label: 'Tipo de PEA', 
            type: 'select', 
            options: [
                { value: 'Plaga', label: 'Plaga' },
                { value: 'Enfermedad', label: 'Enfermedad' },
                { value: 'Arvense', label: 'Arvense' }
            ] 
        },
    ];
    

    const handleSubmit = (formData: { [key: string]: string }) => {
        const nuevoPea: Pea = {
            nombre_pea: formData.nombre_pea,
            descripcion: formData.descripcion,
            tipo_pea: formData.tipo_pea,
        };

        console.log("Enviando PEA al backend:", nuevoPea);
        
        mutation.mutate(nuevoPea, {
            onSuccess: () => {
                console.log("PEA creado exitosamente, redirigiendo a /pea...");
                navigate("/pea"); 
            },
            onError: (error) => {
                console.error("Error al crear PEA:", error);
            }
        });
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario 
                fields={formFields} 
                onSubmit={handleSubmit} 
                isError={mutation.isError} 
                isSuccess={mutation.isSuccess}
                title="Registrar Nuevo PEA"  
            />
        </div>
    );
};

export default CrearPea;
