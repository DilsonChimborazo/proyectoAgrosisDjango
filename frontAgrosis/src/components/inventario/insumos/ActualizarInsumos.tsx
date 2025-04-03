import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInsumo } from "../../../hooks/inventario/insumos/useInsumo";
import { useActualizarInsumo } from "../../../hooks/inventario/insumos/useActualizarInsumos";
import Formulario from "../../globales/Formulario";

const ActualizarInsumo = () => {
  const { id } = useParams(); 
  const { data: insumo, isLoading, error } = useInsumo(id); 
  const actualizarInsumo = useActualizarInsumo(); 
  const navigate = useNavigate();

 
  const [formData, setFormData] = useState<{ [key: string]: string }>({
    nombre: "",
    tipo: "",
    precio_unidad: "",
    cantidad: "",
    unidad_medida: "",
  });

 
  useEffect(() => {
    if (insumo && Object.keys(insumo).length > 0) {
      console.log("🔄 Actualizando formulario con:", insumo);

      setFormData({
        nombre: insumo.nombre || "",
        tipo: insumo.tipo || "",
        precio_unidad: insumo.precio_unidad?.toString() || "",
        cantidad: insumo.cantidad?.toString() || "",
        unidad_medida: insumo.unidad_medida || "",
      });
    }
  }, [insumo]);

 
  const formFields = [
    { id: "nombre", label: "Nombre", type: "text" },
    { id: "tipo", label: "Tipo", type: "text" },
    { id: "precio_unidad", label: "Precio por Unidad", type: "number" },
    { id: "cantidad", label: "Cantidad", type: "number" },
    { id: "unidad_medida", label: "Unidad de Medida", type: "text" },
  ];

 
  const handleSubmit = (data: { [key: string]: string }) => {
    if (!id) return;

    const insumoActualizado = {
      id: Number(id), 
      nombre: data.nombre || "",
      tipo: data.tipo || "",
      precio_unidad: parseFloat(data.precio_unidad) || 0, 
      cantidad: parseInt(data.cantidad, 10) || 0, 
      unidad_medida: data.unidad_medida || "",
    };

    console.log("🚀 Enviando datos al backend:", insumoActualizado); 

    actualizarInsumo.mutate(insumoActualizado, {
      onSuccess: () => {
        console.log("✅ Insumo actualizado correctamente");
        navigate("/insumos"); 
      },
      onError: (error) => {
        console.error("❌ Error al actualizar el insumo:", error);
      },
    });
  };

  if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
  if (error) return <div className="text-red-500">Error al cargar el insumo</div>;

  console.log("📌 Estado actual de formData:", formData);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields}
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

export default ActualizarInsumo;
