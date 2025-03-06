import { useState } from 'react';
import { useEras } from '../../hooks/iot/useEras';
import Tabla from '../globales/Tabla';
import VentanaModal from '../globales/VentanasModales';

const Eras = () => {
const { data: eras, isLoading, error } = useEras();
const [selectedLote, setSelectedLote] = useState<object | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);

const openModalHandler = (eras: object) => {
    setSelectedLote(eras);
    setIsModalOpen(true);
};

const closeModal = () => {
    setSelectedLote(null);
    setIsModalOpen(false);
};

const headers = ['ID', 'Descripcion', 'Nombre Lote'];

const handleRowClick = (eras: object) => {
    openModalHandler(eras);
};

if (isLoading) return <div>Cargando lotes...</div>;
if (error instanceof Error) return <div>Error al cargar los lotes: {error.message}</div>;

const erasList = Array.isArray(eras) ? eras : [];

const mappedEras = erasList.map((eras) => ({
    id: eras.id,
    descripcion: eras.descripcion,
    lote: eras.fk_id_lote && eras.fk_id_lote.nombre_lote ? eras.fk_id_lote.nombre_lote : 'Sin nombre de lote',
}));




return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
    <Tabla
        title="Eras"
        headers={headers}
        data={mappedEras}
        onClickAction={handleRowClick}
    />
    {selectedLote && (
        <VentanaModal
            isOpen={isModalOpen}
            onClose={closeModal}
            titulo="Detalles del Lote"
            contenido={selectedLote} 
        />
    )}
    </div>
    );
};

export default Eras;
