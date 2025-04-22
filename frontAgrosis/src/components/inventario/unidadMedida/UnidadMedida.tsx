import { useUnidadMedida } from "@/hooks/inventario/unidadMedida/useCrearMedida";
import Formulario from "@/components/globales/Formulario";

const UnidadMedida = ({ onSuccess }: { onSuccess?: () => void }) => {
    const mutation = useUnidadMedida();

    const formFields = [
        { id: "nombre_medida", label: "Nombre de la Medida", type: "text" },
        { id: "abreviatura", label: "Abreviatura", type: "text" },
    ];

    const handleSubmit = (formData: any) => {
        const nuevaUnidad = {
            nombre_medida: formData.nombre_medida,
            abreviatura: formData.abreviatura,
        };

        mutation.mutate(nuevaUnidad, {
            onSuccess: () => {
                console.log("Unidad de medida creada exitosamente:", nuevaUnidad);
                if (onSuccess) onSuccess();
            },
            onError: () => {
                console.error("Error al crear la unidad de medida:");
            },
        });
    };

    return (
        <div className="container">
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
