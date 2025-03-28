import { useCrearControlFitosanitario } from '@/hooks/trazabilidad/control/useCrearControlFitosanitario';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';
import { useCultivo } from '@/hooks/trazabilidad/cultivo/useCultivo';
import { usePea } from '@/hooks/trazabilidad/pea/usePea';

const CrearControlFitosanitario = () => {
  const mutation = useCrearControlFitosanitario();
  const navigate = useNavigate();
  const { data: cultivos = [], isLoading: isLoadingCultivos } = useCultivo();
  const { data: peas = [], isLoading: isLoadingPeas } = usePea();

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
    value: String(cultivo.id), // ✅ Convertir a string
    label: cultivo.nombre_cultivo,
  }));

  // Opciones de PEAs
  const peaOptions = peas.map((pea) => ({
    value: String(pea.id), // ✅ Convertir a string
    label: pea.nombre_pea,
  }));

  // Definición de los campos del formulario
  const formFields = [
    { id: 'fecha_control', label: 'Fecha del Control', type: 'date' },
    { id: 'descripcion', label: 'Descripción', type: 'text' },
    { id: 'tipo_control', label: 'Tipo de Control', type: 'select', options: tipoControlOptions },
    { id: 'fk_id_cultivo', label: 'Cultivo', type: 'select', options: cultivoOptions },
    { id: 'fk_id_pea', label: 'PEA', type: 'select', options: peaOptions },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    if (!formData.fecha_control || !formData.descripcion || !formData.tipo_control || !formData.fk_id_cultivo || !formData.fk_id_pea) {
      console.error("❌ Todos los campos son obligatorios");
      return;
    }

    const nuevoControl = {
      fecha_control: new Date(formData.fecha_control).toISOString().split('T')[0], // Formato YYYY-MM-DD
      descripcion: formData.descripcion.trim(),
      tipo_control: formData.tipo_control,
      fk_id_cultivo: Number(formData.fk_id_cultivo),
      fk_id_pea: Number(formData.fk_id_pea),
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

  if (isLoadingCultivos || isLoadingPeas) {
    return <div className="text-center text-gray-500">Cargando datos...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario 
        fields={formFields} 
        onSubmit={handleSubmit} 
        isError={mutation.isError} 
        isSuccess={mutation.isSuccess}
        title="Registrar Nuevo Control Fitosanitario"  
      />
    </div>
  );
};

export default CrearControlFitosanitario;
