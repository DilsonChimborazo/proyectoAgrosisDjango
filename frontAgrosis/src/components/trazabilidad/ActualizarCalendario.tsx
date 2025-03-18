import { useState, useEffect } from "react";
import { useActualizarCalendarioLunar } from "../../hooks/trazabilidad/useActualizarCalendario";
import { useNavigate, useParams } from "react-router-dom";
import { useCalendarioPorId } from "../../hooks/trazabilidad/useCalendarioPorId";
import Formulario from "../globales/Formulario";

const ActualizarCalendarioLunar = () => {
    const { id } = useParams(); // Obtener ID de la URL
    const { data: calendario, isLoading, error } = useCalendarioPorId(id); // Traer datos por ID
    const actualizarCalendarioLunar = useActualizarCalendarioLunar(); // Hook para actualizar
    const navigate = useNavigate();

    const [formData, setFormData] = useState<{ [key: string]: string }>({
        fecha: "",
        descripcion: "",
        evento: "",
    });

    useEffect(() => {
        if (calendario && Object.keys(calendario).length > 0) {
            console.log("🔄 Actualizando formulario con:", calendario);
            setFormData({
                fecha: calendario.fecha ?? "",
                descripcion: calendario.descripcion ?? "",
                evento: calendario.evento ?? "",
            });
        }
    }, [calendario]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        const calendarioActualizado = {
            id: Number(id),
            fecha: new Date(data.fecha).toISOString(),
            descripcion: data.descripcion || "",
            evento: data.evento || "",
        };

        console.log("🚀 Enviando datos al backend:", calendarioActualizado);

        actualizarCalendarioLunar.mutate(calendarioActualizado, {
            onSuccess: () => {
                console.log("✅ Calendario lunar actualizado correctamente");
                navigate("/calendario-lunar");
            },
            onError: (error) => {
                console.error("❌ Error al actualizar el calendario lunar:", error);
            },
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar los datos del calendario lunar</div>;

    console.log("📌 Estado actual de formData:", formData);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario
                fields={[
                    { id: "fecha", label: "Fecha", type: "date" },
                    { id: "descripcion", label: "Descripción", type: "text" },
                    { id: "evento", label: "Evento", type: "text" },
                ]}

                
                initialValues={formData} // Aquí se pasa initialValues
                onSubmit={handleSubmit}
                isError={actualizarCalendarioLunar.isError}
                isSuccess={actualizarCalendarioLunar.isSuccess}
                title="Actualizar Calendario Lunar"
                key={JSON.stringify(formData)} // 🔥 Fuerza re-render cuando los datos cambian
            />
        </div>
    );
};

export default ActualizarCalendarioLunar;
