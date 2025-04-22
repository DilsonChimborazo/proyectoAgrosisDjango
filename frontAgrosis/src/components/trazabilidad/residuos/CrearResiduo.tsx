import { useCrearResiduo } from '@/hooks/trazabilidad/residuo/useCrearResiduo';
import Formulario from '@/components/globales/Formulario';
import { useCultivo } from '@/hooks/trazabilidad/cultivo/useCultivo';
import { useTiposResiduos } from '@/hooks/trazabilidad/tipoResiduo/useTipoResiduo';
import { useState } from 'react';
import CrearCultivo from '../cultivos/CrearCultivos';
import TipoResiduos from '../tiporesiduo/TipoResiduo';
import VentanaModal from '@/components/globales/VentanasModales';

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

  const handleSubmit = (formData: { [key: string]: string }) => {
    if (!formData.fecha || !formData.fk_id_cultivo || !formData.fk_id_tipo_residuo) {
      console.error("❌ Todos los campos son obligatorios");
      return;
    }

    const nuevoResiduo = {
      nombre: formData.nombre,
      fecha: new Date(formData.fecha).toISOString().split('T')[0],
      descripcion: formData.descripcion,
      fk_id_cultivo: parseInt(formData.fk_id_cultivo) || 0,
      fk_id_tipo_residuo: parseInt(formData.fk_id_tipo_residuo) || 0,
    };

    console.log("🚀 Enviando residuo al backend:", nuevoResiduo);

    mutation.mutate(nuevoResiduo, {
      onSuccess: () => {
        console.log("✅ Residuo creado exitosamente");
        onSuccess();
      },
      onError: (error) => {
        console.error("❌ Error al crear residuo:", error);
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

      {/* Modal para crear nuevo cultivo */}
      <VentanaModal
        isOpen={mostrarModalCultivo}
        onClose={cerrarYActualizar}
        titulo=""
        contenido={<CrearCultivo onSuccess={cerrarYActualizar} />}
      />

      {/* Modal para crear nuevo tipo de residuo */}
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
