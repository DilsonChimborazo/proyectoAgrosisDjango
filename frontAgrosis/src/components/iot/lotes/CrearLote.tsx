import { Lotes } from "../../../hooks/iot/lote/useCrearLote";
import { useCrearLote } from "../../../hooks/iot/lote/useCrearLote";
import Formulario from "../../globales/Formulario";
import { useNavigate } from "react-router-dom";
import { useUbicaciones } from "@/hooks/iot/ubicacion/useUbicacion";

// Interfaz Ubicacion (por si no está importada en este archivo)
export interface Ubicacion {
  id: number;
  latitud: number;
  longitud: number;
}

const CrearLote = () => {
  const mutation = useCrearLote();
  const navigate = useNavigate();
  const { data: ubicaciones = [] } = useUbicaciones(); // Usamos el hook useUbicaciones

  // Definir los campos del formulario
  const formFields = [
    {
      id: "fk_id_ubicacion",
      label: "Ubicación",
      type: "select",
      options: Array.isArray(ubicaciones)
        ? ubicaciones.map((ubicacion: Ubicacion) => ({
            value: ubicacion.id.toString(), // Convertimos a string para el select
            label: `Ubicacion: ${ubicacion.id} \nLatitud: ${ubicacion.latitud} \nLongitud: ${ubicacion.longitud}`, // Usamos \n para saltos de línea// Mostramos latitud y longitud
          }))
        : [], 
    },
    { id: "dimencion", label: "Dimensión", type: "number" },
    { id: "nombre_lote", label: "Nombre del Lote", type: "text" },
    { id: "estado", label: "Estado", type: "text" },
  ];

  // Manejar el envío del formulario
  const handleSubmit = (formData: { [key: string]: string }) => {
    // Validar que los campos requeridos estén presentes
    if (
      !formData.fk_id_ubicacion ||
      !formData.dimencion ||
      !formData.nombre_lote ||
      !formData.estado
    ) {
      console.log("Campos faltantes");
      return;
    }

    const nuevoLote: Lotes = {
      id: 0, // ID inicial (puede ser manejado por el backend)
      fk_id_ubicacion: Number(formData.fk_id_ubicacion), // Convertimos a número
      dimencion: Number(formData.dimencion), // Ya es un número gracias a type: "number"
      nombre_lote: formData.nombre_lote,
      estado: formData.estado,
    };

    mutation.mutate(nuevoLote, {
      onSuccess: () => {
        console.log("✅ Lote creado correctamente");
        navigate("/Lotes");
      },
      onError: (error) => {
        console.error("❌ Error al crear el lote:", error);
      },
    });
  };

  return (
    <div className="p-10">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Crear Lote"
      />
    </div>
  );
};

export default CrearLote;