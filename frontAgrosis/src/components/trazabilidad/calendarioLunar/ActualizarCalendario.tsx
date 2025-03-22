import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useActualizarCalendarioLunar } from "../../../hooks/trazabilidad/calendarioLunar/useActualizarCalendario";
import { useCalendarioPorId } from "../../../hooks/trazabilidad/calendarioLunar/useCalendarioPorId";
import Formulario from "../../globales/Formulario";



const ActualizarCalendarioLunar = () => {

    const { id } = useParams(); // Obtener ID de la URL
    const { data: calendario, isLoading, error } = useCalendarioPorId(id); // Hook para obtener datos por ID
    const actualizarCalendario = useActualizarCalendarioLunar(); // Hook para actualizar
    const navigate = useNavigate();
    
    // Estado inicial del formulario
    const [formData, setFormData] = useState<{ [key: string]: string }>({
        fecha: "",
        descripcion_evento: "",
        evento: "",
    });

    useEffect(() => {
        if (calendario && Object.keys(calendario).length > 0) {
            console.log("🔄 Actualizando formulario con:", calendario);
            
            setFormData({
                fecha: calendario.fecha || "",
                descripcion_evento: calendario.descripcion_evento || "",
                evento: calendario.evento || "",
            });
        }
    }, [calendario]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        const calendarioActualizado = {
            id: Number(id), // Convertir ID a número
            fecha: data.fecha || "",
            descripcion_evento: data.descripcion_evento || "",
            evento: data.evento || "",
        };

        console.log("🚀 Enviando datos al backend:", calendarioActualizado); // Verifica los datos enviados

        actualizarCalendario.mutate(calendarioActualizado, {
            onSuccess: () => {
                console.log("✅ Calendario lunar actualizado correctamente");
                navigate("/calendario-lunar"); // Redirigir tras el éxito
            },
            onError: (error) => {
                console.error("❌ Error al actualizar el calendario lunar:", error);
            },
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar el calendario lunar</div>;

    console.log("📌 Estado actual de formData:", formData);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario 
                fields={[
                    { id: 'fecha', label: 'Fecha', type: 'date' },
                    { id: 'descripcion_evento', label: 'Descripción del Evento', type: 'text' },
                    { id: 'evento', label: 'Evento', type: 'text' },
                ]} 
                onSubmit={handleSubmit} 
                isError={actualizarCalendario.isError} 
                isSuccess={actualizarCalendario.isSuccess}
                title="Actualizar Calendario Lunar"  
                initialValues={formData}  
                key={JSON.stringify(formData)} // Forzar re-render cuando cambien los datos
            />
        </div>
    );
};

export default ActualizarCalendarioLunar;
