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
        tipo_pea: "",
    });

    useEffect(() => {
        if (pea) {
            console.log("🔄 Cargando datos de la PEA:", pea);
            setFormData({
                nombre_pea: pea.nombre_pea ?? "",
                descripcion: pea.descripcion ?? "",
                tipo_pea: pea.tipo_pea ?? "",
            });
        }
    }, [pea]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        const peaActualizada = {
            id: Number(id),
            nombre_pea: data.nombre_pea.trim(),
            descripcion: data.descripcion.trim(),
            tipo_pea: data.tipo_pea,
        };

        console.log("🚀 Enviando PEA actualizada al backend:", peaActualizada);

        actualizarPea.mutate(peaActualizada, {
            onSuccess: () => {
                console.log("✅ PEA actualizada correctamente");
                navigate("/pea");
            },
            onError: (error) => {
                console.error("❌ Error al actualizar PEA:", error);
            },
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar la PEA</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario 
                fields={[
                    { id: 'nombre_pea', label: 'Nombre del PEA', type: 'text' },
                    { id: 'descripcion', label: 'Descripción', type: 'text' },
                    { 
                        id: 'tipo_pea', 
                        label: 'Tipo de PEA', 
                        type: 'select',
                        options: [
                            { value: 'Plaga', label: 'Plaga' },
                            { value: 'Enfermedad', label: 'Enfermedad' },
                            { value: 'Arvense', label: 'Arvense' }
                        ]
                    },
                ]}
                onSubmit={handleSubmit}  
                isError={actualizarPea.isError} 
                isSuccess={actualizarPea.isSuccess}
                title="Actualizar PEA"
                initialValues={formData}  
                key={JSON.stringify(formData)} // Forzar actualización si los datos cambian
            />
        </div>
    );
};

export default ActualizarPea;
