import { useCrearControlFitosanitario } from '@/hooks/trazabilidad/control/useCrearControlFitosanitario';
import Formulario from '@/components/globales/Formulario';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const CrearControlFitosanitario = () => {
    const mutation = useCrearControlFitosanitario();
    const navigate = useNavigate();
    const [errorMensaje, setErrorMensaje] = useState("");

    const formFields = [
        { id: 'fecha_control', label: 'Fecha de Control', type: 'date' },
        { id: 'descripcion', label: 'Descripción', type: 'text' },
        { id: 'fk_id_desarrollan', label: 'ID de Desarrollan', type: 'number' },
    ];

    const handleSubmit = (formData: Record<string, any>) => {
        // Validación de campos vacíos
        if (!formData.fecha_control || !formData.descripcion || !formData.fk_id_desarrollan) {
            setErrorMensaje("Todos los campos son obligatorios.");
            return;
        }

        // Convertir a número asegurando que sea válido
        const idDesarrollan = Number(formData.fk_id_desarrollan);
        if (isNaN(idDesarrollan)) {
            setErrorMensaje("El ID de Desarrollan debe ser un número válido.");
            return;
        }

        const nuevoControl = {
            fecha_control: new Date(formData.fecha_control).toISOString().split('T')[0],
            descripcion: formData.descripcion,
            fk_id_desarrollan: idDesarrollan,
        };

        mutation.mutate(nuevoControl, {
            onSuccess: () => {
                console.log('✅ Control Fitosanitario creado exitosamente.');
                navigate('/control-fitosanitario');
            },
            onError: (error) => {
                console.error('❌ Error al crear Control Fitosanitario:', error);
                setErrorMensaje("Ocurrió un error al registrar el control.");
            },
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            {errorMensaje && <p className="text-red-500 mb-2">{errorMensaje}</p>}
            <Formulario 
                fields={formFields} 
                onSubmit={handleSubmit} 
                isError={mutation.isError} 
                isSuccess={mutation.isSuccess}
                title="Registrar Control Fitosanitario"
            />
        </div>
    );
};

export default CrearControlFitosanitario;
