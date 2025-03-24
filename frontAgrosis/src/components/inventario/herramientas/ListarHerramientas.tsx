import { useHerramientas } from "@/hooks/inventario/herramientas/useHerramientas";
import  Tabla from '../../globales/Tabla';
import {useState} from 'react';
import VentanaModal from "../../globales/VentanasModales";
import {useNavigate} from 'react-router-dom';


const ListarHerramientas = () => {
    const {data: herramientas, isLoading, error } = useHerramientas();
    const [selectedHerramientas, setSelectedHerramientas ] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRowClick = (herramienta: any) => {
        setSelectedHerramientas(herramienta);
        setIsModalOpen (true); 
    }

    const navigate = useNavigate()

    const closeModal = () => {
        setSelectedHerramientas(null);
        setIsModalOpen(false);
    };

    const handleUpdate = (residuo: { id: number }) => {
        navigate(`/ActualizarHerramienta/${residuo.id}`);
        };

    const handleCreate = () => {
        navigate("/CrearHerramientas");
        };
    

    if (isLoading) return <div>Cargando herramientas...</div>
    if (error instanceof Error) return <div>Error al cargar herramientas: {error.message}</div>;

    const mappedHerramientas = herramientas?.map((h) => ({
        id: h.id,
        nombre: h.nombre_h,
        estado: h.estado,
        fecha_prestamo: h.fecha_prestamo,
    })) || [];

    return (
        <div >
            <Tabla
                title="Herramientas"
                headers={["ID", "Nombre", "Estado", "Fecha Préstamo"]}
                data={mappedHerramientas}
                onClickAction={handleRowClick}
                onUpdate={handleUpdate} 
                onCreate={handleCreate}
                createButtonTitle="Crear"
            />
            {selectedHerramientas && (
                <VentanaModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    titulo="Detalles de Herramienta"
                    contenido={selectedHerramientas}
                />
            )}
        </div>
    );
};

export default ListarHerramientas;