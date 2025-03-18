import { useCrearResiduo } from '../../../hooks/trazabilidad/residuo/useCrearResiduo';
import Formulario from '../../globales/Formulario';
import { useNavigate } from "react-router-dom";

const CrearResiduo = () => {
    const mutation = useCrearResiduo();
    const navigate = useNavigate();

    const formFields = [
        { id: 'nombre_residuo', label: 'Nombre del Residuo', type: 'text' },
        { id: 'fecha', label: 'Fecha', type: 'date' },
        { id: 'descripcion', label: 'Descripción', type: 'text' },
        { id: 'fk_id_cultivo', label: 'ID de Cultivo', type: 'number' },
        { id: 'fk_id_tipo_residuo', label: 'ID de Tipo de Residuo', type: 'number' },
    ];

    const handleSubmit = (formData: { [key: string]: string }) => {
        if (!formData.fecha) {
            console.error("Error: La fecha es obligatoria.");
            return;
        }

        const fechaISO = new Date(formData.fecha).toISOString().split("T")[0];

        const nuevoResiduo = {
            nombre_residuo: formData.nombre_residuo,
            fecha: fechaISO,
            descripcion: formData.descripcion,
            fk_id_cultivo: parseInt(formData.fk_id_cultivo) || 0,
            fk_id_tipo_residuo: parseInt(formData.fk_id_tipo_residuo) || 0,
        };

        console.log("Enviando residuo al backend:", nuevoResiduo);
        
        mutation.mutate(nuevoResiduo, {
            onSuccess: () => {
                console.log("Residuo creado exitosamente, redirigiendo a /residuos...");
                navigate("/residuos"); 
            },
            onError: (error) => {
                console.error("Error al crear residuo:", error);
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
                title="Registrar Nuevo Residuo"  
            />
        </div>
    );
};

export default CrearResiduo;
