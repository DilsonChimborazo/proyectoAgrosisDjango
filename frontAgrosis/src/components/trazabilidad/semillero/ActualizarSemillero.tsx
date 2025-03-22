import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useActualizarSemillero } from "@/hooks/trazabilidad/semillero/useActualizarSemillero";
import { useSemilleroPorId } from "@/hooks/trazabilidad/semillero/useSemilleroPorId";
import Formulario from "../../globales/Formulario";


const ActualizarSemillero = () => {
    const { id } = useParams(); // Obtener el ID desde la URL
    const { data: semillero, isLoading, error } = useSemilleroPorId(id); // Hook para obtener el semillero por ID
    const actualizarSemillero = useActualizarSemillero(); // Hook para actualizar el semillero
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
            console.log("🔄 Cargando datos del semillero:", semillero);

            setFormData({
                nombre_semillero: semillero.nombre_semillero || "",
                fecha_siembra: semillero.fecha_siembra || "",
                fecha_estimada: semillero.fecha_estimada || "",
                cantidad: semillero.cantidad?.toString() || "", // Convertir número a string para el formulario
            });
        }
    }, [semillero]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) {
            console.error("❌ ID no válido");
            return;
        }

        const semilleroActualizado = {
            id: Number(id), // Convertir el ID a número
            nombre_semillero: data.nombre_semillero.trim(),
            fecha_siembra: data.fecha_siembra.trim(),
            fecha_estimada: data.fecha_estimada.trim(),
            cantidad: data.cantidad ? Number(data.cantidad) : 0, // Convertir la cantidad a número o 0
        };

        console.log("🚀 Enviando datos para actualizar semillero:", semilleroActualizado);

        actualizarSemillero.mutate(semilleroActualizado, {
            onSuccess: () => {
                console.log("✅ Semillero actualizado correctamente");
                navigate("/semilleros"); // Redirigir a la lista de semilleros tras el éxito
            },
        })}

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar el semillero</div>;

    console.log("📌 Estado actual del formulario:", formData);

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
                key={JSON.stringify(formData)} // Forzar re-render si cambian los datos
            />
        </div>
    );
};

export default ActualizarSemillero;
