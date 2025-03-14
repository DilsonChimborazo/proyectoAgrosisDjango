import { Produccion } from '@/hooks/finanzas/produccion/useCrearProduccion';
import { useCrearProduccion } from '../../../hooks/finanzas/produccion/useCrearProduccion';
import Formulario from '../../globales/Formulario';

const CrearProduccion = () => {
    const mutation = useCrearProduccion();

    const formFields = [
        { id: 'fk_id_cultivo', label: 'ID Cultivo', type: 'number' },
        { id: 'cantidad_produccion', label: 'Cantidad de Producción', type: 'number' },
        { id: 'fecha', label: 'Fecha', type: 'date' },
    ];

    const handleSubmit = (formData: { [key: string]: string }) => {
        const nuevaProduccion: Produccion = {
            fk_id_cultivo: formData.fk_id_cultivo ? parseInt(formData.fk_id_cultivo) : null,
            cantidad_produccion: parseFloat(formData.cantidad_produccion),
            fecha: formData.fecha,
        };

        mutation.mutate(nuevaProduccion);
    };

    return (
        <div className="p-10">
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
