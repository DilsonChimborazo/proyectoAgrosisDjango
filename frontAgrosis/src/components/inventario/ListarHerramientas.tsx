import { useHerramientas } from "@/hooks/inventario/herramientas/useHerramientas";
import  Tabla from '../../components/globales/Tabla';
import {useState} from 'react';
import VentanaModal from "../../components/globales/VentanasModales";
import Button from "../globales/Button";
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

    if (isLoading) return <div>Cargando herramientas...</div>
    if (error instanceof Error) return <div>Error al cargar herramientas: {error.message}</div>;

    const mappedHerramientas = herramientas?.map((h) => ({
        id: h.id_herramientas,
        nombre: h.nombre_h,
        estado: h.estado,
        fecha_prestamo: h.fecha_prestamo,
    })) || [];

    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
            <Button text= "Crear Herramienta" className="mx-2" onClick={()=> navigate("/crearHerramienta")} variant="success"/>
            <h2 className="text-2xl font-bold mb-4">Lista de Herramientas</h2>
            <Tabla
                title="Herramientas"
                headers={["ID", "Nombre", "Estado", "Fecha Préstamo"]}
                data={mappedHerramientas}
                onClickAction={handleRowClick}
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