import { useInsumoCompuesto } from '@/hooks/inventario/insumocompuesto/useInsumoCompuesto';
import Tabla from '@/components/globales/Tabla';
import VentanaModal from '@/components/globales/VentanasModales';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ListarInsumosCompuestos = () => {
  const { data: insumosCompuestos, isLoading, error } = useInsumoCompuesto();
  const [selectedInsumoCompuesto, setSelectedInsumoCompuesto] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleRowClick = (rowData: any) => {
    setSelectedInsumoCompuesto(rowData.original);
    setIsModalOpen(true);
  };
  

  const closeModal = () => {
    setSelectedInsumoCompuesto(null);
    setIsModalOpen(false);
  };

  const handleUpdate = (insumoCompuesto: { id: number }) => {
    navigate(`/ActualizarInsumoCompuesto/${insumoCompuesto.id}`);
  };

  const handleCreate = () => {
    navigate("/CrearInsumoCompuesto");
  };

  // Manejo de la carga de datos
  if (isLoading) return <div className="text-center p-4 text-gray-500">Cargando insumos compuestos...</div>;
  
  // Manejo de error
  if (error) return <div className="text-center p-4 text-red-500">Error al cargar los insumos compuestos: {error.message}</div>;

  // Aseguramos que los datos existan antes de mapear
  const mappedInsumosCompuestos = insumosCompuestos?.length 
  ? insumosCompuestos.map((i) => ({
      id: i.id,
      nombre: i.nombre,
      unidad_medida: i.unidad_medida_info
      ? `${i.unidad_medida_info.nombre_medida} (${i.unidad_medida_info.unidad_base})`
      : 'N/A',    
      cantidad: i.cantidad_insumo || 0,
      original: i  
    }))
  : [];


  return (
    <div className="container mx-auto p-4">
      <Tabla
        title="Insumos Compuestos"
        headers={["ID", "Nombre", "Unidad Medida", "Cantidad"]}
        data={mappedInsumosCompuestos}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear Insumo Compuesto"
      />

      <VentanaModal
        isOpen={isModalOpen}
        onClose={closeModal}
        titulo={`Detalles: ${selectedInsumoCompuesto?.nombre || 'Insumo Compuesto'}`}
        contenido={
          selectedInsumoCompuesto && (
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-xl font-bold">{selectedInsumoCompuesto.nombre}</h3>
                <p className="text-gray-600">
                Unidad de medida: {selectedInsumoCompuesto.unidad_medida_info
                  ? `${selectedInsumoCompuesto.unidad_medida_info.nombre_medida} (${selectedInsumoCompuesto.unidad_medida_info.unidad_base})`
                  : 'No especificada'}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="font-semibold">Precio por unidad:</p>
                <p>{selectedInsumoCompuesto.precio_unidad ? `$${selectedInsumoCompuesto.precio_unidad.toLocaleString()}` : 'No especificado'}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-semibold mb-2">Componentes:</p>
                <ul className="list-disc list-inside space-y-1">
                  {selectedInsumoCompuesto.detalles?.map((detalle: any) => (
                    <li key={detalle.id}>
                      {detalle.insumo?.nombre || 'Insumo desconocido'} - {detalle.cantidad_utilizada} {detalle.insumo?.fk_unidad_medida?.unidad_base || ''}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        }
      />
    </div>
  );
};

export default ListarInsumosCompuestos;
