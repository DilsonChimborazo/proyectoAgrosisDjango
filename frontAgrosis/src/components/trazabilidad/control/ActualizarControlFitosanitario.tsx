import { useState, useEffect } from "react";
import { useActualizarControlFitosanitario } from "@/hooks/trazabilidad/control/useActualizarControlFitosanitario";
import { useControlFitosanitarioPorId } from "@/hooks/trazabilidad/control/useControlFitosanitarioPorId";
import { usePlantacion } from "@/hooks/trazabilidad/plantacion/usePlantacion";
import { usePea } from "@/hooks/trazabilidad/pea/usePea";
import { useInsumo } from "@/hooks/inventario/insumos/useInsumo";
import { useUsuarios } from "@/hooks/usuarios/usuario/useUsuarios";
import { useMedidas } from "@/hooks/inventario/unidadMedida/useMedidad";
import Formulario from "../../globales/Formulario";

interface ActualizarControlFitosanitarioProps {
  id: string | number;
  onSuccess: () => void;
}

const ActualizarControlFitosanitario = ({ id, onSuccess }: ActualizarControlFitosanitarioProps) => {
  const { data: control, isLoading, error } = useControlFitosanitarioPorId(String(id));
  const actualizarControl = useActualizarControlFitosanitario();
  const { data: plantaciones = [], isLoading: isLoadingPlantaciones } = usePlantacion();
  const { data: peas = [], isLoading: isLoadingPeas } = usePea();
  const { data: insumos = [], isLoading: isLoadingInsumos } = useInsumo();
  const { data: medidas = [], isLoading: isLoadingMedidas } = useMedidas();
  const { data: usuarios = [], isLoading: isLoadingUsuarios, error: errorUsuarios } = useUsuarios();
  

  const [formData, setFormData] = useState<{ [key: string]: string | File | null }>({
    fecha_control: "",
    duracion: "",
    descripcion: "",
    tipo_control: "",
    fk_id_plantacion: "",
    fk_id_pea: "",
    fk_id_insumo: "",
    cantidad_insumo: "",
    fk_unidad_medida: "",
    fk_identificacion: "",
    img: null,
  });

  console.log("Control data received:", control);

  useEffect(() => {
    if (control && Object.keys(control).length > 0) {
      setFormData({
        fecha_control: control.fecha_control?.toString().slice(0, 10) ?? "",
        duracion: control.duracion ? String(control.duracion) : "",
        descripcion: control.descripcion ?? "",
        tipo_control: tipoControlOptions.find(option => option.value === control.tipo_control)?.value || "",
        fk_id_plantacion: control.fk_id_plantacion?.id ? String(control.fk_id_plantacion.id) : "",
        fk_id_pea: control.fk_id_pea?.id ? String(control.fk_id_pea.id) : "",
        fk_id_insumo: control.fk_id_insumo?.id ? String(control.fk_id_insumo.id) : "",
        cantidad_insumo: control.cantidad_insumo ? String(control.cantidad_insumo) : "",
        fk_unidad_medida: control.fk_unidad_medida?.id ? String(control.fk_unidad_medida.id) : "",
        fk_identificacion: control.fk_identificacion?.id ? String(control.fk_identificacion.id) : "",
        img: null,
      });
      console.log("Form data set:", {
        tipo_control: tipoControlOptions.find(option => option.value === control.tipo_control)?.value || "",
        fk_id_plantacion: control.fk_id_plantacion?.id,
      });
    }
  }, [control]);

  const tipoControlOptions = [
    { value: 'Control Biologico', label: 'Control Biologico' },
    { value: 'Control Fisico', label: 'Control Fisico' },
    { value: 'Control Quimico', label: 'Control Quimico' },
    { value: 'Control Cultural', label: 'Control Cultural' },
    { value: 'Control Genetico', label: 'Control Genetico' },
  ];

  const plantacionOptions = plantaciones.map((plantacion) => ({
    value: String(plantacion.id),
    label: `Plantación ${plantacion.id} - ${plantacion.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo'}`,
  }));

  const peaOptions = peas.map((pea) => ({
    value: String(pea.id),
    label: pea.nombre_pea,
  }));

  const insumoOptions = insumos.map((insumo) => ({
    value: String(insumo.id),
    label: insumo.nombre,
  }));

  const medidaOptions = medidas.map((medida) => ({
    value: String(medida.id),
    label: medida.nombre_medida,
  }))

  const usuarioOptions = usuarios.length > 0
    ? usuarios.map((usuario) => ({
        value: String(usuario.id),
        label: `${usuario.identificacion} ${usuario.nombre}`,
      }))
    : [{ value: '', label: 'No hay usuarios disponibles' }];

  const handleSubmit = (data: { [key: string]: string | File | null }) => {
    console.log("Datos del formulario recibidos:", data);

    if (
      !data.fecha_control ||
      !data.duracion ||
      !data.descripcion ||
      !data.tipo_control ||
      !data.fk_id_plantacion ||
      !data.fk_id_pea ||
      !data.fk_id_insumo ||
      !data.cantidad_insumo||
      !data.fk_unidad_medida 
    ) {
      console.error("Los campos obligatorios no están completos:", data);
      return;
    }

    const controlActualizado = {
      id: Number(id),
      fecha_control: new Date(data.fecha_control as string).toISOString().split('T')[0],
      duracion: parseInt(data.duracion as string) || 0,
      descripcion: (data.descripcion as string).trim(),
      tipo_control: data.tipo_control as string,
      fk_id_plantacion: parseInt(data.fk_id_plantacion as string) || 0,
      fk_id_pea: parseInt(data.fk_id_pea as string) || 0,
      fk_id_insumo: parseInt(data.fk_id_insumo as string) || 0,
      cantidad_insumo: parseInt(data.cantidad_insumo as string) || 0,
      fk_unidad_medida: parseInt(data.fk_unidad_medida as string) || 0,
      fk_identificacion: data.fk_identificacion ? parseInt(data.fk_identificacion as string) : null,
      img: data.img || undefined,
    };

    console.log("Enviando control fitosanitario actualizado al backend:", controlActualizado);

    actualizarControl.mutate(controlActualizado, {
      onSuccess: (response) => {
        console.log("✅ Respuesta del backend:", response);
        console.log("✅ Control fitosanitario actualizado correctamente");
        onSuccess();
      },
      onError: (error) => {
        console.error("Error al actualizar control fitosanitario:", error.message);
      },
    });
  };

  if (isLoading || isLoadingPlantaciones || isLoadingPeas || isLoadingInsumos || isLoadingMedidas ||isLoadingUsuarios) {
    return <div className="text-center text-gray-500">Cargando datos...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error al cargar el control fitosanitario: {error.message}</div>;
  }

  if (errorUsuarios) {
    return <div className="text-red-500">Error al cargar usuarios: {errorUsuarios.message}</div>;
  }

  if (actualizarControl.isError) {
    return <div className="text-red-500">Error al actualizar: {actualizarControl.error?.message}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario 
        fields={[
          { id: 'fecha_control', label: 'Fecha del Control', type: 'date' },
          { id: 'duracion', label: 'Duración (minutos)', type: 'number'},
          { id: 'descripcion', label: 'Descripción', type: 'text' },
          { id: 'tipo_control', label: 'Tipo de Control', type: 'select', options: tipoControlOptions},
          { id: 'fk_id_plantacion', label: 'Plantación', type: 'select', options: plantacionOptions},
          { id: 'fk_id_pea', label: 'PEA', type: 'select', options: peaOptions},
          { id: 'fk_id_insumo', label: 'Insumo', type: 'select', options: insumoOptions},
          { id: 'cantidad_insumo', label: 'Cantidad Insumo', type: 'number'},
          { id: 'fk_unidad_medida', label: 'Unidad de Medida', type: 'select', options: medidaOptions},
          { id: 'fk_identificacion', label: 'Usuario', type: 'select', options: usuarioOptions },
          { id: 'img', label: 'Imagen', type: 'file', accept: 'image/*'},
        ]}
        onSubmit={handleSubmit}  
        isError={actualizarControl.isError} 
        errorMessage={actualizarControl.error?.message}
        isSuccess={actualizarControl.isSuccess}
        title="Actualizar Control Fitosanitario"
        initialValues={formData}  
        key={JSON.stringify(formData)}
        multipart={true}
      />
    </div>
  );
};

export default ActualizarControlFitosanitario;