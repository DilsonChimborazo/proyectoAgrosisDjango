import { useState, useEffect } from "react";
import { useActualizarEspecie } from "../../../hooks/trazabilidad/useActualizarEspecie";
import { useNavigate, useParams } from "react-router-dom";
import { useEspeciePorId } from "../../../hooks/trazabilidad/useEspeciePorId";
import Formulario from "../../globales/Formulario";

const ActualizarEspecie = () => {
    const { id } = useParams(); // Obtener ID de la URL
    const { data: especie, isLoading, error } = useEspeciePorId(id); // Hook para traer los datos de una especie por ID
    const actualizarEspecie = useActualizarEspecie(); // Hook para actualizar la especie
    const navigate = useNavigate();

    const [formData, setFormData] = useState<{ [key: string]: string }>({
        nombre_comun: "",
        nombre_cientifico: "",
        descripcion: "",
        fk_id_tipo_cultivo: "",
    });

    useEffect(() => {
        if (especie && Object.keys(especie).length > 0) {
            console.log("🔄 Actualizando formulario con:", especie);
            setFormData({
                nombre_comun: especie.nombre_comun ?? "",
                nombre_cientifico: especie.nombre_cientifico ?? "",
                descripcion: especie.descripcion ?? "",
                fk_id_tipo_cultivo: especie.fk_id_tipo_cultivo ? String(especie.fk_id_tipo_cultivo) : "",
            });
        }
    }, [especie]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        const especieActualizada = {
            id: Number(id),
            nombre_comun: data.nombre_comun || "",
            nombre_cientifico: data.nombre_cientifico || "",
            descripcion: data.descripcion || "",
            fk_id_tipo_cultivo: parseInt(data.fk_id_tipo_cultivo) || 0,
        };

        console.log("🚀 Enviando datos al backend:", especieActualizada);

        actualizarEspecie.mutate(especieActualizada, {
            onSuccess: () => {
                console.log("✅ Especie actualizada correctamente");
                navigate("/especies");
            },
            onError: (error) => {
                console.error("❌ Error al actualizar la especie:", error);
            },
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar los datos de la especie</div>;

    console.log("📌 Estado actual de formData:", formData);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario
                fields={[
                    { id: "nombre_comun", label: "Nombre Común", type: "text" },
                    { id: "nombre_cientifico", label: "Nombre Científico", type: "text" },
                    { id: "descripcion", label: "Descripción", type: "text" },
                    { id: "fk_id_tipo_cultivo", label: "Tipo de Cultivo", type: "number" },
                ]}
                initialValues={formData} // Pasa los valores iniciales al formulario
                onSubmit={handleSubmit}
                isError={actualizarEspecie.isError}
                isSuccess={actualizarEspecie.isSuccess}
                title="Actualizar Especie"
                key={JSON.stringify(formData)} // Fuerza el re-render al cambiar los valores
            />
        </div>
    );
};

export default ActualizarEspecie;
