import { useState, useEffect } from "react";
import { useEditarSensor } from "@/hooks/iot/sensores/useEditarSensor";
import { useNavigate, useParams } from "react-router-dom";
import { useSensorPorId } from "@/hooks/iot/sensores/useSensorPorId"; 
import Formulario from "../../globales/Formulario";

const EditarSensor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    if (!id) {
        console.error("❌ Error: ID no válido");
        return <div className="text-red-500">Error: ID no válido</div>;
    }

    const { data: sensor, isLoading, error } = useSensorPorId(id);
    const actualizarSensor = useEditarSensor();
    
    const [formData, setFormData] = useState({
        nombre_sensor: "",
        tipo_sensor: "",
        unidad_medida: "",
        descripcion: "",
        medida_minima: "",
        medida_maxima: "",
    });

    useEffect(() => {
        if (sensor) {
            console.log("🔄 Cargando datos del Sensor:", sensor);
            setFormData({
                nombre_sensor: sensor.nombre_sensor || "",
                tipo_sensor: sensor.tipo_sensor || "",
                unidad_medida: sensor.unidad_medida || "",
                descripcion: sensor.descripcion || "",
                medida_minima: sensor.medida_minima ? sensor.medida_minima.toString() : "",
                medida_maxima: sensor.medida_maxima ? sensor.medida_maxima.toString() : "",
            });
        }
    }, [sensor]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        const sensorActualizado = {
            id: Number(id),
            nombre_sensor: data.nombre_sensor.trim() || "",
            tipo_sensor: data.tipo_sensor.trim() || "",
            unidad_medida: data.unidad_medida.trim() || "",
            descripcion: data.descripcion.trim() || "",
            medida_minima: Number(data.medida_minima) || 0,
            medida_maxima: Number(data.medida_maxima) || 0,
        };

        if (
            !sensorActualizado.nombre_sensor ||
            !sensorActualizado.tipo_sensor ||
            !sensorActualizado.unidad_medida ||
            !sensorActualizado.descripcion ||
            sensorActualizado.medida_minima === undefined ||
            sensorActualizado.medida_maxima === undefined
        ) {
            console.error("⚠️ Datos inválidos. No se enviará la actualización.");
            return;
        }

        console.log("🚀 Enviando Sensor actualizado:", sensorActualizado);

        actualizarSensor.mutate(sensorActualizado, {
            onSuccess: () => {
                console.log("✅ Sensor actualizado correctamente");
                navigate("/iot");
            },
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar el Sensor</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario 
                fields={[
                    { id: "nombre_sensor", label: "Nombre del Sensor", type: "text" },
                    { id: "tipo_sensor", label: "Tipo de Sensor", type: "text" },
                    { id: "unidad_medida", label: "Unidad de Medida", type: "text" },
                    { id: "descripcion", label: "Descripción", type: "text" },
                    { id: "medida_minima", label: "Medida Mínima", type: "number" },
                    { id: "medida_maxima", label: "Medida Máxima", type: "number" },
                ]}
                onSubmit={handleSubmit}  
                isError={actualizarSensor.isError} 
                isSuccess={actualizarSensor.isSuccess}
                title="Actualizar Sensor"
                initialValues={formData}  
                key={JSON.stringify(formData)}
            />
        </div>
    );
};

export default EditarSensor;
