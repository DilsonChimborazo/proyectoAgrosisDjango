import { useState } from "react";
import { useProduccion } from "../../../hooks/finanzas/produccion/useProduccion";
import Tabla from "../../globales/Tabla";
import VentanaModal from "../../globales/VentanasModales";
import { useNavigate } from "react-router-dom";


export interface TipoCultivo {
  id_tipo_cultivo: number;
  nombre: string;
  descripcion: string;
}

export interface Especie {
  id_especie: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  fk_id_tipo_cultivo: TipoCultivo | null;
}

export interface Semillero {
  id_semillero: number;
  nombre_semilla: string;
  fecha_siembra: string;
  fecha_estimada: string;
  cantidad: number;
}

export interface Cultivo {
  id: number;
  fecha_plantacion: string;
  nombre_cultivo: string;
  descripcion: string;
  fk_id_especie: Especie | null;
  fk_id_semillero: Semillero | null;
}


interface Produccion {
  id_produccion: number;
  cantidad_produccion?: number | null; 
  fecha?: string;
  fk_id?: Cultivo | null;
}


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
    openModalHandler(produccion);
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
