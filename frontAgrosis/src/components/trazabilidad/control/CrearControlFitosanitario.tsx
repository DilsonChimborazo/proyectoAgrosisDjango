import { useCrearControlFitosanitario } from '@/hooks/trazabilidad/control/useCrearControlFitosanitario';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';
import { useCultivo } from '@/hooks/trazabilidad/cultivo/useCultivo';
import { usePea } from '@/hooks/trazabilidad/pea/usePea';
import { useInsumo } from '../../../hooks/inventario/insumos/useInsumo';

const CrearControlFitosanitario = () => {
  const mutation = useCrearControlFitosanitario();
  const navigate = useNavigate();
  const { data: cultivos = [], isLoading: isLoadingCultivos } = useCultivo();
  const { data: peas = [], isLoading: isLoadingPeas } = usePea();
  const { data: insumos = [], isLoading: isLoadingInsumos } = useInsumo();

  
 // Opciones de tipo de control
  const tipoControlOptions = [
    { value: 'Control Biológico', label: 'Control Biológico' },
    { value: 'Control Físico', label: 'Control Físico' },
    { value: 'Control Químico', label: 'Control Químico' },
    { value: 'Control Cultural', label: 'Control Cultural' },
    { value: 'Control Genético', label: 'Control Genético' },
  ];

  // Opciones de cultivos
  const cultivoOptions = cultivos.map((cultivo) => ({
    value: String(cultivo.id),
    label: cultivo.nombre_cultivo,
  }));

  // Opciones de PEAs
  const peaOptions = peas.map((pea) => ({
    value: String(pea.id),
    label: pea.nombre_pea,
  }));

  // Opciones de insumos
  const insumoOptions = insumos.map((insumo) => ({
    value: String(insumo.id),
    label: insumo.nombre,
  }));

  // Definición de los campos del formulario
  const formFields = [
    { id: 'fecha_control', label: 'Fecha del Control', type: 'date' },
    { id: 'descripcion', label: 'Descripción', type: 'text' },
    { id: 'tipo_control', label: 'Tipo de Control', type: 'select', options: tipoControlOptions },
    { id: 'fk_id_cultivo', label: 'Cultivo', type: 'select', options: cultivoOptions },
    { id: 'fk_id_pea', label: 'PEA', type: 'select', options: peaOptions },
    { id: 'fk_id_insumo', label: 'Insumo', type: 'select', options: insumoOptions },
    { id: 'cantidad_insumo', label: 'Cantidad de Insumo', type: 'number' },
  ];

  // Este es el que se usa para enviar el formulario principal de control
  const handleControlSubmit = (formData: { [key: string]: string }) => {
    if (
      !formData.fecha_control ||
      !formData.descripcion ||
      !formData.tipo_control ||
      !formData.fk_id_cultivo ||
      !formData.fk_id_pea ||
      !formData.fk_id_insumo ||
      !formData.cantidad_insumo
    ) {
      console.error("❌ Todos los campos son obligatorios");
      return;
    }

    const nuevoControl = {
      fecha_control: new Date(formData.fecha_control).toISOString().split('T')[0],
      descripcion: formData.descripcion.trim(),
      tipo_control: formData.tipo_control,
      fk_id_cultivo: Number(formData.fk_id_cultivo),
      fk_id_pea: Number(formData.fk_id_pea),
      fk_id_insumo: Number(formData.fk_id_insumo),
      cantidad_insumo: Number(formData.cantidad_insumo),
    };

    console.log("🚀 Enviando control fitosanitario al backend:", nuevoControl);

    mutation.mutate(nuevoControl, {
      onSuccess: () => {
        console.log("✅ Control fitosanitario creado exitosamente");
        navigate("/control-fitosanitario");
      },
      onError: (error) => {
        console.error("❌ Error al crear control fitosanitario:", error);
      },
    });
  };

  if (isLoadingCultivos || isLoadingPeas || isLoadingInsumos) {
    return <div className="text-center text-gray-500">Cargando datos...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario 
        fields={formFields}
        onSubmit={handleControlSubmit} // 👈 Aquí se usa el nombre corregido
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Registrar Nuevo Control Fitosanitario"
      />
    </div>
  );
};

export default CrearControlFitosanitario;
