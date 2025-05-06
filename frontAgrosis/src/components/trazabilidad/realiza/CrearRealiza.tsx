import { useState, useMemo } from 'react';
import { useCrearRealiza, CrearRealizaDTO } from '@/hooks/trazabilidad/realiza/useCrearRealiza';
import { useCultivo, Cultivos } from '@/hooks/trazabilidad/cultivo/useCultivo';
import { useActividad, Actividad } from '@/hooks/trazabilidad/actividad/useActividad';
import Formulario from '../../globales/Formulario';

interface CrearRealizaProps {
  onSuccess: () => void;
}

const CrearRealiza = ({ onSuccess }: CrearRealizaProps) => {
  const mutation = useCrearRealiza();
  const { data: cultivos = [], isLoading: isLoadingCultivos, error: errorCultivos } = useCultivo();
  const { data: actividades = [], isLoading: isLoadingActividades, error: errorActividades } = useActividad();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cultivoOptions = useMemo(() => {
    return cultivos.map((cultivo: Cultivos) => ({
      value: cultivo.id.toString(),
      label: cultivo.nombre_cultivo || 'Sin nombre',
    }));
  }, [cultivos]);

  const actividadOptions = useMemo(() => {
    return actividades.map((actividad: Actividad) => ({
      value: actividad.id.toString(),
      label: actividad.nombre_actividad || 'Sin nombre',
    }));
  }, [actividades]);

  const formFields = [
    {
      id: 'fk_id_cultivo',
      label: 'Cultivo',
      type: 'select',
      options: cultivoOptions.length > 0 ? cultivoOptions : [{ value: '', label: 'No hay cultivos disponibles' }],
      placeholder: 'Seleccione un cultivo',
    },
    {
      id: 'fk_id_actividad',
      label: 'Actividad',
      type: 'select',
      options: actividadOptions.length > 0 ? actividadOptions : [{ value: '', label: 'No hay actividades disponibles' }],
      placeholder: 'Seleccione una actividad',
    },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    setErrorMessage(null);

    const { fk_id_cultivo, fk_id_actividad } = formData;

    if (!fk_id_cultivo || !fk_id_actividad) {
      setErrorMessage('❌ Ambos campos son obligatorios');
      return;
    }

    if (fk_id_cultivo === '' || fk_id_actividad === '') {
      setErrorMessage('❌ Debes seleccionar un cultivo y una actividad válidos');
      return;
    }

    const nuevoRealiza: CrearRealizaDTO = {
      fk_id_cultivo: parseInt(fk_id_cultivo, 10),
      fk_id_actividad: parseInt(fk_id_actividad, 10),
    };

    mutation.mutate(nuevoRealiza, {
      onSuccess: () => {
        console.log('✅ Realiza creado exitosamente');
        onSuccess();
      },
      onError: (error: any) => {
        setErrorMessage(`❌ Error al crear realiza: ${error.message || 'Error desconocido'}`);
      },
    });
  };

  if (errorCultivos || errorActividades) {
    return <div className="text-center text-red-500">Error al cargar cultivos o actividades</div>;
  }

  if (isLoadingCultivos || isLoadingActividades) {
    return <div className="text-center text-gray-500">Cargando cultivos y actividades...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {errorMessage && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errorMessage}</div>}
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Crear Nuevo Realiza"
      />
    </div>
  );
};

export default CrearRealiza;