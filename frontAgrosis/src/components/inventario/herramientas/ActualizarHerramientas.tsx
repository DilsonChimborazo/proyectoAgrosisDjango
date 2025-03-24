import { useState } from "react";

import { useHerramientas } from "../../../hooks/inventario/herramientas/useHerramientas";
import { useActualizarHerramientas } from "../../../hooks/inventario/herramientas/useActualizarHerramientas";
import Formulario from "../../globales/Formulario";
import { useNavigate } from "react-router-dom";


const ActualizarHerramientas = () => {
    const { data: herramientas, isLoading, error } = useHerramientas();
    const mutation = useActualizarHerramientas();
    const [selectedHerramienta, setSelectedHerramienta] = useState<any | null>(null);
    const navigate = useNavigate();

    if (isLoading) return <div>Cargando herramientas...</div>;
    if (error instanceof Error) return <div>Error al cargar herramientas: {error.message}</div>;

    const formFields = [
        { id: "nombre_h", label: "Nombre", type: "text" },
        { id: "estado", label: "Estado", type: "text" },
        { id: "fecha_prestamo", label: "Fecha de Préstamo", type: "date" },
    ];

    const handleSubmit = (formData: { [key: string]: string }) => {
        if (!selectedHerramienta) {
            console.error("No se ha seleccionado ninguna herramienta");
            return;
        }

        const herramientaActualizada = {
            ...selectedHerramienta, // Mantiene los valores previos
            ...formData, // Reemplaza los nuevos datos


        };

        mutation.mutate(herramientaActualizada);
    };

    return (
        <div className="p-10">
            <h2 className="text-xl font-bold mb-4">Actualizar Herramienta</h2>

            {/* Selector de herramienta */}
            <select
                className="border p-2 mb-4 w-full"
                onChange={(e) => {
                    const herramienta = herramientas?.find(
                        (h: any) => h.id_herramientas === Number(e.target.value)
                    );
                    setSelectedHerramienta(herramienta || null);

                }}
            >
                <option value="">Selecciona una herramienta</option>
                {Array.isArray(herramientas) &&
                    herramientas.map((h: any) => (
                        <option key={h.id_herramientas} value={h.id_herramientas}>
                            {h.nombre_h}
                        </option>
                    ))}
            </select>

            {/* Formulario de actualización */}

            {selectedHerramienta && (
                <>
                    <Formulario
                        fields={formFields}
                        onSubmit={handleSubmit}
                        isError={mutation.isError}
                        isSuccess={mutation.isSuccess}
                        title="Actualizar Herramienta"
                        initialValues={selectedHerramienta}
                    />

                    {/* Botón para regresar a la lista de herramientas */}
                    <button 
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => navigate('/herramientas')}
                    >
                        Volver a Herramientas
                    </button>
                </>
            )}
        </div>
    );
};

export default ActualizarHerramientas;
