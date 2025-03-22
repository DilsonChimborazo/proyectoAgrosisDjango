
import { CalendarioLunar } from '../../../hooks/trazabilidad/calendarioLunar/useCrearCalendarioLunar';
import { useCrearCalendarioLunar } from '../../../hooks/trazabilidad//calendarioLunar/useCrearCalendarioLunar';
import Formulario from '../../globales/Formulario';
import { useNavigate } from "react-router-dom";


const CrearCalendarioLunar = () => {
    const mutation = useCrearCalendarioLunar(); // Hook para manejar la mutación de creación
    const navigate = useNavigate();


    // Definición de los campos del formulario
    const formFields = [
        { id: 'fecha', label: 'Fecha', type: 'date' },
        { id: 'descripcion_evento', label: 'Descripción del Evento', type: 'text' },
        { id: 'evento', label: 'Evento', type: 'text' },
    ];

    // Manejo del envío del formulario
    const handleSubmit = (formData: { [key: string]: string }) => {
        if (!formData.fecha) {
            console.error("Error: La fecha es obligatoria.");
            return;
        }

        const fechaISO = new Date(formData.fecha).toISOString().split("T")[0];

        const nuevoCalendarioLunar: CalendarioLunar = {
            fecha: fechaISO,
            descripcion_evento: formData.descripcion_evento,
            evento: formData.evento,
        };

        console.log("Enviando calendario lunar al backend:", nuevoCalendarioLunar);

        // Mutación para crear un nuevo calendario lunar
        mutation.mutate(nuevoCalendarioLunar, {
            onSuccess: () => {
                console.log("Calendario lunar creado exitosamente, redirigiendo a /calendario-lunar...");
                navigate("/calendario-lunar"); // Redirige al listado de calendarios lunares
            },
            onError: (error) => {
                console.error("Error al crear calendario lunar:", error);
            },
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario 
                fields={formFields} // Campos del formulario
                onSubmit={handleSubmit} // Función de envío
                isError={mutation.isError} // Manejo de errores
                isSuccess={mutation.isSuccess} // Indicador de éxito
                title="Registra Nuevo Calendario Lunar" // Título del formulario
            />
        </div>
    );
};

export default CrearCalendarioLunar;
