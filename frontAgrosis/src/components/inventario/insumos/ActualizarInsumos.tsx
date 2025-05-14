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
        cantidad_insumo: "",
        fecha_vencimiento: "",
    });

    useEffect(() => {
        if (insumo) {
            setFormData({
                nombre: insumo.nombre || "",
                tipo: insumo.tipo || "",
                precio_unidad: insumo.precio_unidad?.toString() || "",
                cantidad_insumo: insumo.cantidad_insumo?.toString() || "",
                fecha_vencimiento: insumo.fecha_vencimiento || "",
            });
        }
    }, [insumo]);

    const handleSubmit = (data: { [key: string]: string | File }) => {
        if (!id) return;

        const insumoActualizado = {
            id: Number(id),
            nombre: (data.nombre as string).trim(),
            tipo: (data.tipo as string).trim(),
            precio_unidad: parseFloat(data.precio_unidad as string),
            cantidad_insumo:
                (insumo?.cantidad_insumo || 0) + parseFloat(data.cantidad_insumo as string),
            fk_unidad_medida: insumo?.fk_unidad_medida,
            fecha_vencimiento: data.fecha_vencimiento as string,
            img: data.img instanceof File ? data.img : null,
        };
        console.log('insumo actualizado', insumoActualizado);

        actualizarInsumo.mutate(insumoActualizado, {
            onSuccess: () => {
                if (onSuccess) {
                    onSuccess();
                } else {
                    navigate("/insumos");
                }
            },
        });
    };

    const handleFieldChange = (id: string, value: string | File) => {
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    if (isLoading) return <div className="text-blue-500">Cargando...</div>;
    if (error) return <div className="text-red-500">Error al cargar el insumo</div>;

    return (
        <div className="p-6">
            <Formulario
                title="Actualizar Insumo"
                fields={[
                    { id: "nombre", label: "Nombre", type: "text" },
                    { id: "tipo", label: "Tipo", type: "text" },
                    { id: "precio_unidad", label: "Precio por unidad", type: "number" },
                    { id: "cantidad_insumo", label: "cantidad_insumo", type: "number" },
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