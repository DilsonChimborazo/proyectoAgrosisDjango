import { useNavigate } from "react-router-dom";
import Formulario from "../../globales/Formulario";
import { useCrearInsumo } from "@/hooks/inventario/insumos/useCrearInsumos";
import { useCrearBodega } from "@/hooks/inventario/bodega/useCrearBodega";
import { UnidadMedida } from "@/hooks/inventario/insumos/useInsumo";
import { useMedidas } from "@/hooks/inventario/unidadMedida/useMedidad";
import { button } from "@heroui/theme";

const CrearInsumos = ({ onSuccess }: { onSuccess?: () => void }) => {
  const mutation = useCrearInsumo();
  const { mutate } = useCrearBodega();
  const navigate = useNavigate();
  const { data: unidades = [] } = useMedidas();

  const formFields = [
    { id: "nombre", label: "Nombre del Insumo", type: "text" },
    { id: "tipo", label: "Tipo", type: "text" },
    { id: "precio_unidad", label: "Precio por Unidad", type: "number" },
    { id: "cantidad", label: "Cantidad", type: "number" },
    {
      id: "fk_unidad_medida",
      label: "Unidad de Medida",
      type: "select",
      options: unidades.map((u: UnidadMedida) => ({
        value: u.id.toString(),
        label: `${u.nombre_medida} (${u.abreviatura})`,
      })),
    },
    { id: "fecha_vencimiento", label: "Fecha de Vencimiento", type: "date" },
    { id: "img", label: "Imagen", type: "file" },
  ];

  const handleSubmit = (formData: any) => {
    if (
      !formData.nombre ||
      !formData.tipo ||
      !formData.precio_unidad ||
      !formData.cantidad ||
      !formData.fecha_vencimiento ||
      !formData.fk_unidad_medida ||
      !formData.img
    ) {
      console.error("Todos los campos deben ser completados.");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("nombre", formData.nombre);
    formDataToSubmit.append("tipo", formData.tipo);
    formDataToSubmit.append("precio_unidad", formData.precio_unidad);
    formDataToSubmit.append("cantidad", formData.cantidad);
    formDataToSubmit.append("fecha_vencimiento", formData.fecha_vencimiento);
    formDataToSubmit.append("fk_unidad_medida", formData.fk_unidad_medida);
    formDataToSubmit.append("img", formData.img);

    mutation.mutate(formDataToSubmit, {
      onSuccess: (data) => {
        console.log("✅ Insumo creado exitosamente:", data);

        const movimientoEntrada = {
          fk_id_insumo: data.data,
          cantidad: formData.cantidad,
          movimiento: "Entrada",
          fecha: new Date().toISOString(),
          fk_id_asignacion: null,
          fk_id_herramientas: null,
        };

        mutate(movimientoEntrada, {
          onSuccess: () => {
            if (onSuccess) onSuccess();
            navigate("/bodega");
          },
          onError: (error) => {
            console.error("❌ Error al registrar en bodega:", error?.response?.data || error?.message);
          },
        });
      },
      onError: (error) => {
        console.error("❌ Error al crear el insumo:", error?.response?.data || error?.message);
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
        title="Crear Insumo"
        multipart
      />
      {mutation.isError && (
        <div className="text-red-500 mt-2">Hubo un error al crear el insumo. Intenta nuevamente.</div>
      )}
      {mutation.isSuccess && (
        <div className="text-green-500 mt-2">¡Insumo creado exitosamente!</div>
      )}
    </div>
  );
};

export default CrearInsumos;