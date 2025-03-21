import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useActualizarSemillero } from "../../hooks/trazabilidad/useActualizarSemillero";
import { useSemilleroPorId } from "../../hooks/trazabilidad/useSemilleroPorId";
import Formulario from "../globales/Formulario";

const ActualizarSemillero = () => {
    const { id } = useParams(); // Obtener ID del semillero desde la URL
    const { data: semillero, isLoading, error } = useSemilleroPorId(id); // Hook para obtener datos por ID
    const actualizarSemillero = useActualizarSemillero(); // Hook para actualizar
    const navigate = useNavigate();
    
    // Estado inicial del formulario
    const [formData, setFormData] = useState<{ [key: string]: string }>({
        nombre_semillero: "",
        fecha_siembra: "",
        fecha_estimada: "",
        cantidad: "",
    });

    useEffect(() => {
        if (semillero && Object.keys(semillero).length > 0) {
            console.log("🔄 Actualizando formulario con:", semillero);

            setFormData({
                nombre_semillero: semillero.nombre_semillero || "",
                fecha_siembra: semillero.fecha_siembra || "",
                fecha_estimada: semillero.fecha_estimada || "",
                cantidad: semillero.cantidad?.toString() || "", // Convertir a string para evitar errores
            });
        }
    }, [semillero]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        const semilleroActualizado = {
            id: Number(id), // Convertir ID a número
            nombre_semillero: data.nombre_semillero.trim() || "",
            fecha_siembra: data.fecha_siembra.trim() || "",
            fecha_estimada: data.fecha_estimada.trim() || "",
            cantidad: data.cantidad ? Number(data.cantidad) : 0, // Convertir a número o poner 0 si está vacío
        };

        console.log("🚀 Enviando datos al backend:", semilleroActualizado); // Verifica los datos enviados

        actualizarSemillero.mutate(semilleroActualizado, {
            onSuccess: () => {
                console.log("✅ Semillero actualizado correctamente");
                navigate("/semilleros"); // Redirigir tras el éxito
            },
            onError: (error) => {
                console.error("❌ Error al actualizar el semillero:", error);
            },
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar el semillero</div>;

    console.log("📌 Estado actual de formData:", formData);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario 
                fields={[
                    { id: 'nombre_semillero', label: 'Nombre del Semillero', type: 'text' },
                    { id: 'fecha_siembra', label: 'Fecha de Siembra', type: 'date' },
                    { id: 'fecha_estimada', label: 'Fecha Estimada', type: 'date' },
                    { id: 'cantidad', label: 'Cantidad', type: 'number' },
                ]} 
                onSubmit={handleSubmit} 
                isError={actualizarSemillero.isError} 
                isSuccess={actualizarSemillero.isSuccess}
                title="Actualizar Semillero"  
                initialValues={formData}  
                key={JSON.stringify(formData)} // Forzar re-render cuando cambien los datos
            />
        </div>
    );
};

export default ActualizarSemillero;
