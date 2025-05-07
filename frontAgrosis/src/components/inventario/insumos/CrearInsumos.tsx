import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Formulario from "../../globales/Formulario";
import VentanaModal from "@/components/globales/VentanasModales";
import { useCrearInsumo } from "@/hooks/inventario/insumos/useCrearInsumos";
import { useCrearBodega } from "@/hooks/inventario/bodega/useCrearBodega";
import { useMedidas } from "@/hooks/inventario/unidadMedida/useMedidad";
import CrearUnidadMedida from "@/components/inventario/unidadMedida/UnidadMedida";

const CrearInsumos = ({ onSuccess }: { onSuccess?: () => void }) => {
  const mutation = useCrearInsumo();
  const { mutate } = useCrearBodega();
  const navigate = useNavigate();
  const { data: unidades = [], refetch } = useMedidas();

  const [modalAbierto, setModalAbierto] = useState(false);

  const abrirModalMedida = () => {
    setModalAbierto(true);
  };

  const cerrarModalMedida = () => {
    setModalAbierto(false);
    refetch();
  };

  const formFields = [
    { id: "nombre", label: "Nombre del Insumo", type: "text" },
    { id: "tipo", label: "Tipo", type: "text" },
    { id: "precio_unidad", label: "Precio por Unidad", type: "number" },
    { id: "cantidad_insumo", label: "Cantidad", type: "number" },
    {
      id: "fk_unidad_medida",
      label: "Unidad de Medida",
      type: "select",
      options: unidades.map((u: any) => ({
        value: u.id.toString(),
        label: `${u.nombre_medida} (${u.unidad_base})`,
      })),
      hasExtraButton: true,
      extraButtonText: "+",
      onExtraButtonClick: abrirModalMedida,
    },
    { id: "fecha_vencimiento", label: "Fecha de Vencimiento", type: "date" },
    { id: "img", label: "Imagen", type: "file" },
  ];

  const handleSubmit = (formData: any) => {
    if (
      !formData.nombre ||
      !formData.tipo ||
      !formData.precio_unidad ||
      !formData.cantidad_insumo ||
      !formData.fecha_vencimiento ||
      !formData.fk_unidad_medida
    ) {
      console.error("Todos los campos obligatorios deben ser completados.");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("nombre", formData.nombre);
    formDataToSubmit.append("tipo", formData.tipo);
    formDataToSubmit.append("precio_unidad", formData.precio_unidad.toString());
    formDataToSubmit.append("cantidad_insumo", formData.cantidad_insumo.toString());
    formDataToSubmit.append("fecha_vencimiento", formData.fecha_vencimiento);
    formDataToSubmit.append("fk_unidad_medida", formData.fk_unidad_medida); // Corregido el nombre del campo

    if (formData.img instanceof File) {
      formDataToSubmit.append("img", formData.img);
    }

    mutation.mutate(formDataToSubmit, {
      onSuccess: (insumoCreado) => {
        console.log("✅ Insumo creado exitosamente:", insumoCreado);

        const movimientoEntrada = {
          fk_id_insumo: insumoCreado.id,
          cantidad_insumo: formData.cantidad_insumo,
          cantidad_herramienta: null,
          movimiento: "Entrada" as const,
          fecha: new Date().toISOString(),
          fk_id_asignacion: 0,
          fk_id_herramientas: 0,
        };

        mutate(movimientoEntrada, {
          onSuccess: () => {
            if (onSuccess) onSuccess();
            navigate(-1);
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
        <div className="text-red-500 mt-2">
          Hubo un error al crear el insumo. Intenta nuevamente.
        </div>
      )}
      {mutation.isSuccess && (
        <div className="text-green-500 mt-2">
          ¡Insumo creado exitosamente!
        </div>
      )}

      <VentanaModal
        isOpen={modalAbierto}
        onClose={cerrarModalMedida}
        contenido={<CrearUnidadMedida onSuccess={cerrarModalMedida} />}
        titulo="Crear Unidad de Medida"
      />
    </div>
  );
};

export default CrearInsumos;