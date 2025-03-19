import { useState, useEffect } from "react";
import { useEditarLote } from "@/hooks/iot/lote/useEditarLote";
import { useNavigate, useParams } from "react-router-dom";
import { useLotePorId } from "@/hooks/iot/lote/useLotePorId"; 
import Formulario from "../../globales/Formulario";

const EditarLote = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    if (!id) {
        console.error("❌ Error: ID no válido");
        return <div className="text-red-500">Error: ID no válido</div>;
    }

    const { data: lote, isLoading, error } = useLotePorId(id);
    const actualizarLote = useEditarLote();
    
    const [formData, setFormData] = useState({
        fk_id_ubicacion: "",
        dimencion: "",
        nombre_lote: "",
        estado: "",
    });

    useEffect(() => {
        if (lote) {
            console.log("🔄 Cargando datos del Lote:", lote);
            setFormData({
                fk_id_ubicacion: lote.fk_id_ubicacion ? lote.fk_id_ubicacion.toString() : "",
                dimencion: lote.dimencion ? lote.dimencion.toString() : "",
                nombre_lote: lote.nombre_lote || "",
                estado: lote.estado || "",
            });
        }
    }, [lote]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        const loteActualizado = {
            id: Number(id),
            fk_id_ubicacion: Number(data.fk_id_ubicacion) || 0, 
            dimencion: Number(data.dimencion) || 0,
            nombre_lote: data.nombre_lote.trim() || "",
            estado: data.estado.trim() || "",
        };

        if (!loteActualizado.fk_id_ubicacion || !loteActualizado.dimencion || !loteActualizado.nombre_lote || !loteActualizado.estado) {
            console.error("⚠️ Datos inválidos. No se enviará la actualización.");
            return;
        }

        console.log("🚀 Enviando Lote actualizado:", loteActualizado);

        actualizarLote.mutate(loteActualizado, {
            onSuccess: () => {
                console.log("✅ Lote actualizado correctamente");
                navigate("/lotes");
            },
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar el Lote</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario 
                fields={[
                    { id: "fk_id_ubicacion", label: "Ubicación", type: "number" },
                    { id: "dimencion", label: "Dimensión", type: "number" },
                    { id: "nombre_lote", label: "Nombre del Lote", type: "text" },
                    { id: "estado", label: "Estado", type: "text" },
                ]}
                onSubmit={handleSubmit}  
                isError={actualizarLote.isError} 
                isSuccess={actualizarLote.isSuccess}
                title="Actualizar Lote"
                initialValues={formData}  
                key={JSON.stringify(formData)}
            />
        </div>
    );
};

export default EditarLote;
