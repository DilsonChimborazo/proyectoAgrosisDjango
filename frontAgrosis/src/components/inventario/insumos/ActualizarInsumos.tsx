import { useState, useEffect } from "react";
import { useActualizarInsumos } from "../../../hooks/inventario/insumos/useActualizarInsumos";
import { useInsumoPorId } from "../../../hooks/inventario/insumos/useInsumoPorId";
import Formulario from "../../globales/Formulario";
import { useNavigate, useParams } from "react-router-dom";

const ActualizarInsumos = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: insumo, isLoading, error } = useInsumoPorId(id!);
    const actualizarInsumo = useActualizarInsumos();

    const [formData, setFormData] = useState({
        nombre: "",
        tipo: "",
        precio_unidad: "",
        cantidad: "",
        fecha_vencimiento: "",
    });

    useEffect(() => {
        if (insumo) {
            setFormData({
                nombre: insumo.nombre || "",
                tipo: insumo.tipo || "",
                precio_unidad: insumo.precio_unidad?.toString() || "",
                cantidad: insumo.cantidad?.toString() || "",
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
            cantidad: parseFloat(data.cantidad as string),
            fk_unidad_medida: insumo?.fk_unidad_medida, // conservamos la unidad existente
            fecha_vencimiento: data.fecha_vencimiento as string,
            img: data.img instanceof File ? data.img : null,
        };

        actualizarInsumo.mutate(insumoActualizado, {
            onSuccess: () => {
                navigate("/insumos");
            },
        });
    };

    const handleFieldChange = (id: string, value: string | File) => {
        setFormData(prev => ({
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
                    { id: "cantidad", label: "Cantidad", type: "number" },
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
