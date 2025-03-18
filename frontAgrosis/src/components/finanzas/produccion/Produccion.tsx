import { useState } from "react";
import { useProduccion } from "../../../hooks/finanzas/produccion/useProduccion";
import Tabla from "../../globales/Tabla";
import VentanaModal from "../../globales/VentanasModales";
import Button from "@/components/globales/Button";
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

  const closeModal = () => {
    setSelectedProduccion(null);
    setIsModalOpen(false);
  };

  if (isLoading) return <div className="text-center text-gray-500">Cargando producciones...</div>;
  if (error instanceof Error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  // Mapeo de los datos para la tabla
  const produccionList: Produccion[] = Array.isArray(producciones) ? producciones : [];
  const mappedProducciones = produccionList.map((produccion) => ({
    id_produccion: produccion.id_produccion,
    cantidad_produccion: produccion.cantidad_produccion ?? null,
    fecha_produccion: produccion.fecha ?? "No disponible",
    nombre_cultivo: produccion.fk_id?.nombre_cultivo ?? "No disponible",
    fecha_plantacion: produccion.fk_id?.fecha_plantacion ?? "No disponible",
    acciones: (
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded"
        onClick={() => navigate(`/actualizarproduccion/${produccion.id_produccion}`)}
      >
        Editar
      </button>
    ),
  }));

  const headers = ["ID Producción", "Cantidad Producción", "Fecha Producción", "Cultivo", "Fecha Plantación", "Acciones"];

  return (
    <div className="mx-auto p-4">
      <Button text="Registrar Producción" onClick={() => navigate("/Registrar-Producción")} variant="success" />

      <Tabla title="Lista de Producciones" headers={headers} data={mappedProducciones} onClickAction={openModalHandler} />

      {selectedProduccion && (
        <VentanaModal isOpen={isModalOpen} onClose={closeModal} titulo="Detalles de Producción" contenido={selectedProduccion} />
      )}
    </div>
  );
};

export default ProduccionComponent;
