import { Herramientas } from '@/hooks/inventario/herramientas/useCrearHerramientas';
import { useCrearHerramientas } from '../../hooks/inventario/herramientas/useCrearHerramientas';
import Formulario from '../globales/Formulario';

const CrearHerramientas = () => {
    const mutation = useCrearHerramientas();

    const formFields = [
        { id: 'nombre_h', label: 'Nombre', type: 'text' },
        { id: 'estado', label: 'Estado', type: 'text' },
        { id: 'fecha_prestamo', label: 'Fecha de Préstamo', type: 'date' },
    ];

    const handleSubmit = (formData: { [key: string]: string }) => {
        const nuevaHerramienta: Herramientas = {
            nombre_h: formData.nombre_h,
            estado: formData.estado,
            fecha_prestamo: formData.fecha_prestamo,
        };
        mutation.mutate(nuevaHerramienta);
    };

    return (
        <div className="p-10">
            <Formulario 
                fields={formFields} 
                onSubmit={handleSubmit} 
                isError={mutation.isError} 
                isSuccess={mutation.isSuccess}
                title="Crear Herramienta"  
            />
        </div>
    );
};

export default CrearHerramientas;

