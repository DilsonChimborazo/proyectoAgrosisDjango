import { useState, useEffect } from "react";
import { useActualizarControlFitosanitario } from "../../../hooks/trazabilidad/control/useActualizarControlFitosanitario";
import { useNavigate, useParams } from "react-router-dom";
import { useControlFitosanitarioPorId } from "../../../hooks/trazabilidad/control/useControlFitosanitarioPorId";
import Formulario from "../../globales/Formulario";

const ActualizarControlFitosanitario = () => {
    const { id } = useParams();
    const { data: control, isLoading, error } = useControlFitosanitarioPorId(id);
    const actualizarControl = useActualizarControlFitosanitario();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState<{ [key: string]: string }>({
        fecha_control: "",
        descripcion: "",
        fk_id_desarrollan: "", 
    });

    useEffect(() => {
        if (control && Object.keys(control).length > 0) {
            console.log("🔄 Cargando datos del Control Fitosanitario:", control);
            
            setFormData({
                fecha_control: control.fecha_control ?? "",
                descripcion: control.descripcion ?? "",
                fk_id_desarrollan: control.fk_id_desarrollan ? control.fk_id_desarrollan.toString() : "", // Agregar FK
            });
        }
    }, [control]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        const controlActualizado = {
            id: Number(id),
            fecha_control: data.fecha_control || "",
            descripcion: data.descripcion || "",
            fk_id_desarrollan: data.fk_id_desarrollan ? Number(data.fk_id_desarrollan) : null, // Convertir correctamente
        };

        console.log("🚀 Enviando Control Fitosanitario actualizado:", controlActualizado);

        actualizarControl.mutate(controlActualizado, {
            onSuccess: () => {
                console.log("✅ Control Fitosanitario actualizado correctamente");
                navigate("/control-fitosanitario");
            },
            onError: (error) => {
                console.error("❌ Error al actualizar Control Fitosanitario:", error);
            },
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar el Control Fitosanitario</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario 
                fields={[
                    { id: 'fecha_control', label: 'Fecha de Control', type: 'date' },
                    { id: 'descripcion', label: 'Descripción', type: 'text' },
                     { id: 'fk_id_desarrollan', label: 'fk desarrollan  ', type: 'number' }, //
                ]}
                onSubmit={handleSubmit}  
                isError={actualizarControl.isError} 
                isSuccess={actualizarControl.isSuccess}
                title="Actualizar Control Fitosanitario"
                initialValues={formData}  
                key={JSON.stringify(formData)}
            />
        </div>
    );
};

export default ActualizarControlFitosanitario;
