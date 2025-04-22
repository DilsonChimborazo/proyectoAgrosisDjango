import { Cultivos } from '@/hooks/trazabilidad/cultivo/useCrearCultivos';
import { useCrearCultivo } from '@/hooks/trazabilidad/cultivo/useCrearCultivos';
import Formulario from '../../globales/Formulario';
import { useCultivo } from '@/hooks/trazabilidad/cultivo/useCultivo';
import CrearEspecie from '../especie/CrearEspecie';
import CrearSemillero from '../semillero/CrearSemillero';
import { useState } from 'react';
import VentanaModal from '../../globales/VentanasModales';

interface CrearCultivoProps {
  onSuccess: () => void;
}


const CrearCultivo = ({ onSuccess }: CrearCultivoProps) => {
  const mutation = useCrearCultivo();
  const { data: cultivos = [], isLoading: isLoadingCultivos, refetch } = useCultivo();

  const [mostrarModalEspecie, setMostrarModalEspecie] = useState(false);
  const [mostrarModalSemillero, setMostrarModalSemillero] = useState(false);

  const especiesUnicas = Array.from(
    new Map(cultivos.map((cultivo) => [cultivo.fk_id_especie.id, cultivo.fk_id_especie])).values()
  );

  const semillerosUnicos = Array.from(
    new Map(cultivos.map((cultivo) => [cultivo.fk_id_semillero.id, cultivo.fk_id_semillero])).values()
  );

  const especieOptions = especiesUnicas.map((especie) => ({
    value: especie.id,
    label: especie.nombre_comun,
  }));

  const semilleroOptions = semillerosUnicos.map((semillero) => ({
    value: semillero.id,
    label: semillero.nombre_semilla,
  }));

  const formFields = [
    { id: 'nombre_cultivo', label: 'Nombre del Cultivo', type: 'text' },
    { id: 'fecha_plantacion', label: 'Fecha de Plantación', type: 'date' },
    { id: 'descripcion', label: 'Descripción', type: 'text' },
    {
      id: 'fk_id_especie',
      label: 'Especie',
      type: 'select',
      options: especieOptions,
      hasExtraButton: true,
      extraButtonText: 'Crear Especie',
      onExtraButtonClick: () => setMostrarModalEspecie(true),
    },
    {
      id: 'fk_id_semillero',
      label: 'Semillero',
      type: 'select',
      options: semilleroOptions,
      hasExtraButton: true,
      extraButtonText: 'Crear Semillero',
      onExtraButtonClick: () => setMostrarModalSemillero(true),
    },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    if (
      !formData.nombre_cultivo ||
      !formData.fecha_plantacion ||
      !formData.descripcion ||
      !formData.fk_id_especie ||
      !formData.fk_id_semillero
    ) {
      console.error("❌ Todos los campos son obligatorios");
      return;
    }

    const nuevoCultivo: Cultivos = {
      nombre_cultivo: formData.nombre_cultivo.trim(),
      fecha_plantacion: new Date(formData.fecha_plantacion).toISOString().split('T')[0],
      descripcion: formData.descripcion.trim(),
      fk_id_especie: parseInt(formData.fk_id_especie),
      fk_id_semillero: parseInt(formData.fk_id_semillero),
    };

    mutation.mutate(nuevoCultivo, {
      onSuccess: () => {
        console.log("✅ Cultivo creado exitosamente");
        onSuccess();
      },
      onError: (error) => {
        console.error("❌ Error al crear cultivo:", error);
      },
    });
  };

  const cerrarYActualizar = async () => {
    setMostrarModalEspecie(false);
    setMostrarModalSemillero(false);
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

      {/* VentanaModal para crear nuevo semillero */}
      <VentanaModal
        isOpen={mostrarModalSemillero}
        onClose={cerrarYActualizar}
        titulo=""
        contenido={<CrearSemillero />}
      />
    </div>
  );
};

export default CrearCultivo;
