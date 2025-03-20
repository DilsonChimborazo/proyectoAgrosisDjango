import { useState } from "react";
import { useActualizarInsumo } from "../../../hooks/inventario/insumos/useActualizarInsumos";
import { useInsumo } from "../../../hooks/inventario/insumos/useInsumo";
import Formulario from "../../globales/Formulario";

const ActualizarInsumo = () => {
    const { data: insumos, isLoading, error } = useInsumo();
    const mutation = useActualizarInsumo();
    const [selectedInsumo, setSelectedInsumo] = useState<any | null>(null);

    if (isLoading) return <div>Cargando insumos...</div>;
    if (error instanceof Error) return <div>Error al cargar los insumos: {error.message}</div>;

    const formFields = [
        { id: "nombre", label: "Nombre", type: "text" },
        { id: "tipo", label: "Tipo", type: "text" },
        { id: "precio_unidad", label: "Precio por Unidad", type: "number" },
        { id: "cantidad", label: "Cantidad", type: "number" },
        { id: "unidad_medida", label: "Unidad de Medida", type: "text" },
    ];

    const handleSubmit = (formData: { [key: string]: string }) => {
        if (!selectedInsumo) return;

        const updatedInsumo = {
            ...selectedInsumo,
            ...formData,
            precio_unidad: parseFloat(formData.precio_unidad),
            cantidad: parseInt(formData.cantidad, 10),
        };

        mutation.mutate(updatedInsumo);
    };

    return (
        <div className="p-10">
            <select
                className="border p-2 mb-4 w-full"
                onChange={(e) => {
                    const insumo = insumos?.find((i: any) => i.id_insumo === Number(e.target.value));
                    setSelectedInsumo(insumo || null);
                }}
            >
                <option value="">Selecciona un insumo</option>
                {insumos?.map((i: any) => (
                    <option key={i.id_insumo} value={i.id_insumo}>
                        {i.nombre}
                    </option>
                ))}
            </select>

            {selectedInsumo && (
                <Formulario
                    fields={formFields}
                    onSubmit={handleSubmit}
                    isError={mutation.isError}
                    isSuccess={mutation.isSuccess}
                    title="Actualizar Insumo"
                    initialValues={selectedInsumo}
                />
            )}
        </div>
    );
};

export default ActualizarInsumo;