import { useState, useEffect } from 'react';
import { useEspecie } from '@/hooks/trazabilidad/especie/useEspecie';
import VentanaModal from '../../globales/VentanasModales';
import CrearEspecie from './CrearEspecie';
import Tabla from '../../globales/Tabla';

interface EspecieTabla {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  tipo_cultivo: string;
}

const ListarEspecie = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);

  const { data: especies, isLoading, error, refetch, isFetching } = useEspecie();

  useEffect(() => {
    console.log("📊 Especies data received in ListarEspecie:", especies);
    refetch();
  }, [refetch]);

  const handleCreateEspecie = () => {
    setModalContenido(
      <CrearEspecie
        onSuccess={() => {
          console.log("✅ Triggering refetch after creating Especie");
          refetch();
          closeModal();
        }}
        onCancel={closeModal}
      />
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContenido(null);
  };

  const tablaData: EspecieTabla[] = (especies ?? []).map((especie) => {
    const tipoCultivoNombre = typeof especie.fk_id_tipo_cultivo === 'object' && especie.fk_id_tipo_cultivo
      ? (especie.fk_id_tipo_cultivo as any).nombre
      : typeof especie.fk_id_tipo_cultivo === 'number'
      ? `ID: ${especie.fk_id_tipo_cultivo}`
      : 'Sin tipo de cultivo';
    return {
      id: especie.id,
      nombre_comun: especie.nombre_comun,
      nombre_cientifico: especie.nombre_cientifico,
      descripcion: especie.descripcion || 'Sin descripción',
      tipo_cultivo: tipoCultivoNombre,
    };
  });

  console.log("📋 Tabla data for rendering:", tablaData);

  const headers = [
    'ID',
    'Nombre Comun',
    'Nombre Cientifico',
    'Descripcion',
    'Tipo Cultivo',
  ];

  const renderRow = (item: EspecieTabla) => (
    <tr key={item.id} className="hover:bg-gray-100">
      <td className="p-3">{item.id}</td>
      <td className="p-3">{item.nombre_comun}</td>
      <td className="p-3">{item.nombre_cientifico}</td>
      <td className="p-3">{item.descripcion}</td>
      <td className="p-3">{item.tipo_cultivo}</td>
    </tr>
  );

  if (isLoading || isFetching) {
    return <div className="text-center text-gray-500">Cargando especies...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error al cargar especies: {error.message || 'Por favor, intenta de nuevo.'}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <VentanaModal isOpen={isModalOpen} onClose={closeModal} titulo="" contenido={modalContenido} />
      <div className="bg-white rounded-lg shadow p-6">
        <Tabla
          title="Lista de Especies"
          headers={headers}
          data={tablaData}
          onCreate={handleCreateEspecie}
          createButtonTitle="Crear Especie"
          renderRow={renderRow}
        />
        {tablaData.length === 0 && (
          <div className="text-center text-gray-500 mt-4">No hay especies para mostrar.</div>
        )}
      </div>
    </div>
  );
};

export default ListarEspecie;