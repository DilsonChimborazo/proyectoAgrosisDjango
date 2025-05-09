import { useCrearSalario } from '@/hooks/finanzas/salario/useCrearSalario';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';

interface CrearSalarioProps {
    onClose?: () => void;
    onSuccess?: () => void;
}

const CrearSalario = ({ onClose, onSuccess }: CrearSalarioProps) => {
    const mutation = useCrearSalario();
    const navigate = useNavigate();

    const formFields = [
        { 
            id: 'precio_jornal', 
            label: 'Precio por Jornal', 
            type: 'number',
            step: '0.01',
            required: true
        },
        { 
            id: 'horas_por_jornal', 
            label: 'Horas por Jornal', 
            type: 'number',
            step: '0.1',
            required: true
        },
        { 
            id: 'fecha_inicio', 
            label: 'Fecha de Inicio', 
            type: 'date',
            required: true
        },
        { 
            id: 'fecha_fin', 
            label: 'Fecha de Fin (Opcional)', 
            type: 'date',
            required: false
        },
        { 
            id: 'activo', 
            label: 'Estado', 
            type: 'select',
            options: [
                { value: 'true', label: 'Activo' },
                { value: 'false', label: 'Inactivo' }
            ],
            required: true,
            defaultValue: 'true'
        },
    ];

    const handleSubmit = (formData: { [key: string]: string | File }) => {
        const nuevoSalario = new FormData();
        
        nuevoSalario.append('precio_jornal', formData.precio_jornal as string);
        nuevoSalario.append('horas_por_jornal', formData.horas_por_jornal as string);
        nuevoSalario.append('fecha_inicio', formData.fecha_inicio as string);
        
        if (formData.fecha_fin) {
            nuevoSalario.append('fecha_fin', formData.fecha_fin as string);
        }
        
        // El valor ya viene como string 'true' o 'false' del select
        nuevoSalario.append('activo', formData.activo as string);

        mutation.mutate(nuevoSalario, {
            onSuccess: () => {
                if (onSuccess) {
                    onSuccess();
                } else {
                    navigate("/principal");
                }
                onClose?.();
            },
            onError: (error) => {
                console.error("Error al crear el salario:", error.message);
            },
        });
    };

    return (
        <div>
            <Formulario
                fields={formFields}
                onSubmit={handleSubmit}
                isError={mutation.isError}
                isSuccess={mutation.isSuccess}
                title="Crear Salario"
            />
        </div>
    );
};

export default CrearSalario;