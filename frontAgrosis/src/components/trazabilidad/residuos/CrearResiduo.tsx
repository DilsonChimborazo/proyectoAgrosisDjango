import { useCrearResiduo } from '@/hooks/trazabilidad/residuo/useCrearResiduo';
import Formulario from '@/components/globales/Formulario';
import { useCultivo } from '@/hooks/trazabilidad/cultivo/useCultivo';
import { useTiposResiduos } from '@/hooks/trazabilidad/tipoResiduo/useTipoResiduo';
import { useState } from 'react';
import CrearCultivo from '../cultivos/CrearCultivos';
import TipoResiduos from '../tiporesiduo/TipoResiduo';
import VentanaModal from '@/components/globales/VentanasModales';
import { showToast } from '@/components/globales/Toast';

interface CrearResiduoProps {
  onSuccess: () => void;
}

const CrearResiduo = ({ onSuccess }: CrearResiduoProps) => {
  const mutation = useCrearResiduo();
  const { data: cultivos = [], isLoading: isLoadingCultivos, refetch: refetchCultivos } = useCultivo();
  const { data: tiposResiduos = [], isLoading: isLoadingTiposResiduos, refetch: refetchTiposResiduos } = useTiposResiduos();

  const [mostrarModalCultivo, setMostrarModalCultivo] = useState(false);
  const [mostrarModalTipoResiduo, setMostrarModalTipoResiduo] = useState(false);

  const cultivosValidos = Array.isArray(cultivos) ? cultivos.filter(c => c?.id) : [];
  const tiposResiduosValidos = Array.isArray(tiposResiduos) ? tiposResiduos.filter(t => t?.id) : [];

  const cultivosUnicos = Array.from(
    new Map(cultivosValidos.map((cultivo) => [cultivo.id, cultivo])).values()
  );

  if (isLoadingCultivos || isLoadingTiposResiduos) {
    return <div className="text-center text-gray-500">Cargando datos de cultivos y tipos de residuos...</div>;
  }

  const formFields = [
    { id: 'nombre', label: 'Nombre del Residuo', type: 'text' },
    { id: 'fecha', label: 'Fecha', type: 'date' },
    { id: 'descripcion', label: 'Descripción', type: 'text' },
    {
      id: 'fk_id_cultivo',
      label: 'Cultivo',
      type: 'select',
      options: cultivosUnicos.map(cultivo => ({ value: String(cultivo.id), label: cultivo.nombre_cultivo })),
      hasExtraButton: true,
      extraButtonText: 'Crear Cultivo',
      onExtraButtonClick: () => setMostrarModalCultivo(true),
    },
    {
      id: 'fk_id_tipo_residuo',
      label: 'Tipo de Residuo',
      type: 'select',
      options: tiposResiduosValidos.map(tipo => ({ value: String(tipo.id), label: tipo.nombre })),
      hasExtraButton: true,
      extraButtonText: 'Crear Tipo de Residuo',
      onExtraButtonClick: () => setMostrarModalTipoResiduo(true),
    },
  ];

  const handleSubmit = (formData: { [key: string]: string | File }) => {
    // Convertimos los valores a string, ya que este formulario solo tiene campos de texto, fecha o select
    const formDataAsStrings = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, typeof value === 'string' ? value : ''])
    ) as { [key: string]: string };

    if (!formDataAsStrings.fecha || !formDataAsStrings.fk_id_cultivo || !formDataAsStrings.fk_id_tipo_residuo) {
      showToast({
        title: 'Error',
        description: 'Todos los campos son obligatorios',
        variant: 'error',
      });
      return;
    }

    const nuevoResiduo = {
      nombre: formDataAsStrings.nombre,
      fecha: new Date(formDataAsStrings.fecha).toISOString().split('T')[0],
      descripcion: formDataAsStrings.descripcion,
      fk_id_cultivo: parseInt(formDataAsStrings.fk_id_cultivo) || 0,
      fk_id_tipo_residuo: parseInt(formDataAsStrings.fk_id_tipo_residuo) || 0,
    };

    mutation.mutate(nuevoResiduo, {
      onSuccess: () => {
        showToast({
          title: 'Éxito',
          description: 'Residuo creado exitosamente',
          variant: 'success',
        });
        onSuccess();
      },
      onError: (error) => {
        showToast({
          title: 'Error',
          description: 'No se pudo crear el residuo',
          variant: 'error',
        });error
      },
    });
  };

  const cerrarYActualizar = async () => {
    setMostrarModalCultivo(false);
    setMostrarModalTipoResiduo(false);
    await refetchCultivos();
    await refetchTiposResiduos();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Registrar Nuevo Residuo"
      />

      <VentanaModal
        isOpen={mostrarModalCultivo}
        onClose={cerrarYActualizar}
        titulo=""
        contenido={<CrearCultivo onSuccess={cerrarYActualizar} />}
      />

      <VentanaModal
        isOpen={mostrarModalTipoResiduo}
        onClose={cerrarYActualizar}
        titulo=""
        contenido={<TipoResiduos onSuccess={cerrarYActualizar} />}
      />
    </div>
  );
};

export default CrearResiduo;