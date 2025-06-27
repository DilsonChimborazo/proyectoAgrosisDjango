import { useState, useEffect } from "react";
import { useActualizarProduccion } from "../../../hooks/finanzas/produccion/useActualizarProduccion";
import { useNavigate, useParams } from "react-router-dom";
import { useProduccionId } from "../../../hooks/finanzas/produccion/useProduccionId";
import Formulario from "../../globales/Formulario";

const ActualizarProduccion = () => {
  const { id_produccion } = useParams<{ id_produccion?: string }>();
  const { data: produccion, isLoading, error } = useProduccionId(id_produccion);
  const actualizarProduccion = useActualizarProduccion();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fk_id_plantacion: "",
    nombre_produccion: "",
    cantidad_producida: "",
    fk_unidad_medida: "",
    fecha: "",
    stock_disponible: "",
    precio_sugerido_venta: "",
  });

  useEffect(() => {
    if (produccion) {
      setFormData({
        fk_id_plantacion: produccion.fk_id_plantacion ? String(produccion.fk_id_plantacion.id || produccion.fk_id_plantacion) : "",
        nombre_produccion: produccion.nombre_produccion ?? "",
        cantidad_producida: produccion.cantidad_producida ? String(produccion.cantidad_producida) : "",
        fk_unidad_medida: produccion.fk_unidad_medida ? String(produccion.fk_unidad_medida.id || produccion.fk_unidad_medida) : "",
        fecha: produccion.fecha ? new Date(produccion.fecha).toISOString().split("T")[0] : "",
        stock_disponible: produccion.stock_disponible ? String(produccion.stock_disponible) : "",
        precio_sugerido_venta: produccion.precio_sugerido_venta !== null ? String(produccion.precio_sugerido_venta) : "",
      });
    }
  }, [produccion]);

  const handleSubmit = (data: { [key: string]: string | string[] | File }) => {
    if (!id_produccion) return;

    // Convertir los valores necesarios a string para el formulario
    const stringData: { [key: string]: string } = {};
    Object.entries(data).forEach(([key, value]) => {
      stringData[key] = value instanceof File ? value.name : Array.isArray(value) ? value.join(',') : value;
    });

    const produccionActualizada = {
      id_produccion: Number(id_produccion),
      nombre_produccion: stringData.nombre_produccion || "",
      cantidad_producida: stringData.cantidad_producida ? parseFloat(stringData.cantidad_producida) : 0,
      fecha: stringData.fecha || new Date().toISOString().split("T")[0],
      fk_id_plantacion: stringData.fk_id_plantacion ? parseInt(stringData.fk_id_plantacion, 10) : null,
      fk_unidad_medida: stringData.fk_unidad_medida ? parseInt(stringData.fk_unidad_medida, 10) : null,
      stock_disponible: stringData.stock_disponible ? parseFloat(stringData.stock_disponible) : undefined,
      precio_sugerido_venta: stringData.precio_sugerido_venta ? parseFloat(stringData.precio_sugerido_venta) : null,
    };

    if (isNaN(produccionActualizada.cantidad_producida) || 
        (produccionActualizada.stock_disponible && isNaN(produccionActualizada.stock_disponible))) {
      return;
    }

    actualizarProduccion.mutate(produccionActualizada, {
      onSuccess: () => {
        navigate("/produccion", { replace: true });
      }
    });
  };

  if (isLoading) return <div className="text-center text-gray-500 py-4">Cargando datos...</div>;
  if (error) return <div className="text-center text-red-500 py-4">Error al cargar la producción</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Actualizar Producción</h2>
      {produccion && (
        <Formulario
          fields={[
            { id: 'fk_id_plantacion', label: 'ID Plantación', type: 'number' },
            { id: 'nombre_produccion', label: 'Nombre Producción', type: 'text' },
            { id: 'cantidad_producida', label: 'Cantidad Producida', type: 'number' },
            { id: 'fk_unidad_medida', label: 'Unidad de Medida (ID)', type: 'number' },
            { id: 'fecha', label: 'Fecha', type: 'date' },
            { id: 'stock_disponible', label: 'Stock Disponible', type: 'number' },
            { id: 'precio_sugerido_venta', label: 'Precio Sugerido', type: 'number' },
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