import { useState, useEffect } from "react";
import { useActualizarVenta } from "../../../hooks/finanzas/venta/UseActualizarVenta";
import { useNavigate, useParams } from "react-router-dom";
import { useVentaId } from "../../../hooks/finanzas/venta/UseVentaId";
import Formulario from "../../globales/Formulario";

const ActualizarVenta = () => {
    const { id_venta } = useParams(); // Obtener ID de la URL
    const { data: venta, isLoading, error } = useVentaId(id_venta);
    const actualizarVenta = useActualizarVenta();
    const navigate = useNavigate();

    // Estado inicial vacío
    const [formData, setFormData] = useState({
        fk_id_venta: "",
        cantidad: "",
        precio_unidad: "",
        fecha: "",
    });

    // Cargar datos cuando la API responda
    useEffect(() => {
        if (venta) {
            setFormData({
                fk_id_venta: venta.fk_id_venta ? String(venta.fk_id_venta) : "",
                cantidad: venta.cantidad ? String(venta.cantidad) : "",
                precio_unidad: venta.precio_unidad ? String(venta.precio_unidad) : "",
                fecha: venta.fecha ?? "",
            });
        }
    }, [venta, actualizarVenta.isSuccess]); // Se actualiza al cambiar la venta o al actualizar con éxito

    // Manejo del envío del formulario
    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id_venta) return;

        const ventaActualizada = {
            id_venta: Number(id_venta),
            fk_id_venta: parseInt(data.fk_id_venta, 10) || 0,
            cantidad: parseFloat(data.cantidad) || 0,
            precio_unidad: parseFloat(data.precio_unidad) || 0,
            fecha: data.fecha,
        };

        actualizarVenta.mutate(ventaActualizada, {
            onSuccess: () => {
                setTimeout(() => navigate("/ventas"), 500); // ✅ Espera antes de redirigir
            },
            onError: (error) => console.error("❌ Error al actualizar venta:", error),
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar la venta</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            {venta && (
                <Formulario 
                    fields={[
                        { id: 'fk_id_venta', label: 'ID Producto', type: 'number' },
                        { id: 'cantidad', label: 'Cantidad', type: 'number' },
                        { id: 'precio_unidad', label: 'Precio por Unidad', type: 'number' },
                        { id: 'fecha', label: 'Fecha', type: 'date' },
                    ]} 
                    onSubmit={handleSubmit} 
                    isError={actualizarVenta.isError} 
                    isSuccess={actualizarVenta.isSuccess}
                    title="Actualizar Venta"  
                    initialValues={formData}  
                />
            )}
        </div>
    );
};

export default ActualizarVenta;
