import { useCrearCultivo } from '@/hooks/trazabilidad/cultivo/useCrearCultivos';
import Formulario from '../../globales/Formulario';
import { useEspecie } from '@/hooks/trazabilidad/especie/useEspecie'; 
import CrearEspecie from '../especie/CrearEspecie';
import { useState } from 'react';
import VentanaModal from '../../globales/VentanasModales';

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

  console.log('Especies obtenidas:', especies);

  const especieOptions = especies.map((especie) => ({
    value: especie.id.toString(),
    label: especie.nombre_comun || 'Sin nombre',
  }));

  console.log('Opciones del selector:', especieOptions);

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

  const handleSubmit = (formData: { [key: string]: string }) => {
    if (!formData.nombre_cultivo || !formData.descripcion || !formData.fk_id_especie) {
      console.error('❌ Todos los campos son obligatorios');
      return;
    }

    const idEspecie = parseInt(formData.fk_id_especie, 10);
    if (isNaN(idEspecie) || formData.fk_id_especie === '') {
      console.error('❌ Debes seleccionar una especie válida');
      return;
    }

    const nuevoCultivo: CrearCultivoDTO = {
      nombre_cultivo: formData.nombre_cultivo.trim(),
      descripcion: formData.descripcion.trim(),
      fk_id_especie: idEspecie,
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
    console.log('📌 Cerrando modal y actualizando especies...');
    setMostrarModalEspecie(false);
    await refetch();
  };

  if (isLoadingEspecies) {
    return <div className="text-center text-gray-500">Cargando especies...</div>;
  }

  if (error) {
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
        titulo="Crear Especie"
        contenido={
          <CrearEspecie
            onSuccess={() => {
              console.log('📌 Ejecutando onSuccess desde CrearEspecie');
              cerrarYActualizar();
            }}
            onCancel={cerrarYActualizar}
          />
        }
      />
    </div>
  );
};

export default CrearCultivo;