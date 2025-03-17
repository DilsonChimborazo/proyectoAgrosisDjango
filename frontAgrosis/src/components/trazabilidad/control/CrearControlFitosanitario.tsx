import { useCrearControlFitosanitario } from '../../../hooks/trazabilidad/control/useCrearControlFitosanitario';
import Formulario from '../../globales/Formulario';
import { useNavigate } from "react-router-dom";

const CrearControlFitosanitario = () => {
    const mutation = useCrearControlFitosanitario();
    const navigate = useNavigate();

    const formFields = [
        { id: 'fecha_control', label: 'Fecha de Control', type: 'date' },
        { id: 'descripcion', label: 'Descripción', type: 'text' },
        { id: 'fk_id_desarrollan', label: 'ID de Desarrollan', type: 'number' },
    ];

    const handleSubmit = (formData: { [key: string]: string }) => {
        if (!formData.fecha_control) {
            console.error("Error: La fecha es obligatoria.");
            return;
        }

        const fechaISO = new Date(formData.fecha_control).toISOString().split("T")[0];

        const nuevoControl = {
            fecha_control: fechaISO,
            descripcion: formData.descripcion,
            fk_id_desarrollan: parseInt(formData.fk_id_desarrollan) || 0,
        };

        console.log("Enviando Control Fitosanitario al backend:", nuevoControl);
        
        mutation.mutate(nuevoControl, {
            onSuccess: () => {
                console.log("Control Fitosanitario creado exitosamente, redirigiendo...");
                navigate("/control-fitosanitario"); 
            },
            onError: (error) => {
                console.error("Error al crear Control Fitosanitario:", error);
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
                title="Registrar Control Fitosanitario"  
            />
        </div>
    );
};

export default CrearControlFitosanitario;
