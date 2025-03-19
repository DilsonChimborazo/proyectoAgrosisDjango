import { useInsumo } from "../../hooks/inventario/herramientas/useInsumo";
import Tabla from "../../components/globales/Tabla";
import { useState } from "react";
import VentanaModal from "../../components/globales/VentanasModales";
import Button from "../globales/Button";
import {useNavigate} from 'react-router-dom';

const ListarInsumos = () => {
    const { data: insumos, isLoading, error } = useInsumo();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInsumo, setSelectedInsumo] = useState<any>(null);
    

    const openModal = (insumo: any) => {
        setSelectedInsumo(insumo);
        setIsModalOpen(true);
    };

    const navigate = useNavigate()

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedInsumo(null);
      
    };

    if (isLoading) return <div>Cargando insumos...</div>;
    if (error instanceof Error) return <div>Error al cargar insumos: {error.message}</div>;

    const mappedInsumos = insumos?.map((i) => ({
        id: i.id_insumo,
        nombre: i.nombre_insumo,
        tipo: i.tipo,
        cantidad: i.cantidad,
        unidad: i.unidad_medida,
    })) || [];

    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
            <Button text= "Crear Insumo" className="mx-2" onClick={()=> navigate("/crearInsumo")} variant="success"/>
            <h2 className="text-2xl font-bold mb-4">Lista de Insumos</h2>
            <Tabla
                title="Insumos"
                headers={["ID", "Nombre", "Cantidad", "Unidad de Medida"]}
                data={mappedInsumos}
                onClickAction={openModal}
            />
            {selectedInsumo && (
                <VentanaModal isOpen={isModalOpen} onClose={closeModal} titulo="Detalles del Insumo" contenido={selectedInsumo}
                />
            )}
        </div>
    );
};

export default ListarInsumos;