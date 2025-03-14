import { useState } from 'react';
import { useGenera } from '../../../hooks/finanzas/produccion/useGenera';
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';
import Button from "@/components/globales/Button";
import { useNavigate } from "react-router-dom";

const GeneraComponent = () => {
  const navigate = useNavigate();
  const { data: genera, error, isLoading } = useGenera();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenera, setSelectedGenera] = useState<any>(null);

  const openModal = (generaItem: any) => {
    setSelectedGenera(generaItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGenera(null);
  };

  if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;
  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  // Mapeo de los datos para la tabla
  const tablaData = Array.isArray(genera)
    ? genera.map(item => ({
        id: item.id_genera,
        cultivo: item.fk_id_cultivo?.nombre_cultivo ?? "No disponible",
        fecha_plantacion: item.fk_id_cultivo?.fecha_plantacion ?? "No disponible",
        cantidad_produccion: item.fk_id_produccion?.cantidad_produccion?.toString() ?? "No disponible",
        fecha_produccion: item.fk_id_produccion?.fecha ?? "No disponible",
      }))
    : [];

  const headers = ["ID", "Cultivo", "Fecha Plantación", "Cantidad Producción", "Fecha Producción"];

  return (
    <div className="mx-auto p-4">
      <Button 
        text="Registrar Producción" 
        onClick={() => navigate("/Registrar-Producción")} 
        variant="success" 
      />

      <Tabla 
        title="Lista de producciones" 
        headers={headers} 
        data={tablaData} 
        onClickAction={openModal}
      />

      {selectedGenera && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles de la produccion"
          contenido={selectedGenera}
        />
      )}
    </div>
  );
};

export default GeneraComponent;
