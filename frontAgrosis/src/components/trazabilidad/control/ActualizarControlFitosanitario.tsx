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

interface ActualizarControlFitosanitarioProps {
  id: string | number;
  onSuccess: () => void;
}

const ActualizarControlFitosanitario = ({ id, onSuccess }: ActualizarControlFitosanitarioProps) => {
  const { data: control, isLoading, error } = useControlFitosanitarioPorId(String(id));
  const actualizarControl = useActualizarControlFitosanitario();
  const { data: plantaciones = [], isLoading: isLoadingPlantaciones, error: errorPlantaciones } = usePlantacion();
  const { data: peas = [], isLoading: isLoadingPeas, error: errorPeas } = usePea();
  const { data: insumos = [], isLoading: isLoadingInsumos, error: errorInsumos } = useInsumo();
  const { data: medidas = [], isLoading: isLoadingMedidas, error: errorMedidas } = useMedidas();
  const { data: usuarios = [], isLoading: isLoadingUsuarios, error: errorUsuarios } = useUsuarios();
  const [selectedInsumoId, setSelectedInsumoId] = useState<string | null>(null);

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
      setSelectedInsumoId(control.fk_id_insumo?.id ? String(control.fk_id_insumo.id) : null);
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

  const handleFieldChange = (fieldId: string, value: string) => {
    if (fieldId === 'fk_id_insumo') {
      setSelectedInsumoId(value);
    }
  };

  const handleSubmit = (data: { [key: string]: string | File | null }) => {
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

    const insumo = insumos.find((i) => String(i.id) === data.fk_id_insumo);
    if (insumo && data.cantidad_insumo && parseFloat(data.cantidad_insumo as string) > (insumo.cantidad_insumo ?? 0)) {
      errors.push(`La cantidad a retirar (${data.cantidad_insumo} g) excede la cantidad disponible (${insumo.cantidad_insumo ?? 0} g)`);
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

    const controlActualizado: {
      id: number;
      fecha_control: string;
      duracion: number;
      descripcion: string;
      tipo_control: string;
      fk_id_plantacion: number;
      fk_id_pea: number;
      fk_id_insumo: number;
      cantidad_insumo: number;
      fk_unidad_medida: number;
      fk_identificacion: number | null;
      img?: File;
    } = {
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
    };

    if (data.img instanceof File) {
      controlActualizado.img = data.img;
    }

    actualizarControl.mutate(controlActualizado, {
      onSuccess: (response) => {
        showToast({
          title: 'Control fitosanitario actualizado exitosamente',
          description: 'El control fitosanitario ha sido actualizado en el sistema.',
          timeout: 4000,
          variant: 'success',
        });
        onSuccess();
      },
      onError: (error: any) => {
        showToast({
          title: 'Error al actualizar control fitosanitario',
          description: error.message || 'No se pudo actualizar el control fitosanitario. Intenta de nuevo.',
          timeout: 5000,
          variant: 'error',
        });
      },
    });
  };

  // Transform formData to exclude null values for initialValues
  const initialValuesForForm: { [key: string]: string | File } = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [
      key,
      value === null ? "" : value,
    ])
  );

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
          { id: 'duracion', label: 'Duración (minutos)', type: 'number' },
          { id: 'descripcion', label: 'Descripción', type: 'text' },
          { id: 'tipo_control', label: 'Tipo de Control', type: 'select', options: tipoControlOptions },
          { id: 'fk_id_plantacion', label: 'Plantación', type: 'select', options: plantacionOptions },
          { id: 'fk_id_pea', label: 'PEA', type: 'select', options: peaOptions },
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
          { id: 'cantidad_insumo', label: 'Cantidad Insumo', type: 'number' },
          { id: 'fk_unidad_medida', label: 'Unidad de Medida', type: 'select', options: medidaOptions },
          { id: 'fk_identificacion', label: 'Usuario', type: 'select', options: usuarioOptions },
          { id: 'img', label: 'Imagen', type: 'file', accept: 'image/*' },
        ]}
        onSubmit={handleSubmit}  
        onFieldChange={handleFieldChange}
        isError={actualizarControl.isError} 
        errorMessage={actualizarControl.error?.message}
        isSuccess={actualizarControl.isSuccess}
        title="Actualizar Control Fitosanitario"
        initialValues={initialValuesForForm}
        key={JSON.stringify(formData)}
        multipart={true}
      />
    </div>
  );
};

export default ActualizarControlFitosanitario;