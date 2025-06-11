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

  const handleSubmit = (formData: { [key: string]: string | File | string[] }) => {
    // Función auxiliar para obtener valores como string
    const getStringValue = (value: string | string[] | File): string => {
      if (Array.isArray(value)) return value[0] || "";
      if (value instanceof File) return ""; // No se usa directamente como string, se valida por separado si necesario
      return value || "";
    };

    // Convertir formData a un objeto de strings
    const formDataAsStrings = {
      nombre: getStringValue(formData.nombre),
      fecha: getStringValue(formData.fecha),
      descripcion: getStringValue(formData.descripcion),
      fk_id_cultivo: getStringValue(formData.fk_id_cultivo),
      fk_id_tipo_residuo: getStringValue(formData.fk_id_tipo_residuo),
    };

    // Validaciones
    if (!formDataAsStrings.fecha) {
      showToast({
        title: 'Error',
        description: 'Todos los campos son obligatorios',
        variant: 'error',
      });
      return;
    }
    if (!formDataAsStrings.fk_id_cultivo) {
      showToast({
        title: 'Error',
        description: 'Todos los campos son obligatorios',
        variant: 'error',
      });
      return;
    }
    if (!formDataAsStrings.fk_id_tipo_residuo) {
      showToast({
        title: 'Error',
        description: 'Todos los campos son obligatorios',
        variant: 'error',
      });
      return;
    }

    const idCultivo = parseInt(formDataAsStrings.fk_id_cultivo, 10);
    const idTipoResiduo = parseInt(formDataAsStrings.fk_id_tipo_residuo, 10);
    if (isNaN(idCultivo) || formDataAsStrings.fk_id_cultivo === '') {
      showToast({
        title: 'Error',
        description: 'Debes seleccionar un cultivo válido',
        variant: 'error',
      });
      return;
    }
    if (isNaN(idTipoResiduo) || formDataAsStrings.fk_id_tipo_residuo === '') {
      showToast({
        title: 'Error',
        description: 'Debes seleccionar un tipo de residuo válido',
        variant: 'error',
      });
      return;
    }

    const nuevoResiduo = {
      nombre: formDataAsStrings.nombre,
      fecha: new Date(formDataAsStrings.fecha).toISOString().split('T')[0],
      descripcion: formDataAsStrings.descripcion,
      fk_id_cultivo: idCultivo,
      fk_id_tipo_residuo: idTipoResiduo,
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