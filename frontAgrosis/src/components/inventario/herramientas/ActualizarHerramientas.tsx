import { useState, useEffect } from "react";
import { useActualizarHerramientas } from "../../../hooks/inventario/herramientas/useActualizarHerramientas";
import { useHerramientaPorId } from "../../../hooks/inventario/herramientas/useHerramientaPorId";
import Formulario from "../../globales/Formulario";

interface Props {
    id: number;
    onSuccess: () => void;
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
        movimiento: "entrada", // Valor predeterminado
    });

    // Actualizar el estado del formulario cuando los datos de la herramienta se carguen
    useEffect(() => {
        if (herramienta) {
            setFormData({
                nombre_h: herramienta.nombre_h || "",
                estado: herramienta.estado || "",
                cantidad_herramienta: "", // Dejar vacío para que el usuario ingrese la cantidad
                movimiento: "entrada", // Valor predeterminado
            });
        }
    }, [herramienta]);

    // Función para manejar el envío del formulario
    const handleSubmit = (data: { [key: string]: string | File }) => {
        const nuevaCantidad = parseInt(data.cantidad_herramienta as string);
        const movimiento = (data.movimiento as string).trim();

        // Validar los datos
        if (isNaN(nuevaCantidad) || nuevaCantidad < 0) {
            console.error("⚠️ La cantidad ingresada no es válida o es negativa.");
            return;
        }
        if (!["entrada", "salida"].includes(movimiento)) {
            console.error("⚠️ Tipo de movimiento no válido.");
            return;
        }
        if (!(data.nombre_h as string).trim() || !(data.estado as string).trim()) {
            console.error("⚠️ Datos inválidos. No se enviará la actualización.");
            return;
        }

        const herramientaActualizada = {
            id,
            nombre_h: (data.nombre_h as string).trim(),
            estado: (data.estado as string).trim() as "Disponible" | "Prestado" | "En reparacion",
            cantidad_herramienta: nuevaCantidad, // Enviar la cantidad ingresada directamente
            movimiento, // Enviar el tipo de movimiento
        };

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
                    {
                        id: "movimiento",
                        label: "Tipo de movimiento",
                        type: "select",
                        options: [
                            { value: "entrada", label: "Entrada" },
                            { value: "salida", label: "Salida" },
                        ],
                    },
                    {
                        id: "cantidad_herramienta",
                        label: "Cantidad",
                        type: "number",
                    },
                ]}
                onSubmit={handleSubmit}
                initialValues={formData}
                isError={actualizarHerramienta.isError}
                isSuccess={actualizarHerramienta.isSuccess}
                title="Actualizar Herramienta"
                key={JSON.stringify(formData)}
            />
        </div>
    );
};

export default ActualizarHerramienta;