// src/components/inventario/unidadMedida/ListarMedidas.tsx
import { useMedidas } from '@/hooks/inventario/unidadMedida/useMedidad';
import Tabla from '../../globales/Tabla';
import { useState } from 'react';
import VentanaModal from "../../globales/VentanasModales";
import { useNavigate } from 'react-router-dom';

const ListarMedidas = () => {
    const { data: unidadesMedida, isLoading, error } = useMedidas();
    const [selectedUnidadMedida, setSelectedUnidadMedida] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleRowClick = (unidad: any) => {
        setSelectedUnidadMedida(unidad);
        setIsModalOpen(true);
    }

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
        unidad_base: u.unidad_base,
        factor_conversion: u.factor_conversion,
    })) || [];

    return (
        <div>
            <Tabla
                title="Unidades de Medida"
                headers={["ID", "Nombre", "Unidad Base", "Factor de Conversión"]}
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
                    contenido={
                        <div className="space-y-2">
                            <p><strong>ID:</strong> {selectedUnidadMedida.id}</p>
                            <p><strong>Nombre:</strong> {selectedUnidadMedida.nombre}</p>
                            <p><strong>Unidad Base:</strong> {selectedUnidadMedida.unidad_base}</p>
                            <p><strong>Factor de Conversión:</strong> {selectedUnidadMedida.factor_conversion}</p>
                        </div>
                    }
                />
            )}
        </div>
    );
};

export default ListarMedidas;
