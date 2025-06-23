import { useState, useEffect } from "react";
import { useActualizarInsumos } from "../../../hooks/inventario/insumos/useActualizarInsumos";
import { useInsumoPorId } from "../../../hooks/inventario/insumos/useInsumoPorId";
import Formulario from "../../globales/Formulario";
import { useNavigate } from "react-router-dom";

interface ActualizarInsumosProps {
    id: string;
    onSuccess?: () => void;
}

const ActualizarInsumos = ({ id, onSuccess }: ActualizarInsumosProps) => {
    const navigate = useNavigate();
    const { data: insumo, isLoading, error } = useInsumoPorId(id);
    const actualizarInsumo = useActualizarInsumos();

    const [formData, setFormData] = useState({
        nombre: "",
        tipo: "",
        precio_unidad: "",
        cantidad_a_sumar: "0",
        fecha_vencimiento: "",
    });

    const [unidadMedida, setUnidadMedida] = useState("");

    useEffect(() => {
        if (insumo) {
            setFormData({
                nombre: insumo.nombre || "",
                tipo: insumo.tipo || "",
                precio_unidad: insumo.precio_unidad?.toString() || "",
                cantidad_a_sumar: "0",
                fecha_vencimiento: insumo.fecha_vencimiento || "",
            });

            setUnidadMedida(insumo.fk_unidad_medida?.nombre_medida || "");
        }
    }, [insumo]);

    const handleSubmit = (data: { [key: string]: string | File | string[] }) => {
        if (!id || !insumo) return;

        // Procesar los datos para convertir string[] a string
        const processedData: { [key: string]: string | File } = {};
        for (const key in data) {
            if (Array.isArray(data[key])) {
                processedData[key] = (data[key] as string[]).join(","); // Convierte string[] a string
            } else {
                processedData[key] = data[key] as string | File;
            }
        }

        const cantidadASumar = parseFloat(processedData.cantidad_a_sumar as string) || 0;
        const nuevaCantidad = insumo.cantidad_insumo + cantidadASumar;

        const insumoActualizado = {
            id: Number(id),
            nombre: (processedData.nombre as string).trim(),
            tipo: (processedData.tipo as string).trim(),
            precio_unidad: parseFloat(processedData.precio_unidad as string),
            cantidad_insumo: nuevaCantidad,
            cantidad_a_sumar: cantidadASumar,
            fk_unidad_medida: insumo.fk_unidad_medida,
            fecha_vencimiento: processedData.fecha_vencimiento as string,
            img: processedData.img instanceof File ? processedData.img : null,
        };

        actualizarInsumo.mutate(insumoActualizado, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
                else navigate("/insumos");
            },
        });
    };

    const handleFieldChange = (id: string, value: string | string[]) => {
        const processedValue = Array.isArray(value) ? value.join(",") : value;
        setFormData((prev) => ({
            ...prev,
            [id]: processedValue,
        }));
    };

    if (isLoading) return <div className="text-blue-500">Cargando...</div>;
    if (error) return <div className="text-red-500">Error al cargar el insumo</div>;

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Actualizar Insumo</h2>

            {unidadMedida && (
                <div className="ms-6 text-sm text-gray-600">
                    Debe ingresar la cantidad en la unidad de medida principal{" "}
                    <span className="font-bold text-large text-red-600">{unidadMedida}</span>
                </div>
            )}

            <Formulario
                title=""
                fields={[
                    { id: "nombre", label: "Nombre", type: "text" },
                    { id: "tipo", label: "Tipo", type: "text" },
                    { id: "precio_unidad", label: "Precio por unidad", type: "number" },
                    { id: "cantidad_a_sumar", label: "Cantidad a sumar", type: "number" },
                    { id: "fecha_vencimiento", label: "Fecha de Vencimiento", type: "date" },
                ]}
                onSubmit={handleSubmit}
                initialValues={formData}
                onFieldChange={handleFieldChange}
                isError={actualizarInsumo.isError}
                isSuccess={actualizarInsumo.isSuccess}
            />
        </div>
    );
};

export default ActualizarInsumos;