import { useState, useEffect } from "react";
import { useEditarEras } from "@/hooks/iot/eras/useEditarEras";
import { useNavigate, useParams } from "react-router-dom";
import { useEraPorId } from "@/hooks/iot/eras/useEraPorId";
import Formulario from "../../globales/Formulario";

const EditarEras = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    if (!id) {
        console.error("❌ Error: ID no válido");
        return <div className="text-red-500">Error: ID no válido</div>;
    }

    const { data: eras, isLoading, error } = useEraPorId(id);
    const actualizarEra = useEditarEras();
    
    const [formData, setFormData] = useState({
        fk_id_lote: "",
        descripcion: "",
    });

    useEffect(() => {
        if (eras) {
            console.log("🔄 Cargando datos de la Era:", eras);
            setFormData({
                fk_id_lote: eras.fk_id_lote ? eras.fk_id_lote.toString() : "",
                descripcion: eras.descripcion || "",
            });
        }
    }, [eras]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        const eraActualizada = {
            id: Number(id),
            fk_id_lote: Number(data.fk_id_lote) || 0, 
            descripcion: data.descripcion.trim() || "",
        };

        if (!eraActualizada.fk_id_lote || !eraActualizada.descripcion) {
            console.error("⚠️ Datos inválidos. No se enviará la actualización.");
            return;
        }

        console.log("🚀 Enviando Era actualizada:", eraActualizada);

        actualizarEra.mutate(eraActualizada, {
            onSuccess: () => {
                console.log("✅ Era actualizada correctamente");
                navigate("/eras");
            },
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar la Era</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario 
                fields={[
                    { id: "fk_id_lote", label: "Lote", type: "number" },
                    { id: "descripcion", label: "Descripción", type: "text" },
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
