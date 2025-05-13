import { useState } from 'react';
import { useSemilleros, Semillero } from '../../../hooks/trazabilidad/semillero/useSemilleros';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import CrearSemillero from '../semillero/CrearSemillero';

const DetalleSemilleroModal = ({ item }: { item: Semillero }) => {
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Detalles del Semillero</h2>
            
            <div className="space-y-3">
                <p><span className="font-semibold">Nombre:</span> {item.nombre_semilla || 'Sin nombre'}</p>
                <p><span className="font-semibold">Fecha de Siembra:</span> {item.fecha_siembra ? new Date(item.fecha_siembra).toLocaleDateString('es-ES') : 'Sin fecha'}</p>
                <p><span className="font-semibold">Fecha Estimada:</span> {item.fecha_estimada ? new Date(item.fecha_estimada).toLocaleDateString('es-ES') : 'Sin fecha'}</p>
                <p><span className="font-semibold">Cantidad:</span> {item.cantidad || 'No especificada'}</p>
            </div>
        </div>
    );
};

const ListarSemillero = () => {
    const { data: semilleros, error, isLoading, refetch: refetchSemilleros } = useSemilleros();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedSemillero, setSelectedSemillero] = useState<Semillero | null>(null);
    const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);

    const handleItemClick = (item: Semillero) => {
        setSelectedSemillero(item);
        setIsDetailModalOpen(true);
    };

    const closeModal = () => {
        setSelectedSemillero(null);
        setModalContenido(null);
        setIsModalOpen(false);
        setIsDetailModalOpen(false);
    };

    const handleCreate = () => {
        setModalContenido(<CrearSemillero 
            onSuccess={() => {
                refetchSemilleros();
                closeModal();
            }}
        />);
        setIsModalOpen(true); 
    };

    const tablaData = (semilleros ?? []).map((semillero) => ({
        id: semillero.id,
        nombre_semilla: semillero.nombre_semilla || 'Sin nombre',
        fecha_siembra: semillero.fecha_siembra
            ? new Date(semillero.fecha_siembra).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
            : 'Sin fecha de siembra',
        fecha_estimada: semillero.fecha_estimada
            ? new Date(semillero.fecha_estimada).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
            : 'Sin fecha estimada',
        cantidad: semillero.cantidad ?? 0,
    }));

    const headers = [
        'Nombre Semilla',
        'Fecha Siembra',
        'Fecha Estimada',
        'Cantidad',
    ];

    return (
        <div className="p-4">
            <VentanaModal
                isOpen={isModalOpen}
                onClose={closeModal}
                titulo=""
                contenido={modalContenido}
            />
            
            <VentanaModal
                isOpen={isDetailModalOpen}
                onClose={closeModal}
                titulo=""
                contenido={<DetalleSemilleroModal item={selectedSemillero!} />}
            />

            <Tabla
                title="Lista de Semilleros"
                headers={headers}
                data={tablaData.length > 0 ? tablaData : []} 
                onClickAction={handleItemClick}
                onUpdate={(row) => {}}
                onCreate={handleCreate}
                createButtonTitle = "Crear Semillero"
            />

            {semilleros?.length === 0 && (
                <div className="text-center text-gray-500 mt-4">
                    No hay semilleros registrados. Haz clic en "Crear Semillero" para agregar uno.
                </div>
            )}
        </div>
    );
};

export default ListarSemillero;