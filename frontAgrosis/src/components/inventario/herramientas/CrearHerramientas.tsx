import { useCrearHerramientas } from "@/hooks/inventario/herramientas/useCrearHerramientas";
import { useNavigate } from "react-router-dom";
import Formulario from "../../globales/Formulario";
import { useCrearBodega } from "@/hooks/inventario/bodega/useCrearBodega";
import { showToast } from "@/components/globales/Toast";

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

        const movimientoEntrada = {
          fk_id_asignacion: null,
          fecha: new Date().toISOString().split("T")[0], 
          movimiento: "Entrada" as "Entrada",
          herramientas: [
            {
              id: data.data.id, 
              cantidad: Number(formData.cantidad_herramienta),
            },
          ],
          insumos: [], 
        };

        crearMovimientoBodega(movimientoEntrada, {
          onSuccess: () => {
            showToast({
              title: "Herramienta registrada",
              description: "La herramienta y el movimiento en bodega fueron creados exitosamente.",
              variant: "success"
            });
            if (onSuccess) {
              onSuccess();
            }
            navigate("/bodega");
          },
          onError: (error: any) => {
            console.error("Error al registrar el movimiento en la bodega:", error?.response?.data || error?.message);
            showToast({
              title: "Error al registrar en bodega",
              description: error?.response?.data?.detail || "Ocurrió un error al registrar el movimiento en bodega.",
              variant: "error"
            });
          },
        });
      },
      onError: (error: any) => {
        console.error("Error al crear la herramienta:", error?.response?.data || error?.message);
        showToast({
          title: "Error al crear herramienta",
          description: error?.response?.data?.detail || "No se pudo registrar la herramienta.",
          variant: "error"
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