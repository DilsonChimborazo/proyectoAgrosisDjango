import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHerramientas } from "../../../hooks/inventario/herramientas/useHerramientas";
import { useActualizarHerramientas } from "../../../hooks/inventario/herramientas/useActualizarHerramientas";
import Formulario from "../../globales/Formulario";

const ActualizarHerramienta = () => {
  const { id } = useParams();
  const { data: herramienta, isLoading, error } = useHerramientas(id); 
  const actualizarHerramienta = useActualizarHerramientas(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{ [key: string]: string }>({
    nombre_h: "",
    estado: "",
    fecha_prestamo: "",
  });

  useEffect(() => {
    if (herramienta && Object.keys(herramienta).length > 0) {
      console.log("🔄 Actualizando formulario con:", herramienta);

      setFormData({
        nombre_h: herramienta.nombre_h || "",
        estado: herramienta.estado || "",
        fecha_prestamo: herramienta.fecha_prestamo || "",
      });
    }
  }, [herramienta]);

  const formFields = [
    { id: "nombre_h", label: "Nombre", type: "text" },
    { id: "estado", label: "Estado", type: "text" },
    { id: "fecha_prestamo", label: "Fecha de Préstamo", type: "date" },
  ];


  const handleSubmit = (data: { [key: string]: string }) => {
    if (!id) return;

    const herramientaActualizada = {
      id: Number(id), 
      nombre_h: data.nombre_h || "",
      estado: data.estado || "",
      fecha_prestamo: data.fecha_prestamo || "",
    };

    console.log("🚀 Enviando datos al backend:", herramientaActualizada); 

    actualizarHerramienta.mutate(herramientaActualizada, {
      onSuccess: () => {
        console.log("✅ Herramienta actualizada correctamente");
        navigate("/herramientas"); 
      },
      onError: (error) => {
        console.error("❌ Error al actualizar la herramienta:", error);
      },
    });
  };


  if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
  if (error) return <div className="text-red-500">Error al cargar la herramienta</div>;

  console.log("📌 Estado actual de formData:", formData);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={actualizarHerramienta.isError}
        isSuccess={actualizarHerramienta.isSuccess}
        title="Actualizar Herramienta"
        initialValues={formData}
        key={JSON.stringify(formData)} 
      />
    </div>
  );
};

export default ActualizarHerramienta;

