import { Herramientas } from '@/hooks/inventario/herramientas/useCrearHerramientas';
import { useCrearHerramientas } from '@/hooks/inventario/herramientas/useCrearHerramientas';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';

const CrearHerramientas = () => {
    const mutation = useCrearHerramientas();
    const navigate = useNavigate();

    const formFields = [
        { id: 'nombre_h', label: 'Nombre', type: 'text' },
        {
            id: 'estado',
            label: 'Estado',
            type: 'select',
            options: [
                { value: 'prestado', label: 'Prestado' },
                { value: 'en_reparacion', label: 'En reparación' },
                { value: 'disponible', label: 'Disponible' }
            ]
        },
        { id: 'fecha_prestamo', label: 'Fecha de Préstamo', type: 'Date' },
    ];

    const handleSubmit = (formData: { [key: string]: string }) => {
        const nuevaHerramienta: Herramientas = {
            nombre_h: formData.nombre_h,
            estado: formData.estado,
            fecha_prestamo: new Date(formData.fecha_prestamo).toISOString().split('T')[0],
        };
        mutation.mutate(nuevaHerramienta);
        navigate('/herramientas');
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

