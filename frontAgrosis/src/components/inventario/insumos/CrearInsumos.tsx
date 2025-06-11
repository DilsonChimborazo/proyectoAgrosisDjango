import { useState } from "react";
import { showToast } from "@/components/globales/Toast";
import Formulario from "../../globales/Formulario";
import VentanaModal from "@/components/globales/VentanasModales";
import { useCrearInsumo } from "@/hooks/inventario/insumos/useCrearInsumos";
import { useCrearBodega } from "@/hooks/inventario/bodega/useCrearBodega";
import { useMedidas } from "@/hooks/inventario/unidadMedida/useMedidad";
import CrearUnidadMedida from "@/components/inventario/unidadMedida/UnidadMedida";

interface CrearInsumosProps {
  onSuccess: () => void;
}

const CrearInsumos = ({ onSuccess }: CrearInsumosProps) => {
  const mutation = useCrearInsumo();
  const { mutate: crearMovimientoBodega } = useCrearBodega();
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
    { id: "nombre", label: "Nombre del Insumo", type: "text", required: true },
    { id: "tipo", label: "Tipo", type: "text", required: true },
    { id: "precio_unidad", label: "Precio por Unidad", type: "number", required: true, min: 0 },
    { id: "cantidad_insumo", label: "Cantidad", type: "number", required: true, min: 1 },
    {
      id: "fk_unidad_medida",
      label: "Unidad de Medida",
      type: "select",
      options: unidades.map((u: any) => ({
        value: u.id.toString(),
        label: `${u.nombre_medida} (${u.unidad_base})`,
      })),
      required: true,
      hasExtraButton: true,
      extraButtonText: "+",
      onExtraButtonClick: abrirModalMedida,
    },
    { id: "fecha_vencimiento", label: "Fecha de Vencimiento", type: "date", required: true },
    { id: "img", label: "Imagen", type: "file", required: false },
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
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("nombre", formData.nombre);
    formDataToSubmit.append("tipo", formData.tipo);
    formDataToSubmit.append("precio_unidad", formData.precio_unidad.toString());
    formDataToSubmit.append("cantidad_insumo", formData.cantidad_insumo.toString());
    formDataToSubmit.append("fecha_vencimiento", formData.fecha_vencimiento);
    formDataToSubmit.append("fk_unidad_medida", formData.fk_unidad_medida);

    if (formData.img instanceof File) {
      formDataToSubmit.append("img", formData.img);
    }

    mutation.mutate(formDataToSubmit, {
      onSuccess: (insumoCreado) => {
        const movimientoEntrada = {
          fk_id_asignacion: null,
          fecha: new Date().toISOString().split("T")[0], 
          movimiento: "Entrada" as "Entrada",
          herramientas: [],
          insumos: [
            {
              id: insumoCreado.id, 
              cantidad: Number(formData.cantidad_insumo),
            },
          ],
        };

        crearMovimientoBodega(movimientoEntrada, {
          onSuccess: () => {
            showToast({
              title: "Insumo creado exitosamente",
              description: "El insumo ha sido registrado en la bodega.",
              timeout: 4000,
              variant: "success",
            });
            onSuccess();
          },
          onError: (error: any) => {
            showToast({
              title: "Error al registrar en bodega",
              description: error.response?.data?.detail || "Ocurrió un error al registrar el movimiento.",
              timeout: 5000,
              variant: "error"
            });
            console.error("Error al registrar en bodega:", {
              status: error.response?.status,
              data: error.response?.data,
              request: error.config?.data,
            });
          },
        });
      },
      onError: (error: any) => {
        showToast({
          title: "Error al crear insumo",
          description: error.response?.data?.detail || "Ocurrió un error al crear el insumo.",
          timeout: 5000,
          variant: "error"
        });
        console.error("Error al crear el insumo:", {
          status: error.response?.status,
          data: error.response?.data,
          request: error.config?.data,
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
        title="Crear Insumo"
        multipart
      />

      <VentanaModal
        isOpen={modalAbierto}
        onClose={cerrarModalMedida}
        contenido={<CrearUnidadMedida onSuccess={cerrarModalMedida} />}
        titulo=""
      />
    </div>
  );
};

export default CrearInsumos;