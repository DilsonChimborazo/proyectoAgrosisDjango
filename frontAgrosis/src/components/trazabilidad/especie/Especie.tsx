import { useState } from 'react';
import { useEspecie } from '@/hooks/trazabilidad/especie/useEspecie';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import CrearEspecie from './CrearEspecie';
import ActualizarEspecie from './ActualizarEspecie';

interface EspecieTabla {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  tipo_cultivo: string;
}

const ListarEspecie = () => {
  const { data: especies, refetch } = useEspecie();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);
  const [selectedEspecie, setSelectedEspecie] = useState<EspecieTabla | null>(null);

  const handleItemClick = (item: EspecieTabla) => {
    setSelectedEspecie(item);
    setIsDetailModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEspecie(null);
    setModalContenido(null);
    setIsModalOpen(false);
    setIsDetailModalOpen(false);
    setIsUpdateModalOpen(false);
  };

  const handleCreate = () => {
    setModalContenido(
      <CrearEspecie
        onSuccess={() => {
          refetch();
          closeModal();
        }}
      />
    );
    setIsModalOpen(true);
  };

  const handleUpdateClick = (item: EspecieTabla) => {
    setSelectedEspecie(item);
    setModalContenido(
      <ActualizarEspecie
        id={item.id} // Ya es number
        initialValues={{
          nombre_comun: item.nombre_comun,
          nombre_cientifico: item.nombre_cientifico,
          descripcion: item.descripcion,
          fk_id_tipo_cultivo: item.tipo_cultivo.includes('ID: ')
            ? item.tipo_cultivo.replace('ID: ', '') // Extraer el ID si es necesario
            : item.tipo_cultivo, // Asegúrate de que sea un ID válido
        }}
        onSuccess={() => {
          refetch();
          closeModal();
        }}
        onCancel={closeModal}
      />
    );
    setIsUpdateModalOpen(true);
  };

  const tablaData = (especies ?? []).map((especie) => ({
    id: especie.id,
    nombre_comun: especie.nombre_comun || 'Sin nombre',
    nombre_cientifico: especie.nombre_cientifico || 'Sin nombre científico',
    descripcion: especie.descripcion || 'Sin descripción',
    tipo_cultivo:
      typeof especie.fk_id_tipo_cultivo === 'object' && especie.fk_id_tipo_cultivo
        ? especie.fk_id_tipo_cultivo.nombre
        : typeof especie.fk_id_tipo_cultivo === 'number'
        ? `ID: ${especie.fk_id_tipo_cultivo}`
        : 'Sin tipo de cultivo',
  }));

  const headers = ['Nombre Comun', 'Nombre Cientifico', 'Descripcion', 'Tipo Cultivo'];

  return (
    <div className="p-4">
      <VentanaModal isOpen={isModalOpen} onClose={closeModal} titulo="Crear Especie" contenido={modalContenido} />
      
      <VentanaModal
        isOpen={isDetailModalOpen}
        onClose={closeModal}
        titulo="Detalles de la Especie"
        contenido={
          selectedEspecie ? (
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Detalles de la Especie</h2>
              <div className="space-y-3">
                <p>
                  <span className="font-semibold">Nombre Común:</span> {selectedEspecie.nombre_comun}
                </p>
                <p>
                  <span className="font-semibold">Nombre Científico:</span> {selectedEspecie.nombre_cientifico}
                </p>
                <p>
                  <span className="font-semibold">Descripción:</span> {selectedEspecie.descripcion}
                </p>
                <p>
                  <span className="font-semibold">Tipo Cultivo:</span> {selectedEspecie.tipo_cultivo}
                </p>
              </div>
            </div>
          ) : null
        }
      />

      <VentanaModal isOpen={isUpdateModalOpen} onClose={closeModal} titulo="Actualizar Especie" contenido={modalContenido} />

      <Tabla
        title="Lista de Especies"
        headers={headers}
        data={tablaData.length > 0 ? tablaData : []}
        onClickAction={handleItemClick}
        onUpdate={handleUpdateClick}
        onCreate={handleCreate}
        createButtonTitle=""
      />

      {especies?.length === 0 && (
        <div className="text-center text-gray-500 mt-4">No hay especies registradas.</div>
      )}
    </div>
  );
};

export default ListarEspecie;