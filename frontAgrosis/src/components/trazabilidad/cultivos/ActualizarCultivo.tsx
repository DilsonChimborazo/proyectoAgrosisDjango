import { useState, useEffect } from "react";
import { useActualizarCultivo } from './../../../hooks/trazabilidad/cultivo/useActualizarCultivo';
import { useNavigate, useParams } from "react-router-dom";
import { useCultivoPorId } from "../../../hooks/trazabilidad/cultivo/useCultivoPorId";
import Formulario from "../../globales/Formulario";


const ActualizarCultivo = () => {
    const { id } = useParams(); // Obtener ID de la URL
    const { data: cultivo, isLoading, error } = useCultivoPorId(id);
    const actualizarCultivo = useActualizarCultivo();
    const navigate = useNavigate();
    
    // Estado inicial vacío en lugar de null para evitar errores de acceso
    const [formData, setFormData] = useState<{ [key: string]: string }>({
        nombre_cultivo: "",
        fecha_plantacion: "",
        descripcion: "",
        fk_id_especie: "",
        fk_id_semillero: "",
    });

    useEffect(() => {
        if (cultivo && Object.keys(cultivo).length > 0) {
            console.log("🔄 Actualizando formulario con:", cultivo);
            
            setFormData({
                nombre_cultivo: cultivo.nombre_cultivo ?? "",
                fecha_plantacion: cultivo.fecha_plantacion ?? "",
                descripcion: cultivo.descripcion ?? "",
                fk_id_especie: cultivo.fk_id_especie?.id ? String(cultivo.fk_id_especie.id) : "", // ✅ Extrae solo el ID
                fk_id_semillero: cultivo.fk_id_semillero?.id ? String(cultivo.fk_id_semillero.id) : "", // ✅ Extrae solo el ID
            });
        }
    }, [cultivo]);
    // Manejo del envío del formulario
    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        const cultivoActualizado = {
            id: Number(id),
            nombre_cultivo: data.nombre_cultivo || "",
            fecha_plantacion: data.fecha_plantacion || "",
            descripcion: data.descripcion || "",
            fk_id_especie: parseInt(data.fk_id_especie) || 0,
            fk_id_semillero: parseInt(data.fk_id_semillero) || 0,
        };

        console.log("🚀 Enviando datos al backend:", cultivoActualizado); // 📌 Verifica los datos enviados

        actualizarCultivo.mutate(cultivoActualizado, {
            onSuccess: () => {
                console.log("✅ Cultivo actualizado correctamente");
                navigate("/cultivo");
            },
            onError: (error) => {
                console.error("❌ Error al actualizar cultivo:", error);
            },
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar el cultivo</div>;

    console.log("📌 Estado actual de formData:", formData);

    return (
        <div className="max-w-4xl mx-auto p-4">
            
            <Formulario 
                fields={[
                    { id: 'nombre_cultivo', label: 'Nombre del Cultivo', type: 'text' },
                    { id: 'fecha_plantacion', label: 'Fecha de Plantación', type: 'date' },
                    { id: 'descripcion', label: 'Descripción', type: 'text' },
                    { id: 'fk_id_especie', label: 'ID de Especie', type: 'number' },
                    { id: 'fk_id_semillero', label: 'ID de Semillero', type: 'number' },
                ]} 
                onSubmit={handleSubmit} 
                isError={actualizarCultivo.isError} 
                isSuccess={actualizarCultivo.isSuccess}
                title="Actualizar Cultivo"  
                initialValues={formData}  
                key={JSON.stringify(formData)} // 🔥 Fuerza re-render cuando los datos cambian
            />
            </div>
    );
};

export default ActualizarCultivo;
