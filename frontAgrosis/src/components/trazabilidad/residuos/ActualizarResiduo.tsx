import { useState, useEffect } from "react";
import { useActualizarResiduo } from "../../../hooks/trazabilidad/residuo/useActualizarResiduo";
import { useNavigate, useParams } from "react-router-dom";
import { useResiduoPorId } from "../../../hooks/trazabilidad/residuo/useResiduoPorId";
import Formulario from "../../globales/Formulario";

const ActualizarResiduo = () => {
    const { id } = useParams();
    const { data: residuo, isLoading, error } = useResiduoPorId(id);
    const actualizarResiduo = useActualizarResiduo();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState<{ [key: string]: string }>({
        nombre_residuo: "",
        fecha: "",
        descripcion: "",
        fk_id_cultivo: "",
        fk_id_tipo_residuo: "",
    });

    useEffect(() => {
        if (residuo && Object.keys(residuo).length > 0) {
            console.log("🔄 Cargando datos del Residuo:", residuo);
            
            setFormData({
                nombre_residuo: residuo.nombre_residuo ?? "",
                fecha: residuo.fecha ?? "",
                descripcion: residuo.descripcion ?? "",
                fk_id_cultivo: residuo.fk_id_cultivo ? residuo.fk_id_cultivo.id.toString() : "",
                fk_id_tipo_residuo: residuo.fk_id_tipo_residuo ? residuo.fk_id_tipo_residuo.id.toString() : "",
            });
        }
    }, [residuo]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        const residuoActualizado = {
            id: Number(id),
            nombre_residuo: data.nombre_residuo || "",
            fecha: data.fecha || "",
            descripcion: data.descripcion || "",
            fk_id_cultivo: data.fk_id_cultivo ? Number(data.fk_id_cultivo) : null,
            fk_id_tipo_residuo: data.fk_id_tipo_residuo ? Number(data.fk_id_tipo_residuo) : null,
        };

        console.log("🚀 Enviando Residuo actualizado:", residuoActualizado);

        actualizarResiduo.mutate(residuoActualizado, {
            onSuccess: () => {
                console.log("✅ Residuo actualizado correctamente");
                navigate("/residuos");
            },
            onError: (error) => {
                console.error("❌ Error al actualizar Residuo:", error);
            },
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar el Residuo</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario 
                fields={[
                    { id: 'nombre_residuo', label: 'Nombre del Residuo', type: 'text' },
                    { id: 'fecha', label: 'Fecha', type: 'date' },
                    { id: 'descripcion', label: 'Descripción', type: 'text' },
                    { id: 'fk_id_cultivo', label: 'Cultivo Asociado', type: 'number' },
                    { id: 'fk_id_tipo_residuo', label: 'Tipo de Residuo', type: 'number' },
                ]}
                onSubmit={handleSubmit}  
                isError={actualizarResiduo.isError} 
                isSuccess={actualizarResiduo.isSuccess}
                title="Actualizar Residuo"
                initialValues={formData}  
                key={JSON.stringify(formData)}
            />
        </div>
    );
};

export default ActualizarResiduo;
