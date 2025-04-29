import { useState, useEffect } from "react";
import { useActualizarHerramientas } from "../../../hooks/inventario/herramientas/useActualizarHerramientas";
import { useHerramientaPorId } from "../../../hooks/inventario/herramientas/useHerramientaPorId";
import Formulario from "../../globales/Formulario";

interface Props {
    id: number;  // ID de la herramienta que se actualizará
    onSuccess: () => void;  // Callback que se ejecuta después de una actualización exitosa
}

const ActualizarHerramienta: React.FC<Props> = ({ id, onSuccess }) => {
    const stringId = String(id);
    const { data: herramienta, isLoading, error } = useHerramientaPorId(stringId);
    const actualizarHerramienta = useActualizarHerramientas();

    // Estado local para los datos del formulario
    const [formData, setFormData] = useState({
        nombre_h: "",
        estado: "",
        cantidad_herramienta: "",
    });

    // Actualizar el estado del formulario cuando los datos de la herramienta se carguen
    useEffect(() => {
        if (herramienta) {
            setFormData({
                nombre_h: herramienta.nombre_h || "",
                estado: herramienta.estado || "",
                cantidad_herramienta: herramienta.cantidad_herramienta?.toString() || "0",
            });
        }
    }, [herramienta]);

    // Función para manejar el envío del formulario
    const handleSubmit = (data: { [key: string]: string | File }) => {
        console.log("📦 Datos recibidos del formulario:", data);
    
        const herramientaActualizada = {
            id,
            nombre_h: (data.nombre_h as string).trim(),
            estado: (data.estado as string).trim() as "Disponible" | "Prestado" | "En reparacion",
            cantidad_herramienta: parseInt(data.cantidad_herramienta as string, 10),
        };
    
        if (
            !herramientaActualizada.nombre_h ||
            !herramientaActualizada.estado ||
            isNaN(herramientaActualizada.cantidad_herramienta)
        ) {
            console.error("⚠️ Datos inválidos. No se enviará la actualización.");
            return;
        }
    
        actualizarHerramienta.mutate(herramientaActualizada, {
            onSuccess: () => {
                console.log("✅ Herramienta actualizada correctamente");
                onSuccess();
            },
            onError: (error) => {
                console.error("❌ Error al actualizar la herramienta", error);
            },
        });
    };
    

    // Manejo de estado de carga y error
    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar la herramienta</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Componente del formulario para actualizar la herramienta */}
            <Formulario
                fields={[
                    { id: "nombre_h", label: "Nombre", type: "text" },
                    {
                        id: "estado",
                        label: "Estado",
                        type: "select",
                        options: [
                            { value: "Disponible", label: "Disponible" },
                            { value: "Prestado", label: "Prestado" },
                            { value: "En reparacion", label: "En reparación" },
                        ],
                    },
                    { id: "cantidad_herramienta", label: "Cantidad", type: "number" },
                ]}
                onSubmit={handleSubmit}  // Función para manejar el envío del formulario
                initialValues={formData}  // Valores iniciales del formulario
                isError={actualizarHerramienta.isError}  // Indica si ocurrió un error en la mutación
                isSuccess={actualizarHerramienta.isSuccess}  // Indica si la mutación fue exitosa
                title="Actualizar Herramienta"  // Título del formulario
                key={JSON.stringify(formData)}  // Clave única para evitar problemas de cacheo
            />
        </div>
    );
};

export default ActualizarHerramienta;
