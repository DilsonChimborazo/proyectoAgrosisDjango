import { NuevaVenta } from '@/hooks/finanzas/venta/useCrearVenta';
import { useCrearVenta } from '../../../hooks/finanzas/venta/useCrearVenta';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';


const CrearVenta = () => {
    const mutation = useCrearVenta();
    const navigate = useNavigate();

    const formFields = [
        { id: 'fk_id_produccion', label: 'ID Producción', type: 'number' },
        { id: 'cantidad', label: 'Cantidad', type: 'number' },
        { id: 'precio_unidad', label: 'Precio por Unidad', type: 'number' },
        { id: 'fecha', label: 'Fecha', type: 'date' },
    ];

    const handleSubmit = (formData: { [key: string]: string }) => {
        const cantidad = parseFloat(formData.cantidad);
        const precio_unidad = parseFloat(formData.precio_unidad);

        const nuevaVenta: NuevaVenta = {
            fk_id_produccion: formData.fk_id_produccion ? parseInt(formData.fk_id_produccion) : null,
            cantidad,
            precio_unidad,
            total_venta: cantidad * precio_unidad, 
            fecha: formData.fecha,
        };

        mutation.mutate(nuevaVenta);
        navigate("/ventas"); 
        console.log(nuevaVenta);
    };

    return (
        <div className="p-10">
            <Formulario 
                fields={formFields} 
                onSubmit={handleSubmit} 
                isError={mutation.isError} 
                isSuccess={mutation.isSuccess}
                title="Crear Venta"  
            />
        </div>
    );
};

export default CrearVenta;
