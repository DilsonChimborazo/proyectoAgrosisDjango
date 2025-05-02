import { useCrearProduccion } from '@/hooks/finanzas/produccion/useCrearProduccion';
import { usePlantacion } from '@/hooks/trazabilidad/plantacion/usePlantacion';
import { useMedidas } from '@/hooks/inventario/unidadMedida/useMedidad';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';

interface CrearProduccionProps {
    onClose?: () => void; // Función opcional para cerrar el modal
    onSuccess?: () => void; // Función opcional para manejar éxito
}

const CrearProduccion = ({ onClose, onSuccess }: CrearProduccionProps) => {
    const mutation = useCrearProduccion();
    const navigate = useNavigate();

    // Usar hooks existentes
    const { data: plantaciones, isLoading: isLoadingPlantaciones } = usePlantacion();
    const { data: unidadesMedida, isLoading: isLoadingUnidades, error: errorUnidades } = useMedidas();

    // Preparar opciones para los selects
    const plantacionOptions = plantaciones?.map((p) => ({
        value: p.id,
        label: `${p.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo'} - ${p.fk_id_eras?.descripcion || 'Sin era'}`
    })) || [];

    const unidadMedidaOptions = unidadesMedida?.map((u) => ({
        value: u.id,
        label: `${u.nombre_medida} (${u.unidad_base})`
    })) || [];

    // Estados de carga
    if (isLoadingPlantaciones || isLoadingUnidades) {
        return <div className="p-4 text-gray-500">Cargando opciones...</div>;
    }

    if (errorUnidades) {
        return <div className="p-4 text-red-500">Error al cargar las unidades de medida</div>;
    }

    const formFields = [
        { 
            id: 'fk_id_plantacion', 
            label: 'Plantación', 
            type: 'select',
            options: plantacionOptions,
            required: true
        },
        { 
            id: 'nombre_produccion', 
            label: 'Nombre Producción', 
            type: 'text',
            required: true
        },
        { 
            id: 'cantidad_producida', 
            label: 'Cantidad Producida', 
            type: 'number', 
            step: '0.1',
            required: true
        },
        { 
            id: 'fk_unidad_medida', 
            label: 'Unidad de Medida', 
            type: 'select',
            options: unidadMedidaOptions,
            required: true
        },
        { 
            id: 'fecha', 
            label: 'Fecha', 
            type: 'date',
            required: true
        },
        { 
            id: 'stock_disponible', 
            label: 'Stock Disponible', 
            type: 'number', 
            step: '0.1'
        },
    ];

    const handleSubmit = (formData: { [key: string]: string | File }) => {
        const nuevaProduccion = {
            nombre_produccion: formData.nombre_produccion as string,
            cantidad_producida: parseFloat(formData.cantidad_producida as string),
            fecha: formData.fecha as string,
            fk_id_plantacion: formData.fk_id_plantacion ? parseInt(formData.fk_id_plantacion as string, 10) : null,
            fk_unidad_medida: formData.fk_unidad_medida ? parseInt(formData.fk_unidad_medida as string, 10) : null,
            stock_disponible: formData.stock_disponible ? parseFloat(formData.stock_disponible as string) : undefined,
        };

        mutation.mutate(nuevaProduccion, {
            onSuccess: () => {
                // Ejecutamos onSuccess si existe, sino navegamos a /stock
                if (onSuccess) {
                  onSuccess();
                } else {
                  navigate("/stock");
                }
                // También cerramos el modal si existe la función onClose
                onClose?.();
              },
              onError: (error) => {
                console.error("Error al crear la venta:", error.message);
              },
            });
    };

    return (
        <div >
            <Formulario
                fields={formFields}
                onSubmit={handleSubmit}
                isError={mutation.isError}
                isSuccess={mutation.isSuccess}
                title="Crear Producción"
            />
        </div>
    );
};

export default CrearProduccion;