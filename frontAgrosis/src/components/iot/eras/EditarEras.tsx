import { useState, useEffect } from "react";
import { useEditarEras } from "@/hooks/iot/eras/useEditarEras";
import { useEraPorId } from "@/hooks/iot/eras/useEraPorId";
import { useLotes } from "@/hooks/iot/lote/useLotes";
import Formulario from "../../globales/Formulario";

interface EditarErasProps {
    id: string;
    onSuccess?: () => void;
}

const EditarEras = ({ id, onSuccess }: EditarErasProps) => {
    const { data: eras, isLoading, error } = useEraPorId(id);
    const { data: lotes = [] } = useLotes();
    const actualizarEra = useEditarEras();
    
    const [formData, setFormData] = useState({
        fk_id_lote: "",
        descripcion: "",
        estado: "",
    });

    useEffect(() => {
        if (eras) {
            console.log("🔄 Datos de la Era recibidos:", eras);
            const fkIdLote = eras.fk_id_lote?.id ? eras.fk_id_lote.id.toString() : "";
            setFormData({
                fk_id_lote: fkIdLote,
                descripcion: eras.descripcion || "",
                estado: eras.estado ? "true" : "false",
            });
            console.log("📋 FormData actualizado:", {
                fk_id_lote: fkIdLote,
                descripcion: eras.descripcion || "",
                estado: eras.estado ? "true" : "false",
            });
        }
    }, [eras]);

    useEffect(() => {
        console.log("📦 Lotes disponibles:", lotes);
    }, [lotes]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        const eraActualizada = {
            id: Number(id),
            fk_id_lote: Number(data.fk_id_lote) || 0, 
            descripcion: data.descripcion.trim() || "",
            estado: data.estado === "true",
        };

        if (!eraActualizada.fk_id_lote || !eraActualizada.descripcion) {
            console.error("⚠️ Datos inválidos. No se enviará la actualización:", eraActualizada);
            return;
        }

        console.log("🚀 Enviando Era actualizada:", eraActualizada);

        actualizarEra.mutate(eraActualizada, {
            onSuccess: () => {
                console.log("✅ Era actualizada correctamente");
                if (onSuccess) onSuccess();
            },
            onError: (error: any) => {
                console.error("❌ Error al intentar actualizar la Era:", error);
                if (error.response?.status === 401) {
                    console.error("🔐 Error 401: No estás autorizado. Verifica tu token o permisos.");
                }
            },
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar la Era</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario 
                fields={[
                    {
                        id: "fk_id_lote",
                        label: "Lote",
                        type: "select",
                        options: lotes.map(lote => ({
                            value: lote.id.toString(),
                            label: lote.nombre_lote
                        }))
                    },
                    { id: "descripcion", label: "Descripción", type: "text" },
                    {
                        id: "estado",
                        label: "Estado",
                        type: "select",
                        options: [
                            { value: "true", label: "Activo" },
                            { value: "false", label: "Inactivo" }
                        ]
                    },
                ]}
                onSubmit={handleSubmit}  
                isError={actualizarEra.isError} 
                isSuccess={actualizarEra.isSuccess}
                title="Actualizar Era"
                initialValues={formData}  
                key={JSON.stringify(formData)}
            />
        </div>
    );
};

export default EditarEras;