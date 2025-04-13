import { useMedidas } from '@/hooks/inventario/unidadMedida/useMedidad';
import Tabla from '../../globales/Tabla';
import { useState } from 'react';
import VentanaModal from "../../globales/VentanasModales";
import { useNavigate } from 'react-router-dom';

const ListarMedidas = () => {
    const { data: unidadesMedida, isLoading, error } = useMedidas();
    const [selectedUnidadMedida, setSelectedUnidadMedida] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRowClick = (unidad: any) => {
        setSelectedUnidadMedida(unidad);
        setIsModalOpen(true);
    }

    const navigate = useNavigate();

    const closeModal = () => {
        setSelectedUnidadMedida(null);
        setIsModalOpen(false);
    };

    const handleUpdate = (unidad: { id: number }) => {
        navigate(`/ActualizarUnidadMedida/${unidad.id}`);
    };

    const handleCreate = () => {
        navigate("/CrearUnidadMedida");
    };

    if (isLoading) return <div>Cargando unidades de medida...</div>;
    if (error instanceof Error) return <div>Error al cargar unidades de medida: {error.message}</div>;

    const mappedUnidades = unidadesMedida?.map((u) => ({
        id: u.id,
        nombre: u.nombre_medida,
        abreviatura: u.abreviatura,
    })) || [];

    return (
        <div>
            <Tabla
                title="Unidades de Medida"
                headers={["ID", "Nombre", "Abreviatura"]}
                data={mappedUnidades}
                onClickAction={handleRowClick}
                onUpdate={handleUpdate}
                onCreate={handleCreate}
                createButtonTitle="Crear"
            />
            {selectedUnidadMedida && (
                <VentanaModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    titulo="Detalles de Unidad de Medida"
                    contenido={selectedUnidadMedida}
                />
            )}
        </div>
    );
};

export default ListarMedidas;
