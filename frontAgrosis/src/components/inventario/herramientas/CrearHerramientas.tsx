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
                { value: 'Prestado', label: 'Prestado' },
                { value: 'En_reparacion', label: 'En reparación' },
                { value: 'Disponible', label: 'Disponible' }
            ]
        },
        { id: 'stock', label: 'Stock', type: 'number' },
    ];

    const handleSubmit = (formData: { [key: string]: string }) => {
        const nuevaHerramienta: Herramientas = {
            nombre_h: formData.nombre_h,
            estado: formData.estado,
            stock: Number(formData.stock), // Asegurar que sea número
        };

        mutation.mutate(nuevaHerramienta, {
            onSuccess: () => {
                console.log("Herramienta creada exitosamente:", nuevaHerramienta);
                navigate('/herramientas');
            },
            onError: (error) => {
                console.error("Error al crear la herramienta:", error.response?.data || error.message);
            },
        });
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
