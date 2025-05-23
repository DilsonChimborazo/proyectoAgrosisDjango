import { useCrearCultivo } from '@/hooks/trazabilidad/cultivo/useCrearCultivos';
import Formulario from '../../globales/Formulario';
import { useEspecie } from '@/hooks/trazabilidad/especie/useEspecie'; 
import CrearEspecie from '../especie/CrearEspecie';
import { useState } from 'react';
import VentanaModal from '../../globales/VentanasModales';
import { showToast } from '@/components/globales/Toast';

interface CrearCultivoProps {
  onSuccess: () => void;
}

interface CrearCultivoDTO {
  nombre_cultivo: string;
  descripcion: string;
  fk_id_especie: number;
}

const CrearCultivo = ({ onSuccess }: CrearCultivoProps) => {
  const mutation = useCrearCultivo();
  const { data: especies = [], isLoading: isLoadingEspecies, error, refetch } = useEspecie();
  const [mostrarModalEspecie, setMostrarModalEspecie] = useState(false);

  const especieOptions = especies.map((especie) => ({
    value: especie.id.toString(),
    label: especie.nombre_comun || 'Sin nombre',
  }));

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

  const handleSubmit = (formData: { [key: string]: string | File }) => {
    // Convertimos los valores a string, ya que sabemos que este formulario solo tiene campos de texto o select
    const formDataAsStrings = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, typeof value === 'string' ? value : ''])
    ) as { [key: string]: string };

    if (!formDataAsStrings.nombre_cultivo || !formDataAsStrings.descripcion || !formDataAsStrings.fk_id_especie) {
      showToast({
        title: 'Error',
        description: 'Todos los campos son obligatorios',
        variant: 'error',
      });
      return;
    }

    const idEspecie = parseInt(formDataAsStrings.fk_id_especie, 10);
    if (isNaN(idEspecie) || formDataAsStrings.fk_id_especie === '') {
      showToast({
        title: 'Error',
        description: 'Debes seleccionar una especie válida',
        variant: 'error',
      });
      return;
    }

    const nuevoCultivo: CrearCultivoDTO = {
      nombre_cultivo: formDataAsStrings.nombre_cultivo.trim(),
      descripcion: formDataAsStrings.descripcion.trim(),
      fk_id_especie: idEspecie,
    };

    mutation.mutate(nuevoCultivo, {
      onSuccess: () => {
        showToast({
          title: 'Éxito',
          description: 'Cultivo creado exitosamente',
          variant: 'success',
        });
        onSuccess();
      },
      onError: (error: any) => {
        showToast({
          title: 'Error',
          description: 'No se pudo crear el cultivo',
          variant: 'error',
        });error
      },
    });
  };

  const cerrarYActualizar = async () => {
    setMostrarModalEspecie(false);
    await refetch();
  };

  if (isLoadingEspecies) {
    return <div className="text-center text-gray-500">Cargando especies...</div>;
  }

  if (error) {
    showToast({
      title: 'Error',
      description: `Error al cargar las especies: ${error.message}`,
      variant: 'error',
    });
    return (
      <div className="text-center text-red-500">
        Error al cargar las especies: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {especieOptions.length === 0 && (
        <p className="text-red-500 mb-4">
          No hay especies registradas. Por favor, crea una nueva especie.
        </p>
      )}

      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Registra Nuevo Cultivo"
      />

      <VentanaModal
        isOpen={mostrarModalEspecie}
        onClose={cerrarYActualizar}
        titulo=""
        contenido={
          <CrearEspecie
            onSuccess={cerrarYActualizar}
            onCancel={cerrarYActualizar}
          />
        }
      />
    </div>
  );
};

export default CrearCultivo;