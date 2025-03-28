import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useActualizarEspecie } from "../../../hooks/trazabilidad/especie/useActualizarEspecie";
import { useEspeciePorId } from "../../../hooks/trazabilidad/especie/useEspeciePorId";
import Formulario from "../../globales/Formulario";


const ActualizarEspecie = () => {
    const { id } = useParams(); // Obtener ID de la URL
    const { data: especie, isLoading, error } = useEspeciePorId(id); // Hook para obtener datos por ID
    const actualizarEspecie = useActualizarEspecie(); // Hook para actualizar
    const navigate = useNavigate();

    // Estado inicial del formulario
    const [formData, setFormData] = useState<{ [key: string]: string }>({
        nombre_comun: "",
        nombre_cientifico: "",
        descripcion: "",
        fk_id_tipo_cultivo: "", // Convertimos a string para evitar errores en el formulario
    });

    useEffect(() => {
        if (especie && Object.keys(especie).length > 0) {
            console.log("🔄 Actualizando formulario con:", especie);

            setFormData({
                nombre_comun: especie.nombre_comun || "",
                nombre_cientifico: especie.nombre_cientifico || "",
                descripcion: especie.descripcion || "",
                fk_id_tipo_cultivo: especie.fk_id_tipo_cultivo?.toString() || "", // Convertir a string si existe
            });
        }
    }, [especie]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        const especieActualizada = {
            id: Number(id), // Convertir ID a número
            nombre_comun: data.nombre_comun.trim() || "",
            nombre_cientifico: data.nombre_cientifico.trim() || "",
            descripcion: data.descripcion.trim() || "",
            fk_id_tipo_cultivo: data.fk_id_tipo_cultivo ? Number(data.fk_id_tipo_cultivo) : null, // Convertir a número o null
        };

        console.log("🚀 Enviando datos al backend:", especieActualizada); // Verifica los datos enviados

        actualizarEspecie.mutate(especieActualizada, {
            onSuccess: () => {
                console.log("✅ Especie actualizada correctamente");
                navigate("/especies"); // Redirigir tras el éxito
            },
            onError: (error) => {
                console.error("❌ Error al actualizar la especie:", error);
            },
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar la especie</div>;

    console.log("📌 Estado actual de formData:", formData);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario 
                fields={[
                    { id: 'nombre_comun', label: 'Nombre Comun', type: 'text' },
                    { id: 'nombre_cientifico', label: 'Nombre cientifico', type: 'text' },
                    { id: 'descripcion', label: 'descripcion', type: 'text' },
                    { id: 'fk_id_tipo_cultivo', label: 'ID Tipo de Cultivo (Opcional)', type: 'number' },
                ]} 
                onSubmit={handleSubmit} 
                isError={actualizarEspecie.isError} 
                isSuccess={actualizarEspecie.isSuccess}
                title="Actualizar Especie"  
                initialValues={formData}  
                key={JSON.stringify(formData)} // Forzar re-render cuando cambien los datos
            />
        </div>
    );
};

export default ActualizarEspecie;
