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
        fk_id: "",
        nombre_produccion: "",
        cantidad_produccion: "",
        fecha: "",
    });

    // Cargar datos cuando la API responda
    useEffect(() => {
        if (produccion) {
            setFormData({
                fk_id: produccion.fk_id?.id ? String(produccion.fk_id.id) : "",
                nombre_produccion: produccion.nombre_produccion ?? "",
                cantidad_produccion: produccion.cantidad_produccion ? String(Math.round(produccion.cantidad_produccion)) : "",
                fecha: produccion.fecha ?? "",
            });
        }
    }, [produccion]);

    // Manejo del envío del formulario
    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id_produccion) return;

        const produccionActualizada = {
            id_produccion: Number(id_produccion),
            nombre_produccion: formData.nombre_produccion || "",
            fk_id: parseInt(data.fk_id, 10) || 0,
            cantidad_produccion: Math.round(parseFloat(data.cantidad_produccion)), // Redondeamos la cantidad
            fecha: data.fecha,
        };

        actualizarProduccion.mutate(produccionActualizada, {
            onSuccess: () => {
                setTimeout(() => navigate("/produccion"), 500); // ✅ Espera antes de redirigir
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
                        { id: 'fk_id', label: 'ID Cultivo', type: 'number' },
                        { id: 'nombre_produccion', label: 'Nombre Produccion', type: 'text' },
                        { id: 'cantidad_produccion', label: 'Cantidad de Producción', type: 'number' },
                        { id: 'fecha', label: 'Fecha', type: 'date' },
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
