import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAsignacionporId } from "../../../hooks/trazabilidad/asignacion/useAsignacionPorId";
import { useEditarAsignacion } from "../../../hooks/trazabilidad/asignacion/useEditarAsignacion";
import { useUsuarios } from "@/hooks/usuarios/useUsuarios";
import Formulario from "../../globales/Formulario";

const ActualizarAsignacion = () => {
  const { id } = useParams(); // Obtener ID de la URL
  const { data: asignacion, isLoading, error } = useAsignacionporId(id); // Hook para obtener datos por ID
  const actualizarAsignacion = useEditarAsignacion(); // Hook para actualizar
  const { data: usuarios = [] } = useUsuarios(); // Hook para obtener la lista de usuarios
  const navigate = useNavigate();

  // Estado inicial del formulario
  const [formData, setFormData] = useState<{ [key: string]: string }>({
    fecha: "",
    observaciones: "",
    fk_id_actividad: "",
    id_identificacion: "",
  });

  // Cargar los datos de la asignación en el formulario cuando se obtengan
  useEffect(() => {
    if (asignacion && Object.keys(asignacion).length > 0) {
      console.log("🔄 Actualizando formulario con:", asignacion);

      setFormData({
        fecha: asignacion.fecha || "",
        observaciones: asignacion.observaciones || "",
        fk_id_actividad: asignacion.fk_id_actividad?.toString() || "", // Convertir a string para el formulario
        id_identificacion: asignacion.id_identificacion?.toString() || "", // Convertir a string para el formulario
      });
    }
  }, [asignacion]);

  // Definir los campos del formulario
  const formFields = [
    { id: "fecha", label: "Fecha", type: "date" },
    { id: "observaciones", label: "Observaciones", type: "text" },
    { id: "fk_id_actividad", label: "Actividad", type: "number" },
    {
      id: "id_identificacion",
      label: "Usuario",
      type: "select",
      options: usuarios?.map((usr) => ({ value: usr.id.toString(), label: usr.nombre })) || [],
    },
  ];

  // Manejar el envío del formulario
  const handleSubmit = (data: { [key: string]: string }) => {
    if (!id) return;

    const asignacionActualizada = {
      id: Number(id), // Convertir ID a número
      fecha: data.fecha || "",
      observaciones: data.observaciones || "",
      fk_id_actividad: parseInt(data.fk_id_actividad) || 0, // Convertir a número
      id_identificacion: parseInt(data.id_identificacion) || 0, // Convertir a número
    };

    console.log("🚀 Enviando datos al backend:", asignacionActualizada); // Verifica los datos enviados

    actualizarAsignacion.mutate(asignacionActualizada, {
      onSuccess: () => {
        console.log("✅ Asignación actualizada correctamente");
        navigate("/actividad"); // Redirigir tras el éxito
      },
      onError: (error) => {
        console.error("❌ Error al actualizar la asignación:", error);
      },
    });
  };

  // Mostrar estados de carga o error
  if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
  if (error) return <div className="text-red-500">Error al cargar la asignación</div>;

  console.log("📌 Estado actual de formData:", formData);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={actualizarAsignacion.isError}
        isSuccess={actualizarAsignacion.isSuccess}
        title="Actualizar Asignación"
        initialValues={formData}
        key={JSON.stringify(formData)} // Forzar re-render cuando cambien los datos
      />
    </div>
  );
};

export default ActualizarAsignacion;