import { useState, useEffect } from "react";
import { useActualizarPea } from "../../../hooks/trazabilidad/pea/useActualizarPea";
import { useNavigate, useParams } from "react-router-dom";
import { usePeaPorId } from "../../../hooks/trazabilidad/pea/usePeaPorId";
import Formulario from "../../globales/Formulario";

const ActualizarPea = () => {
    const { id } = useParams();
    const { data: pea, isLoading, error } = usePeaPorId(id);
    const actualizarPea = useActualizarPea();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState<{ [key: string]: string }>({
        nombre_pea: "",
        descripcion: "",
    });

    useEffect(() => {
        if (pea && Object.keys(pea).length > 0) {
            console.log("🔄 Cargando datos de la Pea:", pea);
            
            setFormData({
                nombre_pea: pea.nombre_pea ?? "",
                descripcion: pea.descripcion ?? "",
            });
        }
    }, [pea]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        const peaActualizada = {
            id: Number(id),
            nombre_pea: data.nombre_pea || "",
            descripcion: data.descripcion || "",
        };

        console.log("🚀 Enviando Pea actualizada al backend:", peaActualizada);

        actualizarPea.mutate(peaActualizada, {
            onSuccess: () => {
                console.log("✅ Pea actualizada correctamente");
                navigate("/pea");
            },
            onError: (error) => {
                console.error("❌ Error al actualizar Pea:", error);
            },
        });
    };
    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar la Pea</div>;
    
    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario 
                fields={[
                    { id: 'nombre_pea', label: 'Nombre de la Pea', type: 'text' },
                    { id: 'descripcion', label: 'Descripción', type: 'text' },
                ]}
                onSubmit={handleSubmit}  
                isError={actualizarPea.isError} 
                isSuccess={actualizarPea.isSuccess}
                title="Actualizar Pea"
                initialValues={formData}  
                key={JSON.stringify(formData)}
            />
        </div>
    );
};
export default ActualizarPea;