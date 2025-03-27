import { Especie } from '@/hooks/trazabilidad/especie/useCrearEspecie';
import Formulario from '../../globales/Formulario';
import { useCrearEspecie } from '@/hooks/trazabilidad/especie/useCrearEspecie'; 
import { useNavigate } from 'react-router-dom';
import { useEspecie } from '@/hooks/trazabilidad/especie/useEspecie';

const CrearEspecie = () => {
  const mutation = useCrearEspecie(); // Hook para manejar la creación
  const { data: especies = [], isLoading: isLoadingCultivo } = useEspecie(); // Hook para obtener las especies
  const navigate = useNavigate();

  // Mapeo de opciones para el select de tipo de cultivo
  const tipoCultivoOptions = especies
    .filter((especie) => especie.fk_id_tipo_cultivo) // Filtrar especies con fk_id_tipo_cultivo válido
    .map((especie) => ({
      value: especie.fk_id_tipo_cultivo?.nombre || '', // Asegurar que value sea un string válido
      label: especie.fk_id_tipo_cultivo?.nombre || 'Sin Nombre', // Asegurar que label sea un string válido
    }));

  // Definición de los campos del formulario
  const formFields = [
    { id: 'nombre_comun', label: 'Nombre Común', type: 'text' },
    { id: 'nombre_cientifico', label: 'Nombre Científico', type: 'text' },
    { id: 'descripcion', label: 'Descripción', type: 'text' },
    {
      id: 'fk_id_tipo_cultivo',
      label: 'Tipo de Cultivo',
      type: 'select',
      options: tipoCultivoOptions, // Opciones dinámicas mapeadas desde el hook
    },
  ];

  // Manejo del formulario
  const handleSubmit = (formData: { [key: string]: string }) => {
    if (
      !formData.nombre_comun ||
      !formData.nombre_cientifico ||
      !formData.descripcion ||
      !formData.fk_id_tipo_cultivo
    ) {
      console.error("❌ Todos los campos son obligatorios");
      return;
    }

    const nuevaEspecie: Especie = {
      id: 0, // Se define como 0 porque se genera automáticamente en el backend
      nombre_comun: formData.nombre_comun.trim(),
      nombre_cientifico: formData.nombre_cientifico.trim(),
      descripcion: formData.descripcion.trim(),
      fk_id_tipo_cultivo:formData.fk_id_tipo_cultivo// Relación con tipo de cultivo
    };

    console.log("🚀 Enviando especie al backend:", nuevaEspecie);

    // Llamada al hook para enviar datos al backend
    mutation.mutate(nuevaEspecie, {
      onSuccess: () => {
        console.log("✅ Especie creada exitosamente");
        navigate("/especies"); // Redirigir al listado de especies
      },
      onError: (error) => {
        console.error("❌ Error al crear especie:", error);
      },
    });
  };

  if (isLoadingCultivo) {
    return <div className="text-center text-gray-500">Cargando tipos de cultivo...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Registrar Nueva Especie"
      />
    </div>
  );
};

export default CrearEspecie;