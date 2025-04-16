import { useState, useEffect } from "react";
import { useActualizarInsumos } from "../../../hooks/inventario/insumos/useActualizarInsumos";
import { useInsumoPorId } from "../../../hooks/inventario/insumos/useInsumoPorId";
import Formulario from "../../globales/Formulario";
import { useNavigate,useParams } from "react-router-dom";

const ActualizarInsumos = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    if (!id) {
        console.error("❌ Error: ID no válido");
        return <div className="text-red-500">Error: ID no válido</div>;
    }

    const { data: insumo, isLoading, error } = useInsumoPorId(id);
    const actualizarInsumo = useActualizarInsumos();
    
    const [formData, setFormData] = useState({
        nombre: "",
        tipo: "",
        precio_unidad: "",
        stock: "",
        unidad_medida: "",

    });

    useEffect(() => {
        if (insumo) {
            console.log("🔄 Cargando datos de la Era:", insumo);
            setFormData({
                nombre: insumo.nombre || "",
                tipo: insumo.tipo || "",
                precio_unidad: insumo.precio_unidad || "",
                stock: insumo.stock || "",
                unidad_medida: insumo.unidad_medida || ""            
            });
        }
    }, [insumo]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        const insumoActualizado = {
            id: Number(id),
            nombre: data.nombre.trim() || "",
            tipo: data.tipo.trim() || "",
            precio_unidad: parseFloat(data.precio_unidad),
            stock: parseInt(data.stock, 10),
            unidad_medida: data.unidad_medida.trim() || "",
        };

        if (!insumoActualizado.nombre || !insumoActualizado.tipo|| !insumoActualizado.precio_unidad || !insumoActualizado.stock || !insumoActualizado.unidad_medida) {
            console.error("⚠️ Datos inválidos. No se enviará la actualización.");
            return;
        }

        console.log("🚀 Enviando Era actualizada:", insumoActualizado);

        actualizarInsumo.mutate(insumoActualizado, {
            onSuccess: () => {
                console.log("✅ Era actualizada correctamente");
                navigate("/insumos");
            },
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar la Era</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario 
                fields={[
                    { id: "nombre", label: "Nombre", type: "text" },
                    { id: "tipo", label: "Tipo", type: "text" },
                    { id: "precio_unidad", label: "Precio Unidad", type: "number" },
                    { id: "stock", label: "Stock", type: "number" },
                    { id: "unidad_medida", label: "Unidad Medida", type: "text" },
                ]}
                onSubmit={handleSubmit}  
                isError={actualizarInsumo.isError} 
                isSuccess={actualizarInsumo.isSuccess}
                title="Actualizar Insumo"
                initialValues={formData}  
                key={JSON.stringify(formData)}
            />
        </div>
    );
};

export default ActualizarInsumos;
