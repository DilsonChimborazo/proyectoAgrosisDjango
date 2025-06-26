import { useCrearEras, Eras } from '../../../hooks/iot/eras/useCrearEras';
import Formulario from '../../globales/Formulario';
import { useLotes } from '@/hooks/iot/lote/useLotes';
import { useState } from 'react';
import VentanaModal from '../../globales/VentanasModales';
import CrearLote from '../lotes/CrearLote';
import { showToast } from '@/components/globales/Toast';

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
        { id: 'nombre', label: 'Nombre', type: 'text', required: true },
        { id: 'descripcion', label: 'Descripción', type: 'text', required: true },
        {
            id: 'estado',
            label: 'Estado',
            type: 'select',
            options: [
                { value: 'true', label: 'Activo' },
                { value: 'false', label: 'Inactivo' }
            ],
            required: true,
        }
    ];

    const handleSubmit = (formData: { [key: string]: string | string[] | File }) => {
        // Validar que los campos sean strings y no estén vacíos
        if (
            typeof formData.nombre !== 'string' ||
            typeof formData.descripcion !== 'string' ||
            typeof formData.fk_id_lote !== 'string' ||
            typeof formData.estado !== 'string' ||
            !formData.nombre ||
            !formData.descripcion ||
            !formData.fk_id_lote ||
            !formData.estado
        ) {
            showToast({
                title: 'Error',
                description: 'Todos los campos son obligatorios y deben ser válidos',
                variant: 'error',
            });
            return;
        }

        const nuevaEra: Eras = {
            id: 0,
            nombre: formData.nombre,
            fk_id_lote: Number(formData.fk_id_lote),
            descripcion: formData.descripcion,
            estado: formData.estado === 'true'
        };

        mutation.mutate(nuevaEra, {
            onSuccess: () => {
                showToast({
                    title: 'Éxito',
                    description: 'Era creada exitosamente',
                    variant: 'success',
                });
                if (onSuccess) onSuccess();
            },
            onError: () => {
                showToast({
                    title: 'Error',
                    description: 'No se pudo crear la era',
                    variant: 'error',
                });
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