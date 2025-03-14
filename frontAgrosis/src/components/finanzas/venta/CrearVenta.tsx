import { NuevaVenta} from '@/hooks/finanzas/venta/useCrearVenta';
import { useCrearVenta } from '../../../hooks/finanzas/venta/useCrearVenta';
import Formulario from '../../globales/Formulario';


const CrearVenta = () => {
    const mutation = useCrearVenta();

    const formFields = [
        { id: 'fk_id_produccion', label: 'ID Producción', type: 'number' },
        { id: 'cantidad', label: 'Cantidad', type: 'number' },
        { id: 'precio_unidad', label: 'Precio por Unidad', type: 'number' },
        { id: 'total_venta', label: 'Total de Venta', type: 'number' },
        { id: 'fecha', label: 'Fecha', type: 'date' },
    ];

    const handleSubmit = (formData: { [key: string]: string }) => {
        const nuevaVenta: NuevaVenta = {
            fk_id_produccion: formData.fk_id_produccion ? parseInt(formData.fk_id_produccion) : null,
            cantidad: parseFloat(formData.cantidad),
            precio_unidad: parseFloat(formData.precio_unidad),
            total_venta: parseFloat(formData.total_venta),
            fecha: formData.fecha,
        };

        mutation.mutate(nuevaVenta);
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
