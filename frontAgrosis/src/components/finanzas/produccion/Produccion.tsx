import { useState, useEffect } from "react";
import { useActualizarProduccion } from "../../../hooks/finanzas/produccion/useActualizarProduccion";
import { useNavigate, useParams } from "react-router-dom";
import { useProduccionId } from "../../../hooks/finanzas/produccion/useProduccionId";
import Formulario from "../../globales/Formulario";

const ActualizarProduccion = () => {
    const { id_produccion } = useParams(); // Obtener ID de la URL
    const { data: produccion, isLoading, error } = useProduccionId(id_produccion);
    const actualizarProduccion = useActualizarProduccion();
    const navigate = useNavigate();

    // Estado inicial vacío
    const [formData, setFormData] = useState({
        fk_id_plantacion: "",
        nombre_produccion: "",
        cantidad_producida: "",
        fecha: "",
        fk_unidad_medida: "",
        cantidad_en_base: ""
    });

    // Cargar datos cuando la API responda
    useEffect(() => {
        if (produccion) {
            setFormData({
                fk_id_plantacion: produccion.fk_id_plantacion?.id ? String(produccion.fk_id_plantacion.id) : "",
                nombre_produccion: produccion.nombre_produccion ?? "",
                cantidad_producida: produccion.cantidad_producida ? String(produccion.cantidad_producida) : "",
                fecha: produccion.fecha ?? "",
                fk_unidad_medida: produccion.fk_unidad_medida?.id ? String(produccion.fk_unidad_medida.id) : "",
                cantidad_en_base: produccion.cantidad_en_base ? String(produccion.cantidad_en_base) : ""
            });
        }
    }, [produccion]);

    // Manejo del envío del formulario
    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id_produccion) return;

        const produccionActualizada = {
            id_produccion: Number(id_produccion),
            nombre_produccion: data.nombre_produccion || "",
            fk_id_plantacion: data.fk_id_plantacion ? parseInt(data.fk_id_plantacion, 10) : null,
            cantidad_producida: parseFloat(data.cantidad_producida) || 0,
            fecha: data.fecha,
            fk_unidad_medida: data.fk_unidad_medida ? parseInt(data.fk_unidad_medida, 10) : null,
            cantidad_en_base: data.cantidad_en_base ? parseFloat(data.cantidad_en_base) : null
        };

        actualizarProduccion.mutate(produccionActualizada, {
            onSuccess: () => {
                setTimeout(() => navigate("/produccion"), 500);
            },
            onError: (error) => console.error("❌ Error al actualizar producción:", error),
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar la producción</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            {produccion && (
                <Formulario 
                    fields={[
                        { id: 'fk_id_plantacion', label: 'ID Plantación', type: 'number' },
                        { id: 'nombre_produccion', label: 'Nombre Producción', type: 'text' },
                        { id: 'cantidad_producida', label: 'Cantidad Producida', type: 'number' },
                        { id: 'fecha', label: 'Fecha', type: 'date' },
                        { id: 'fk_unidad_medida', label: 'Unidad de Medida', type: 'number' },
                        { id: 'cantidad_en_base', label: 'Cantidad en Base', type: 'number' },
                    ]} 
                    onSubmit={handleSubmit} 
                    isError={actualizarProduccion.isError} 
                    isSuccess={actualizarProduccion.isSuccess}
                    title="Actualizar Producción"  
                    initialValues={formData}  
                />
            )}
        </div>
    );
};

export default ActualizarProduccion;