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
        cantidad: "",
    });

    // Actualizar el estado del formulario cuando los datos de la herramienta se carguen
    useEffect(() => {
        if (herramienta) {
            setFormData({
                nombre_h: herramienta.nombre_h || "",
                estado: herramienta.estado || "",
                cantidad: herramienta.cantidad?.toString() || "0",
            });
        }
    }, [herramienta]);

    // Función para manejar el envío del formulario
    const handleSubmit = (data: { [key: string]: string }) => {
        const herramientaActualizada = {
            id,  // Usamos el 'id' proporcionado en las props
            nombre_h: data.nombre_h.trim(),
            estado: data.estado.trim(),
            cantidad: parseInt(data.cantidad, 10),
        };

        // Validación de los datos antes de enviar
        if (
            !herramientaActualizada.nombre_h ||
            !herramientaActualizada.estado ||
            isNaN(herramientaActualizada.cantidad)
        ) {
            console.error("⚠️ Datos inválidos. No se enviará la actualización.");
            return;
        }

        // Llamar a la mutación para actualizar la herramienta
        actualizarHerramienta.mutate(herramientaActualizada, {
            onSuccess: () => {
                console.log("✅ Herramienta actualizada correctamente");
                onSuccess();  // Llamar al callback de éxito para cerrar el modal
            },
            onError: (error) => {
                console.error("❌ Error al actualizar la herramienta", error);
            }
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
                            { value: "En_reparacion", label: "En reparación" },
                        ],
                    },
                    { id: "cantidad", label: "Cantidad", type: "number" },
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
