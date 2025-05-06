
import { useCrearCultivo } from '@/hooks/trazabilidad/cultivo/useCrearCultivos';
import Formulario from '../../globales/Formulario';
import { useCultivo } from '@/hooks/trazabilidad/cultivo/useCultivo';
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
  const { data: cultivos = [], isLoading: isLoadingCultivos, refetch } = useCultivo();
  const [mostrarModalEspecie, setMostrarModalEspecie] = useState(false);

  const especiesUnicas = Array.from(
    new Map(cultivos.map((cultivo) => [cultivo.fk_id_especie.id, cultivo.fk_id_especie])).values()
  );

  const especieOptions = especiesUnicas.map((especie) => ({

    value: especie.id.toString(),
    label: especie.nombre_comun || 'Sin nombre',
  }));

  const formFields = [
    { id: 'nombre_cultivo', label: 'Nombre del Cultivo', type: 'text' },
    { id: 'descripcion', label: 'Descripción', type: 'text' },
    {
      id: 'fk_id_especie',
      label: 'Especie',
      type: 'select',
      options: especieOptions.length > 0 ? especieOptions : [{ value: '', label: 'No hay especies disponibles' }],
      hasExtraButton: true,
      extraButtonText: 'Crear Especie',
      onExtraButtonClick: () => setMostrarModalEspecie(true),
    },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    if (!formData.nombre_cultivo || !formData.descripcion || !formData.fk_id_especie) {
      console.error('❌ Todos los campos son obligatorios');
      return;
    }

    if (formData.fk_id_especie === '') {
      console.error('❌ Debes seleccionar una especie válida');
      return;
    }

    const nuevoCultivo: CrearCultivoDTO = {
      nombre_cultivo: formData.nombre_cultivo.trim(),
      descripcion: formData.descripcion.trim(),
      fk_id_especie: parseInt(formData.fk_id_especie, 10),
    };

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

  const cerrarYActualizar = async () => {
    setMostrarModalEspecie(false);
    await refetch();
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