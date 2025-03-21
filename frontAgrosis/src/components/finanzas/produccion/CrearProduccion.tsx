import { Produccion } from '@/hooks/finanzas/produccion/useCrearProduccion';
import { useCrearProduccion } from '../../../hooks/finanzas/produccion/useCrearProduccion';
import Formulario from '../../globales/Formulario';
import { useNavigate } from'react-router-dom';

const CrearProduccion = () => {
    const mutation = useCrearProduccion();
    const navigate = useNavigate();

    const formFields = [
        { id: 'fk_id', label: 'ID Cultivo', type: 'number' },
        { id: 'cantidad_produccion', label: 'Cantidad de Producción', type: 'number' },
        { id: 'fecha', label: 'Fecha', type: 'date' },
    ];

    const handleSubmit = (formData: { [key: string]: string }) => {
        const nuevaProduccion: Produccion = {
            fk_id: formData.fk_id ? parseInt(formData.fk_id, 10) : null,
            cantidad_produccion: parseFloat(formData.cantidad_produccion),
            fecha: formData.fecha,
        };

        mutation.mutate(nuevaProduccion);
        navigate("/produccion");
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
