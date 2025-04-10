import { useState, useEffect } from "react";
import { useActualizarControlFitosanitario } from "@/hooks/trazabilidad/control/useActualizarControlFitosanitario";
import { useNavigate, useParams } from "react-router-dom";
import { useControlFitosanitarioPorId } from "@/hooks/trazabilidad/control/useControlFitosanitarioPorId";
import { useCultivo } from "@/hooks/trazabilidad/cultivo/useCultivo";
import { usePea } from "@/hooks/trazabilidad/pea/usePea";
import { useInsumo } from "@/hooks/inventario/insumos/useInsumo";
import Formulario from "../../globales/Formulario";

const ActualizarControlFitosanitario = () => {
    const { id } = useParams();
    const { data: control, isLoading, error } = useControlFitosanitarioPorId(id);
    const actualizarControl = useActualizarControlFitosanitario();
    const navigate = useNavigate();
    const { data: cultivos = [], isLoading: isLoadingCultivos } = useCultivo();
    const { data: peas = [], isLoading: isLoadingPeas } = usePea();
    const { data: insumo = [], isLoading: isLoadingInsumos } = useInsumo();

    const [formData, setFormData] = useState<{ [key: string]: string }>({
        fecha_control: "",
        descripcion: "",
        tipo_control: "",
        fk_id_cultivo: "",
        fk_id_pea: "",
        fk_id_insumo: "",
        cantidad_insumo: ""
    });

    useEffect(() => {
        if (control && Object.keys(control).length > 0) {
            console.log("🔄 Cargando datos del control fitosanitario:", control);
            setFormData({
                fecha_control: control.fecha_control ?? "",
                descripcion: control.descripcion ?? "",
                tipo_control: control.tipo_control ?? "",
                fk_id_cultivo: control.fk_id_cultivo?.id ? String(control.fk_id_cultivo.id) : "",
                fk_id_pea: control.fk_id_pea?.id ? String(control.fk_id_pea.id) : "",
                fk_id_insumo: control.fk_id_insumo?.id ? String(control.fk_id_insumo.id) : "",
                cantidad_insumo: control.cantidad_insumo ?? ""
            });
        }
    }, [control]);

    const tipoControlOptions = [
        { value: 'Control Biológico', label: 'Control Biológico' },
        { value: 'Control Físico', label: 'Control Físico' },
        { value: 'Control Químico', label: 'Control Químico' },
        { value: 'Control Cultural', label: 'Control Cultural' },
        { value: 'Control Genético', label: 'Control Genético' },
    ];

    const cultivoOptions = cultivos.map((cultivo) => ({
        value: String(cultivo.id),
        label: cultivo.nombre_cultivo,
    }));

    const peaOptions = peas.map((pea) => ({
        value: String(pea.id),
        label: pea.nombre_pea,
    }));

    const insumoOptions = insumo.map((insumo) => ({
        value: String(insumo.id),
        label: insumo.nombre,
    }))

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        const controlActualizado = {
            id: Number(id),
            fecha_control: new Date(data.fecha_control).toISOString().split('T')[0],
            descripcion: data.descripcion.trim(),
            tipo_control: data.tipo_control,
            fk_id_cultivo: parseInt(data.fk_id_cultivo) || 0,
            fk_id_pea: parseInt(data.fk_id_pea) || 0,
            fk_id_insumo: parseInt(data.fk_id_insumo) || 0,
            cantidad_insumo: parseInt(data.cantidad_insumo) || 0,
        };

        console.log("🚀 Enviando control fitosanitario actualizado al backend:", controlActualizado);

        actualizarControl.mutate(controlActualizado, {
            onSuccess: () => {
                console.log("✅ Control fitosanitario actualizado correctamente");
                navigate("/control-fitosanitario");
            },
            onError: (error) => {
                console.error("❌ Error al actualizar control fitosanitario:", error);
            },
        });
    };

    if (isLoading || isLoadingCultivos || isLoadingPeas || isLoadingInsumos) {
        return <div className="text-center text-gray-500">Cargando datos...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error al cargar el control fitosanitario</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario 
                fields={[
                    { id: 'fecha_control', label: 'Fecha del Control', type: 'date' },
                    { id: 'descripcion', label: 'Descripción', type: 'text' },
                    { id: 'tipo_control', label: 'Tipo de Control', type: 'select', options: tipoControlOptions },
                    { id: 'fk_id_cultivo', label: 'Cultivo', type: 'select', options: cultivoOptions },
                    { id: 'fk_id_pea', label: 'PEA', type: 'select', options: peaOptions },
                    { id: 'fk_id_insumo', label: 'Insumo', type: 'select', options: insumoOptions },
                    { id: 'cantidad_insumo', label: 'Cantidad insumo', type: 'number' },
                    
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
