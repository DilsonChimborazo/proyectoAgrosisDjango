import { useCrearEras, Eras } from '../../../hooks/iot/eras/useCrearEras';
import Formulario from '../../globales/Formulario';
import { useLotes } from '@/hooks/iot/lote/useLotes';
import { useState } from 'react';
import VentanaModal from '../../globales/VentanasModales';
import CrearLote from '../lotes/CrearLote';

interface CrearErasProps {
    onSuccess?: () => void;
}

const CrearEras = ({ onSuccess }: CrearErasProps) => {
    const mutation = useCrearEras();
    const { data: lotes = [], isLoading: isLoadingLotes, refetch: refetchLotes } = useLotes();
    const [mostrarModalLote, setMostrarModalLote] = useState(false);

    const formFields = [
        {
            id: 'fk_id_lote',
            label: 'Lote',
            type: 'select',
            options: lotes.map(lote => ({ value: lote.id.toString(), label: lote.nombre_lote })),
            hasExtraButton: true,
            extraButtonText: 'Crear Lote',
            onExtraButtonClick: () => setMostrarModalLote(true),
        },
        { id: 'nombre', label: 'Nombre', type: 'text' },
        { id: 'descripcion', label: 'Descripción', type: 'text' },
        {
            id: 'estado',
            label: 'Estado',
            type: 'select',
            options: [
                { value: 'true', label: 'Activo' },
                { value: 'false', label: 'Inactivo' }
            ]
        }
    ];

    const handleSubmit = (formData: { [key: string]: string }) => {
        const nuevaEra: Eras = {
            id: 0,
            nombre: formData.nombre,
            fk_id_lote: Number(formData.fk_id_lote),
            descripcion: formData.descripcion,
            estado: formData.estado === 'true'
        };

        mutation.mutate(nuevaEra, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
            }
        });
    };

    const cerrarYActualizar = async () => {
        setMostrarModalLote(false);
        await refetchLotes();
    };

    if (isLoadingLotes) {
        return <div className="text-center text-gray-500">Cargando lotes...</div>;
    }

    return (
        <div className="p-10">
            <Formulario 
                fields={formFields}
                onSubmit={handleSubmit}
                isError={mutation.isError}
                isSuccess={mutation.isSuccess}
                title="Crear Era"
            />
            <VentanaModal
                isOpen={mostrarModalLote}
                onClose={cerrarYActualizar}
                titulo=""
                contenido={
                    <CrearLote
                        onSuccess={cerrarYActualizar}
                    />
                }
            />
        </div>
    );
};

export default CrearEras;
