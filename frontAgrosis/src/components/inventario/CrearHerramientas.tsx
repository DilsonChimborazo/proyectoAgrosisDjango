
import { Herramientas } from '@/hooks/inventario/herramientas/useCrearHerramientas';
import { useCrearHerramientas } from '../../hooks/inventario/herramientas/useCrearHerramientas';
import { useNavigate } from 'react-router-dom';
import Formulario from '../globales/Formulario';

const CrearHerramientas = () => {
    const mutation = useCrearHerramientas();
    const navigate = useNavigate();

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
            {/* Botón adicional */}
            <button 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => navigate('/herramientas')}
            >
                Volver a Herramientas
            </button>
            
        </div>
    );
};

export default CrearHerramientas;

