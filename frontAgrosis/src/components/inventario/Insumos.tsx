import { useEffect, useState } from 'react';
import { useInsumo } from '../../hooks/inventario/herramientas/useInsumo';
import { Insumo } from '../../hooks/inventario/herramientas/useInsumo';
import Tabla from '../globales/Tabla';
import VentanaModal from '../globales/VentanasModales';

const Insumos = () => {
  const { data: insumo, isLoading, error } = useInsumo();
  const [selectedInsumo, setSelectedInsumo] = useState<Insumo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (selectedInsumo) {
      console.log("Insumo seleccionado:", selectedInsumo);
    }
  }, [selectedInsumo]);

  const openModalHandler = (insumo: Insumo) => {
    setSelectedInsumo(insumo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedInsumo(null);
    setIsModalOpen(false);
  };

  const headers = ["ID", "Nombre", "Tipo", "Precio Unidad", "Cantidad", "Unidad de Medida"];

  const handleRowClick = (insumo: Insumo) => {
    openModalHandler(insumo);
  };

  if (isLoading) return <div className="text-gray-500">Cargando insumos...</div>;
  if (error instanceof Error) return <div className="text-red-500">Error al cargar los insumos: {error.message}</div>;

  const InsumoList = Array.isArray(insumo) ? insumo : [];

  const mappedInsumo = Array.isArray(InsumoList)?InsumoList.map(insumo => ({
    id: insumo.id_insumo,
    nombre: insumo.nombre_insumo,
    tipo: insumo.tipo,
    precio_unidad: insumo.precio_unidad,
    cantidad: insumo.cantidad,
    unidad_medida: insumo.unidad_medida,
  }))
  : []; 

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Tabla
        title="Insumos"
        headers={headers}
        data={mappedInsumo}
        onClickAction={handleRowClick}
      />
      {selectedInsumo && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Insumo"
          contenido={selectedInsumo}
        />
      )}
    </div>
  );
};

export default Insumos;