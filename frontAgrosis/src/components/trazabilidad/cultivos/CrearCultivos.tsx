import { Cultivos } from '@/hooks/trazabilidad/cultivo/useCrearCultivos';
import { useCrearCultivo } from '@/hooks/trazabilidad/cultivo/useCrearCultivos';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';
import { useCultivo } from '@/hooks/trazabilidad/cultivo/useCultivo';

const CrearCultivo = () => {
  const mutation = useCrearCultivo();
  const navigate = useNavigate();
  const { data: cultivos = [], isLoading: isLoadingCultivos } = useCultivo();

  // Obtener especies únicas
  const especiesUnicas = Array.from(new Map(
    cultivos.map((cultivo) => [cultivo.fk_id_especie.id, cultivo.fk_id_especie])
  ).values());

  // Obtener semilleros únicos
  const semillerosUnicos = Array.from(new Map(
    cultivos.map((cultivo) => [cultivo.fk_id_semillero.id, cultivo.fk_id_semillero])
  ).values());

  // Mapeo de opciones para el select de especies
  const especieOptions = especiesUnicas.map((especie) => ({
    value: especie.id,
    label: especie.nombre_comun,
  }));

  // Mapeo de opciones para el select de semilleros
  const semilleroOptions = semillerosUnicos.map((semillero) => ({
    value: semillero.id,
    label: semillero.nombre_semillero,
  }));

  // Definición de los campos del formulario
  const formFields = [
    { id: 'nombre_cultivo', label: 'Nombre del Cultivo', type: 'text' },
    { id: 'fecha_plantacion', label: 'Fecha de Plantación', type: 'date' },
    { id: 'descripcion', label: 'Descripción', type: 'text' },
    {
      id: 'fk_id_especie',
      label: 'Especie',
      type: 'select',
      options: especieOptions,
    },
    {
      id: 'fk_id_semillero',
      label: 'Semillero',
      type: 'select',
      options: semilleroOptions,
    },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    if (!formData.nombre_cultivo || !formData.fecha_plantacion || !formData.descripcion || !formData.fk_id_especie || !formData.fk_id_semillero) {
      console.error("❌ Todos los campos son obligatorios");
      return;
    }

    const nuevoCultivo: Cultivos = {
      nombre_cultivo: formData.nombre_cultivo.trim(),
      fecha_plantacion: new Date(formData.fecha_plantacion).toISOString().split('T')[0],
      descripcion: formData.descripcion.trim(),
      fk_id_especie: formData.fk_id_especie ,
      fk_id_semillero: formData.fk_id_semillero ,
    };

    console.log("🚀 Enviando cultivo al backend:", nuevoCultivo);

    mutation.mutate(nuevoCultivo, {
      onSuccess: () => {
        console.log("✅ Cultivo creado exitosamente");
        navigate("/cultivo");
      },
      onError: (error) => {
        console.error("❌ Error al crear cultivo:", error);
      },
    });
  };

  if (isLoadingCultivos) {
    return <div className="text-center text-gray-500">Cargando cultivos...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Registra Nuevo Cultivo"
      />
    </div>
  );
};

export default CrearCultivo;
