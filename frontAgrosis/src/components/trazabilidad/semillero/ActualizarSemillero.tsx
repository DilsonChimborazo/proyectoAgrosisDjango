import { useState, useEffect } from "react";
import { useActualizarSemillero } from "../../../hooks/trazabilidad/useActualizarSemillero";
import { useNavigate, useParams } from "react-router-dom";
import { useSemilleroPorId } from "../../../hooks/trazabilidad/useSemilleroPorId";
import Formulario from "../../globales/Formulario";

const ActualizarSemillero = () => {
    const { id } = useParams(); // Obtener ID de la URL
    const { data: semillero, isLoading, error } = useSemilleroPorId(id); // Hook para traer los datos de un semillero por ID
    const actualizarSemillero = useActualizarSemillero(); // Hook para actualizar el semillero
    const navigate = useNavigate();

    const [formData, setFormData] = useState<{ [key: string]: string }>({
        nombre_semilla: "",
        fecha_siembra: "",
        fecha_estimada: "",
        cantidad: "",
    });

    useEffect(() => {
        if (semillero && Object.keys(semillero).length > 0) {
            console.log("🔄 Actualizando formulario con:", semillero);
            setFormData({
                nombre_semilla: semillero.nombre_semilla ?? "",
                fecha_siembra: semillero.fecha_siembra ?? "",
                fecha_estimada: semillero.fecha_estimada ?? "",
                cantidad: semillero.cantidad ? String(semillero.cantidad) : "",
            });
        }
    }, [semillero]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        const semilleroActualizado = {
            id: Number(id),
            nombre_semilla: data.nombre_semilla || "",
            fecha_siembra: data.fecha_siembra || "",
            fecha_estimada: data.fecha_estimada || "",
            cantidad: parseInt(data.cantidad) || 0,
        };

        console.log("🚀 Enviando datos al backend:", semilleroActualizado);

        actualizarSemillero.mutate(semilleroActualizado, {
            onSuccess: () => {
                console.log("✅ Semillero actualizado correctamente");
                navigate("/semilleros");
            },
            onError: (error) => {
                console.error("❌ Error al actualizar el semillero:", error);
            },
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar los datos del semillero</div>;

    console.log("📌 Estado actual de formData:", formData);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario
                fields={[
                    { id: "nombre_semilla", label: "Nombre de la Semilla", type: "text" },
                    { id: "fecha_siembra", label: "Fecha de Siembra", type: "date" },
                    { id: "fecha_estimada", label: "Fecha Estimada", type: "date" },
                    { id: "cantidad", label: "Cantidad", type: "number" },
                ]}
                initialValues={formData} // Pasa los valores iniciales al formulario
                onSubmit={handleSubmit}
                isError={actualizarSemillero.isError}
                isSuccess={actualizarSemillero.isSuccess}
                title="Actualizar Semillero"
                key={JSON.stringify(formData)} // Fuerza el re-render al cambiar los valores
            />
        </div>
    );
};

export default ActualizarSemillero;
