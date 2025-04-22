import { Produccion } from '@/hooks/finanzas/produccion/useCrearProduccion';
import { useCrearProduccion } from '../../../hooks/finanzas/produccion/useCrearProduccion';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';

const CrearProduccion = () => {
    const mutation = useCrearProduccion();
    const navigate = useNavigate();

    const formFields = [
        { id: 'fk_id', label: 'ID Cultivo', type: 'number' },
        { id: 'nombre_produccion', label: 'Nombre Produccion', type: 'text' },
        { id: 'cantidad_produccion', label: 'Cantidad de Producción', type: 'number' },
        { id: 'fecha', label: 'Fecha', type: 'date' },
    ];

    const handleSubmit = (formData: { [key: string]: string | File }) => {
        const nuevaProduccion: Produccion = {
            fk_id_cultivo: formData.fk_id_cultivo ? parseInt(formData.fk_id_cultivo as string, 10) : null,
            nombre_produccion: formData.nombre_produccion as string,
            cantidad_produccion: Math.round(parseFloat(formData.cantidad_produccion as string)),
            fecha: formData.fecha as string,
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
