import { useState } from 'react';
import { useProduccion } from '../../../hooks/finanzas/produccion/useProduccion';
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';
import { useNavigate } from "react-router-dom";
import Button from '@/components/globales/Button';

interface ProduccionComponentProps {
  showButtons?: boolean;
}

const ProduccionComponent = ({ showButtons = true }: ProduccionComponentProps) => {
  const navigate = useNavigate();
  const { data: producciones, isLoading, error } = useProduccion();
  const [selectedProduccion, setSelectedProduccion] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log('Producciones:', producciones);

  const openModalHandler = (produccion: any) => {
    setSelectedProduccion(produccion);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduccion(null);
    setIsModalOpen(false);
  };

  const handleRowClick = (produccion: any) => {
    openModalHandler(produccion);
  };

  const handleUpdate = (produccion: any) => {
    navigate(`/actualizarproduccion/${produccion.id}`);
  };

  const handleCreate = () => {
    navigate("/Registrar-Produccion");
  };

  if (isLoading) return <div className="text-center text-gray-500 py-4">Cargando producciones...</div>;
  if (error) return <div className="text-center text-red-500 py-4">Error al cargar los datos: {error.message}</div>;

  const produccionesList = Array.isArray(producciones) ? producciones : [];
  const mappedProducciones = produccionesList.map((produccion) => ({
    id: produccion.id,
    nombre_producción: produccion.nombre_produccion,
    fecha: new Date(produccion.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    cantidad_producida: Number(produccion.cantidad_producida).toFixed(0),
    unidad_medida: produccion.fk_unidad_medida?.nombre_medida ?? 'No disponible',
    stock_disponible: Number(produccion.stock_disponible).toFixed(2),
    precio_sugerido: produccion.precio_sugerido_venta !== null ? `$${Number(produccion.precio_sugerido_venta).toFixed(2)}` : 'N/A',
  }));

  const headers = [
    "Nombre Producción", "Fecha", "Cantidad Producida", "Unidad Medida",
    "Stock Disponible", "Precio Sugerido"
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      {showButtons && (
        <div className="flex gap-4">
          <Button text="Registrar Producción" onClick={handleCreate} variant="green" />
        </div>
      )}
      {mappedProducciones.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No hay producciones registradas.</p>
      ) : (
        <Tabla
          title=""
          headers={headers}
          data={mappedProducciones}
          onClickAction={handleRowClick}
          onUpdate={handleUpdate}
          showCreateButton={false}
          rowClassName={() => "hover:bg-green-50 transition-colors duration-150"}
          className="[&_table]:w-full [&_th]:py-2 [&_th]:bg-green-700 [&_th]:text-white [&_th]:font-bold [&_th]:text-sm [&_th:first-child]:rounded-tl-lg [&_th:last-child]:rounded-tr-lg [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm"
        />
      )}
      {selectedProduccion && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles de Producción"
          contenido={
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Nombre:</strong> {selectedProduccion.nombre_produccion}</p>
              <p><strong>Fecha:</strong> {new Date(selectedProduccion.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
              <p><strong>Cantidad Producida:</strong> {Number(selectedProduccion.cantidad_producida).toFixed(3)} {selectedProduccion.fk_unidad_medida?.nombre_medida ?? 'N/A'}</p>
              <p><strong>Unidad Medida:</strong> {selectedProduccion.fk_unidad_medida?.nombre_medida ?? 'No disponible'}</p>
              <p><strong>Stock Disponible:</strong> {Number(selectedProduccion.stock_disponible).toFixed(0)}</p>
              <p><strong>Precio Sugerido:</strong> {selectedProduccion.precio_sugerido_venta !== null ? `$${Number(selectedProduccion.precio_sugerido_venta).toFixed(2)}` : 'N/A'}</p>
            </div>
          }
          size="md"
          className="bg-white rounded-lg shadow-md max-w-lg mx-auto"
        />
      )}
    </div>
  );
};

export default ProduccionComponent;