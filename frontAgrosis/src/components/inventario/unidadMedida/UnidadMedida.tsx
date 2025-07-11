import { useUnidadMedida } from "@/hooks/inventario/unidadMedida/useCrearMedida";
import Formulario from "@/components/globales/Formulario";

interface UnidadMedidaProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

const UnidadMedida = ({ onSuccess }: UnidadMedidaProps) => {
    const mutation = useUnidadMedida();

    const formFields = [
        { id: "nombre_medida", label: "Nombre de la Medida", type: "text" },
        {
            id: "unidad_base",
            label: "Unidad Base",
            type: "select",
            options: [
                { label: "Gramo", value: "g" },
                { label: "Mililitro", value: "ml" },
                { label: "Unidad", value: "u" },
            ],
        },
        {
            id: "factor_conversion",
            label: "Factor de Conversión",
            type: "number",
            step: "0.0001",
        },
    ];

    const handleSubmit = (formData: any) => {
        const nuevaUnidad = {
            nombre_medida: formData.nombre_medida,
            unidad_base: formData.unidad_base,
            factor_conversion: parseFloat(formData.factor_conversion),
        };

        mutation.mutate(nuevaUnidad, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
            },
            onError: () => {
                console.error("Error al crear la unidad de medida");
            },
        });
    };

    return (
        <div className="container relative">
            
            <Formulario
                fields={formFields}
                onSubmit={handleSubmit}
                isError={mutation.isError}
                isSuccess={mutation.isSuccess}
                title="Crear Unidad de Medida"
            />
            {mutation.isError && (
                <div className="text-red-500 mt-2">Hubo un error al crear la unidad. Intenta nuevamente.</div>
            )}
            {mutation.isSuccess && (
                <div className="text-green-500 mt-2">Unidad creada exitosamente!</div>
            )}
        </div>
    );
};

export default UnidadMedida;