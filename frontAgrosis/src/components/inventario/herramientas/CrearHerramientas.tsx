import { useCrearHerramientas } from "@/hooks/inventario/herramientas/useCrearHerramientas";
import { useNavigate } from "react-router-dom";
import Formulario from "../../globales/Formulario";
import { useCrearBodega } from "@/hooks/inventario/bodega/useCrearBodega";
import { addToast } from "@heroui/react";

const CrearHerramientas = ({ onSuccess }: { onSuccess?: () => void }) => {
  const mutation = useCrearHerramientas();
  const { mutate: crearMovimientoBodega } = useCrearBodega();
  const navigate = useNavigate();

  const formFields = [
    { id: "nombre_h", label: "Nombre", type: "text" },
    {
      id: "estado",
      label: "Estado",
      type: "select",
      options: [
        { value: "Prestado", label: "Prestado" },
        { value: "En_reparacion", label: "En reparación" },
        { value: "Disponible", label: "Disponible" },
      ],
    },
    { id: "cantidad_herramienta", label: "Cantidad", type: "number" },
  ];

  const handleSubmit = (formData: any) => {
    const nuevaHerramienta = {
      nombre_h: formData.nombre_h,
      estado: formData.estado,
      cantidad_herramienta: Number(formData.cantidad_herramienta),
    };

    mutation.mutate(nuevaHerramienta, {
      onSuccess: (data) => {
        console.log("Herramienta creada exitosamente:", nuevaHerramienta);

        // Crear el payload para el movimiento en bodega
        const movimientoEntrada = {
          fk_id_asignacion: null,
          fecha: new Date().toISOString().split("T")[0], // Formato YYYY-MM-DD
          movimiento: "Entrada" as "Entrada",
          herramientas: [
            {
              id: data.data.id, // ID de la herramienta recién creada
              cantidad: Number(formData.cantidad_herramienta),
            },
          ],
          insumos: [], // No se incluyen insumos
        };

        crearMovimientoBodega(movimientoEntrada, {
          onSuccess: () => {
            addToast({
              title: "Herramienta registrada",
              description: "La herramienta y el movimiento en bodega fueron creados exitosamente.",
              timeout: 4000,
            });
            if (onSuccess) {
              onSuccess();
            }
            navigate("/bodega");
          },
          onError: (error: any) => {
            console.error("Error al registrar el movimiento en la bodega:", error?.response?.data || error?.message);
            addToast({
              title: "Error al registrar en bodega",
              description: error?.response?.data?.detail || "Ocurrió un error al registrar el movimiento en bodega.",
              timeout: 4000,
            });
          },
        });
      },
      onError: (error: any) => {
        console.error("Error al crear la herramienta:", error?.response?.data || error?.message);
        addToast({
          title: "Error al crear herramienta",
          description: error?.response?.data?.detail || "No se pudo registrar la herramienta.",
          timeout: 4000,
        });
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
        title="Crear Herramienta"
      />
    </div>
  );
};

export default CrearHerramientas;