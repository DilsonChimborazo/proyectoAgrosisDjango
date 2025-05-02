import { useState } from 'react';
import { useCrearTipoCultivo, TipoCultivo } from '@/hooks/trazabilidad/tipoCultivo/useCrearTipoCultivo';
import Formulario from '../../globales/Formulario';

const CrearTipoCultivo = ({ onSuccess }: { onSuccess: (nombre: string) => void }) => {
    const mutation = useCrearTipoCultivo();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Definimos los campos del formulario
    const formFields = [
        { id: 'nombre', label: 'Nombre del Tipo de Cultivo', type: 'text' },
        { id: 'descripcion', label: 'Descripción', type: 'textarea' },
    ];

    // Controlamos el envío de datos
    const handleSubmit = (formData: { [key: string]: string | File }) => {
        // Reiniciamos el mensaje de error
        setErrorMessage(null);

        // Verificamos que los valores sean strings (no esperamos Files)
        const nombre = formData.nombre;
        const descripcion = formData.descripcion;

        if (typeof nombre !== 'string' || typeof descripcion !== 'string') {
            setErrorMessage("❌ Todos los campos deben ser de tipo texto");
            return;
        }

        // Validamos campos obligatorios
        if (!nombre) {
            setErrorMessage("❌ El campo Nombre es obligatorio");
            return;
        }

        // Creamos el objeto de tipo de cultivo
        const nuevoTipoCultivo: Omit<TipoCultivo, 'id'> = {
            nombre: nombre.trim(),
            descripcion: descripcion || '',
        };

        // Usamos el hook para crear un tipo de cultivo
        mutation.mutate(nuevoTipoCultivo, {
            onSuccess: () => {
                onSuccess(nombre.trim()); // Pasamos el nombre del tipo de cultivo creado
            },
            onError: (error: any) => {
                const errorMsg = error.message || "Error desconocido al crear el tipo de cultivo";
                setErrorMessage(`❌ Error al crear tipo de cultivo: ${errorMsg}`);
            },
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {errorMessage}
                </div>
            )}
            <Formulario
                fields={formFields}
                onSubmit={handleSubmit}
                isError={mutation.isError}
                isSuccess={mutation.isSuccess}
                title="Registrar Nuevo Tipo de Cultivo"
            />
        </div>
    );
};

export default CrearTipoCultivo;