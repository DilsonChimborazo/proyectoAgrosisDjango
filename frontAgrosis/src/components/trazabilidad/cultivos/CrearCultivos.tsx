import { Cultivos } from '@/hooks/trazabilidad/cultivo/useCrearCultivos';
import { useCrearCultivo } from '@/hooks/trazabilidad/cultivo/useCrearCultivos';
import Formulario from '../../globales/Formulario';
import { useCultivo } from '@/hooks/trazabilidad/cultivo/useCultivo';
import CrearEspecie from '../especie/CrearEspecie';
import { useState } from 'react';
import VentanaModal from '../../globales/VentanasModales';


interface CrearCultivoProps {
  onSuccess: () => void;
}


const CrearCultivo = ({ onSuccess }: CrearCultivoProps) => {
  const mutation = useCrearCultivo();
  const { data: cultivos = [], isLoading: isLoadingCultivos, refetch } = useCultivo();


  const [mostrarModalEspecie, setMostrarModalEspecie] = useState(false);


  // Obtener especies únicas
  const especiesUnicas = Array.from(new Map(
    cultivos.map((cultivo) => [cultivo.fk_id_especie?.id, cultivo.fk_id_especie])
  ).values()).filter(especie => especie !== null);


  const especieOptions = especiesUnicas.map((especie) => ({
    value: especie.id,
    label: especie.nombre_comun,
  }));

  // Definición de los campos del formulario

  const formFields = [
    { id: 'nombre_cultivo', label: 'Nombre del Cultivo', type: 'text' },
    { id: 'descripcion', label: 'Descripción', type: 'text' },
    {
      id: 'fk_id_especie',
      label: 'Especie',
      type: 'select',
      options: especieOptions,
      hasExtraButton: true,
      extraButtonText: 'Crear Especie',
      onExtraButtonClick: () => setMostrarModalEspecie(true),
    }
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    // Validar campos obligatorios
    if (
      !formData.nombre_cultivo ||
      !formData.descripcion ||
      !formData.fk_id_especie 

    ) {
      console.error("❌ Todos los campos obligatorios deben estar llenos");
      return;
    }

    const nuevoCultivo: Cultivos = {
      nombre_cultivo: formData.nombre_cultivo.trim(),
      descripcion: formData.descripcion.trim(),
      fk_id_especie: parseInt(formData.fk_id_especie),

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