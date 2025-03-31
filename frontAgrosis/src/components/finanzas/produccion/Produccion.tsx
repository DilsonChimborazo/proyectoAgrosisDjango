import { useState } from "react";
import { useProduccion } from "../../../hooks/finanzas/produccion/useProduccion";
import Tabla from "../../globales/Tabla";
import VentanaModal from "../../globales/VentanasModales";
import { useNavigate } from "react-router-dom";
import { Produccion } from "../../../hooks/finanzas/produccion/useProduccion";

const ProduccionComponent = () => {
  const navigate = useNavigate();
  const { data: producciones, isLoading, error } = useProduccion();
  const [selectedProduccion, setSelectedProduccion] = useState<Produccion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalHandler = (produccion: Produccion) => {
    setSelectedProduccion(produccion);
    setIsModalOpen(true);
  };

  const handleRowClick = (produccion: { id_produccion: number }) => {
    // Encontrar la producción completa usando el id_produccion
    const produccionCompleta = produccionList.find(
      (p) => p.id_produccion === produccion.id_produccion
    );

    if (produccionCompleta) {
      openModalHandler(produccionCompleta); // Pasar la producción completa a la ventana modal
    } else {
      console.error("❌ No se encontró la producción completa.");
    }
  };

  const closeModal = () => {
    setSelectedProduccion(null);
    setIsModalOpen(false);
  };

  const handleUpdate = (cultivo: { id_produccion: number }) => {
    navigate(`/actualizarproduccion/${cultivo.id_produccion}`);
  };

  const handleCreate = () => {
    navigate("/Registrar-Producción");
  };

  if (isLoading) return <div className="text-center text-gray-500">Cargando producciones...</div>;
  if (error instanceof Error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  // Mapeo de los datos para la tabla
  const produccionList: Produccion[] = Array.isArray(producciones) ? producciones : [];
  const mappedProducciones = produccionList.map((produccion) => ({
    id_produccion: produccion.id_produccion,
    cantidad_producción: produccion.cantidad_produccion ?? null,
    fecha_producción: produccion.fecha ?? "No disponible",
    nombre_cultivo: produccion.fk_id?.nombre_cultivo ?? "No disponible",
    fecha_plantación: produccion.fk_id?.fecha_plantacion ?? "No disponible"
  }));

  const headers = ["ID Produccion", "Cantidad Producción", "Fecha Producción", "Nombre Cultivo", "Fecha Plantación"];


  return (
    <div className="mx-auto p-4">
      <Tabla 
        title="Lista de Producciones" 
        headers={headers} 
        data={mappedProducciones} 
        onClickAction={handleRowClick} 
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
      />

      {selectedProduccion && (
        <VentanaModal isOpen={isModalOpen} onClose={closeModal} titulo="Detalles de Producción" contenido={selectedProduccion} />
      )}
    </div>
  );
};

export default ProduccionComponent;
