import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useActualizarHerramientas } from "../../../hooks/inventario/herramientas/useActualizarHerramientas";
import { useHerramientaPorId } from "../../../hooks/inventario/herramientas/useHerramientaPorId";
import Formulario from "../../globales/Formulario";


const ActualizarHerramienta = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    if (!id) {
        console.error("❌ Error: ID no válido");
        return <div className="text-red-500">Error: ID no válido</div>;
    }

    const { data: herramienta, isLoading, error } = useHerramientaPorId(id);
    const actualizarHerramienta = useActualizarHerramientas();

    const [formData, setFormData] = useState({
        nombre_h: "",
        estado: "",
        stock: "",
    });

    useEffect(() => {
        if (herramienta) {
            setFormData({
                nombre_h: herramienta.nombre_h || "",
                estado: herramienta.estado || "",
                stock: herramienta.stock?.toString() || "0",
            });
        }
    }, [herramienta]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        const herramientaActualizada = {
            id: Number(id),
            nombre_h: data.nombre_h.trim(),
            estado: data.estado.trim(),
            stock: parseInt(data.stock, 10),
        };

        if (
            !herramientaActualizada.nombre_h ||
            !herramientaActualizada.estado ||
            isNaN(herramientaActualizada.stock)
        ) {
            console.error("⚠️ Datos inválidos. No se enviará la actualización.");
            return;
        }

        actualizarHerramienta.mutate(herramientaActualizada, {
            onSuccess: () => {
                console.log("✅ Herramienta actualizada correctamente");
                navigate("/herramientas");
            },
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar la herramienta</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario
                fields={[
                    { id: "nombre_h", label: "Nombre", type: "text" },
                    {
                        id: "estado",
                        label: "Estado",
                        type: "select",
                        options: [
                            { value: "Disponible", label: "Disponible" },
                            { value: "Prestado", label: "Prestado" },
                            { value: "En_reparacion", label: "En reparación" },
                        ],
                    },
                    { id: "stock", label: "Stock", type: "number" },
                ]}
                onSubmit={handleSubmit}
                initialValues={formData}
                isError={actualizarHerramienta.isError}
                isSuccess={actualizarHerramienta.isSuccess}
                title="Actualizar Herramienta"
                key={JSON.stringify(formData)} // Para que se reinicie el formulario al cambiar los datos
            />
        </div>
    );
};

export default ActualizarHerramienta;
