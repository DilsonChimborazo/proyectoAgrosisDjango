import { useState, useEffect } from "react";
import { useActualizarControlFitosanitario } from "@/hooks/trazabilidad/control/useActualizarControlFitosanitario";
import { useControlFitosanitarioPorId } from "@/hooks/trazabilidad/control/useControlFitosanitarioPorId";
import { usePlantacion } from "@/hooks/trazabilidad/plantacion/usePlantacion";
import { usePea } from "@/hooks/trazabilidad/pea/usePea";
import { useInsumo } from "@/hooks/inventario/insumos/useInsumo";
import { useMedidas } from "@/hooks/inventario/unidadMedida/useMedidad";
import { useUsuarios } from "@/hooks/usuarios/usuario/useUsuarios";
import Formulario from "../../globales/Formulario";
import { showToast } from '@/components/globales/Toast';

// Extender la interfaz FormField para incluir 'accept'
interface ExtendedFormField {
  id: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[];
  multiple?: boolean;
  extraContent?: React.ReactNode;
  accept?: string;
}

// Extender la interfaz FormProps para incluir 'errorMessage'
interface ExtendedFormProps {
  fields: ExtendedFormField[];
  onSubmit: (data: { [key: string]: string | string[] | File | null }) => void;
  onFieldChange?: (fieldId: string, value: string | string[]) => void;
  isError: boolean;
  errorMessage?: string | undefined;
  isSuccess: boolean;
  title: string;
  initialValues?: { [key: string]: string | string[] | File };
  key?: string;
  multipart?: boolean;
}

const ActualizarControlFitosanitario = ({ id, onSuccess }: { id: string | number; onSuccess: () => void }) => {
  const { data: control, isLoading, error } = useControlFitosanitarioPorId(String(id));
  const actualizarControl = useActualizarControlFitosanitario();
  const { data: plantaciones = [], isLoading: isLoadingPlantaciones, error: errorPlantaciones } = usePlantacion();
  const { data: peas = [], isLoading: isLoadingPeas, error: errorPeas } = usePea();
  const { data: insumos = [], isLoading: isLoadingInsumos, error: errorInsumos } = useInsumo();
  const { data: medidas = [], isLoading: isLoadingMedidas, error: errorMedidas } = useMedidas();
  const { data: usuarios = [], isLoading: isLoadingUsuarios, error: errorUsuarios } = useUsuarios();
  const [selectedInsumoId, setSelectedInsumoId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{ [key: string]: string | string[] | File }>({
    fecha_control: "",
    duracion: "",
    descripcion: "",
    tipo_control: "",
    fk_id_plantacion: "",
    fk_id_pea: "",
    fk_id_insumo: "",
    cantidad_insumo: "",
    fk_unidad_medida: "",
    fk_identificacion: [],
    img: new File([], ""),
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
        fk_identificacion: control.fk_identificacion?.map((user: any) => String(user.id)) || [],
        img: new File([], ""),
      });
      setSelectedInsumoId(control.fk_id_insumo?.id ? String(control.fk_id_insumo.id) : null);
      console.log("Form data set:", {
        tipo_control: tipoControlOptions.find(option => option.value === control.tipo_control)?.value || "",
        fk_id_plantacion: control.fk_id_plantacion?.id,
        fk_identificacion: control.fk_identificacion?.map((user: any) => String(user.id)),
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
  }));

  const usuarioOptions = usuarios.length > 0
    ? usuarios.map((usuario) => ({
        value: String(usuario.id),
        label: `${usuario.identificacion} ${usuario.nombre}`,
      }))
    : [{ value: '', label: 'No hay usuarios disponibles' }];

  const selectedInsumo = insumos.find(
    (insumo) => String(insumo.id) === selectedInsumoId
  );

  const handleFieldChange = (fieldId: string, value: string | string[]) => {
    if (fieldId === 'fk_id_insumo') {
      setSelectedInsumoId(value as string);
    }
  };

  const handleSubmit = (data: { [key: string]: string | string[] | File | null }) => {
    console.log("Datos del formulario recibidos:", data);

    const errors: string[] = [];
    if (!data.fecha_control) errors.push("La fecha del control es obligatoria");
    if (!data.duracion || parseInt(data.duracion as string) <= 0) errors.push("La duración debe ser un número mayor a 0");
    if (!data.descripcion) errors.push("La descripción es obligatoria");
    if (!data.tipo_control) errors.push("El tipo de control es obligatorio");
    if (!data.fk_id_plantacion) errors.push("La plantación es obligatoria");
    if (!data.fk_id_pea) errors.push("El PEA es obligatorio");
    if (!data.fk_id_insumo) errors.push("El insumo es obligatorio");
    if (!data.cantidad_insumo || parseInt(data.cantidad_insumo as string) <= 0) errors.push("La cantidad de insumo debe ser un número mayor a 0");
    if (!data.fk_unidad_medida) errors.push("La unidad de medida es obligatoria");
    if (!data.fk_identificacion || (data.fk_identificacion as string[]).length === 0) errors.push("Debe seleccionar al menos un usuario");

    const cantidadInsumoIngresada = parseInt(data.cantidad_insumo as string) || 0;
    const insumoSeleccionado = insumos.find(
      (insumo) => String(insumo.id) === data.fk_id_insumo
    );

    if (insumoSeleccionado && cantidadInsumoIngresada > (insumoSeleccionado.cantidad_insumo ?? 0)) {
      errors.push(`La cantidad ingresada (${cantidadInsumoIngresada}) excede el stock disponible (${insumoSeleccionado.cantidad_insumo ?? 0}).`);
    }

    if (errors.length > 0) {
      showToast({
        title: 'Error al actualizar control fitosanitario',
        description: errors.join(", "),
        timeout: 5000,
        variant: 'error',
      });
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
      fk_identificacion: (data.fk_identificacion as string[]).map(Number),
      img: data.img instanceof File ? data.img : undefined,
    };

    console.log("Enviando control fitosanitario actualizado al backend:", controlActualizado);

    actualizarControl.mutate(controlActualizado, {
      onSuccess: (response) => {
        console.log("✅ Respuesta del backend:", response);
        console.log("✅ Control fitosanitario actualizado correctamente");
        showToast({
          title: 'Control fitosanitario actualizado exitosamente',
          description: 'El control fitosanitario ha sido actualizado en el sistema.',
          timeout: 4000,
          variant: 'success',
        });
        onSuccess();
      },
      onError: (error: any) => {
        console.error("Error al actualizar control fitosanitario:", error.message);
        showToast({
          title: 'Error al actualizar control fitosanitario',
          description: error.message || 'No se pudo actualizar el control fitosanitario. Intenta de nuevo.',
          timeout: 5000,
          variant: 'error',
        });
      },
    });
  };

  if (isLoading || isLoadingPlantaciones || isLoadingPeas || isLoadingInsumos || isLoadingMedidas || isLoadingUsuarios) {
    return <div className="text-center text-gray-500">Cargando datos...</div>;
  }

  if (error || errorPlantaciones || errorPeas || errorInsumos || errorMedidas || errorUsuarios) {
    const errorMessages = [
      error?.message,
      errorPlantaciones?.message,
      errorPeas?.message,
      errorInsumos?.message,
      errorMedidas?.message,
      errorUsuarios?.message,
    ].filter(Boolean).join(", ");
    showToast({
      title: 'Error al cargar datos',
      description: errorMessages || 'No se pudieron cargar los datos necesarios.',
      timeout: 5000,
      variant: 'error',
    });
    return <div className="text-red-500">Error al cargar datos: {errorMessages}</div>;
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
          { 
            id: 'fk_id_insumo', 
            label: 'Insumo', 
            type: 'select', 
            options: insumoOptions,
            extraContent: selectedInsumo ? (
              <div className="text-sm text-green-600 text-center">
                Stock disponible del insumo seleccionado: {selectedInsumo.cantidad_insumo ?? 0}
              </div>
            ) : null,
          },
          { id: 'cantidad_insumo', label: 'Cantidad Insumo', type: 'number'},
          { id: 'fk_unidad_medida', label: 'Unidad de Medida', type: 'select', options: medidaOptions},
          { 
            id: 'fk_identificacion', 
            label: 'Usuario', 
            type: 'select', 
            options: usuarioOptions, 
            multiple: true 
          },
          { id: 'img', label: 'Imagen', type: 'file', accept: 'image/*'},
        ] as ExtendedFormField[]}
        onSubmit={handleSubmit}  
        onFieldChange={handleFieldChange}
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