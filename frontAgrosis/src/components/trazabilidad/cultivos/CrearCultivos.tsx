import { useCrearCultivo } from '@/hooks/trazabilidad/cultivo/useCrearCultivos';
import Formulario from '../../globales/Formulario';
import { useEspecie } from '@/hooks/trazabilidad/especie/useEspecie'; 
import CrearEspecie from '../especie/CrearEspecie';
import { useState } from 'react';
import VentanaModal from '../../globales/VentanasModales';

interface CrearCultivoProps {
  onSuccess: () => void;
}

// Interfaz para los datos enviados al crear un cultivo (POST)
interface CrearCultivoDTO {
  nombre_cultivo: string;
  descripcion: string;
  fk_id_especie: number;
}

const CrearCultivo = ({ onSuccess }: CrearCultivoProps) => {
  const mutation = useCrearCultivo();
  const { data: especies = [], isLoading: isLoadingEspecies, error, refetch } = useEspecie(); // Usar useEspecie
  const [mostrarModalEspecie, setMostrarModalEspecie] = useState(false);

  // Depuración: Mostrar las especies en consola para verificar los datos
  console.log('Especies obtenidas:', especies);

  // Formatear opciones para el select de especies
  const especieOptions = especies.map((especie) => ({
    value: especie.id.toString(),
    label: especie.nombre_comun || 'Sin nombre',
  }));

  // Depuración: Mostrar las opciones del selector
  console.log('Opciones del selector:', especieOptions);

  // Definir los campos del formulario
  const formFields = [
    { id: 'nombre_cultivo', label: 'Nombre del Cultivo', type: 'text', required: true },
    { id: 'descripcion', label: 'Descripción', type: 'text', required: true },
    {
      id: 'fk_id_especie',
      label: 'Especie',
      type: 'select',
      options:
        especieOptions.length > 0 ? especieOptions : [{ value: '', label: 'No hay especies disponibles' }],
      required: true,
      hasExtraButton: true,
      extraButtonText: 'Crear Especie',
      onExtraButtonClick: () => setMostrarModalEspecie(true),
    },
  ];

  // Manejar el envío del formulario
  const handleSubmit = (formData: { [key: string]: string }) => {
    // Validar campos obligatorios
    if (!formData.nombre_cultivo || !formData.descripcion || !formData.fk_id_especie) {
      console.error('❌ Todos los campos son obligatorios');
      return;
    }

    // Validar que se haya seleccionado una especie válida
    const idEspecie = parseInt(formData.fk_id_especie, 10);
    if (isNaN(idEspecie) || formData.fk_id_especie === '') {
      console.error('❌ Debes seleccionar una especie válida');
      return;
    }

    // Crear el objeto para enviar al backend
    const nuevoCultivo: CrearCultivoDTO = {
      nombre_cultivo: formData.nombre_cultivo.trim(),
      descripcion: formData.descripcion.trim(),
      fk_id_especie: idEspecie,
    };

    // Ejecutar la mutación para crear el cultivo
    mutation.mutate(nuevoCultivo, {
      onSuccess: () => {
        console.log('✅ Cultivo creado exitosamente');
        onSuccess();
      },
      onError: (error: any) => {
        console.error('❌ Error al crear cultivo:', error.message || error);
      },
    });
  };

  // Cerrar el modal y actualizar la lista de especies
  const cerrarYActualizar = async () => {
    setMostrarModalEspecie(false);
    await refetch(); // Refetch de especies
  };

  // Mostrar estado de carga
  if (isLoadingEspecies) {
    return <div className="text-center text-gray-500">Cargando especies...</div>;
  }

  // Mostrar error si la consulta falla
  if (error) {
    return (
      <div className="text-center text-red-500">
        Error al cargar las especies: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Mostrar mensaje si no hay especies disponibles */}
      {especieOptions.length === 0 && (
        <p className="text-red-500 mb-4">
          No hay especies registradas. Por favor, crea una nueva especie.
        </p>
      )}

      {/* Formulario para crear cultivo */}
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Registra Nuevo Cultivo"
      />

      {/* Modal para crear una nueva especie */}
      <VentanaModal
        isOpen={mostrarModalEspecie}
        onClose={cerrarYActualizar}
        titulo=""
        contenido={<CrearEspecie />}
      />
    </div>
  );
};

export default CrearCultivo;