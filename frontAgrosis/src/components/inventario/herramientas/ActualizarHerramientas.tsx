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
        precio: ""
    });

    // Actualizar el estado del formulario cuando los datos de la herramienta se carguen
    useEffect(() => {
        if (herramienta) {
            setFormData({
                nombre_h: herramienta.nombre_h || "",
                estado: herramienta.estado || "",
                cantidad_herramienta: "",
                movimiento: "entrada",
                precio: herramienta.precio ? herramienta.precio.toString() : "",
            });
        }
    }, [herramienta]);

    const handleSubmit = (data: { [key: string]: string | string[] | File }) => {
        // Procesar los datos para convertir string[] a string
        const processedData: { [key: string]: string | File } = {};
        for (const key in data) {
            if (Array.isArray(data[key])) {
                processedData[key] = (data[key] as string[]).join(","); // Convierte string[] a string
            } else {
                processedData[key] = data[key] as string | File;
            }
        }

        const nuevaCantidad = parseInt(processedData.cantidad_herramienta as string);
        const movimiento = (processedData.movimiento as string).trim();
        const precio = parseFloat(processedData.precio as string);
        const nombre_h = (processedData.nombre_h as string).trim();
        const estado = (processedData.estado as string).trim() as "Disponible" | "Prestado" | "En reparacion";

        // Validar los datos
        if (isNaN(nuevaCantidad) || nuevaCantidad < 0) {
            console.error("⚠️ La cantidad ingresada no es válida o es negativa.");
            return;
        }
        if (!["entrada", "salida"].includes(movimiento)) {
            console.error("⚠️ Tipo de movimiento no válido.");
            return;
        }
        if (!nombre_h || !estado) {
            console.error("⚠️ Datos inválidos. No se enviará la actualización.");
            return;
        }
        if (isNaN(precio) || precio < 0) {
            console.error("⚠️ El precio ingresado no es válido o es negativo.");
            return;
        }

        const herramientaActualizada = {
            id,
            nombre_h,
            estado,
            cantidad_herramienta: nuevaCantidad,
            movimiento,
            precio,
        };

        actualizarHerramienta.mutate(herramientaActualizada, {
            onSuccess: () => {
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
                    {
                        id: "precio",
                        label: "Precio",
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