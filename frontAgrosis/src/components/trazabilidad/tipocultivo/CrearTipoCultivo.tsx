import { useState } from 'react';
import { useCrearTipoCultivo } from '../../../hooks/trazabilidad/tipoCultivo/useCrearTipoCultivo';
import Formulario from '../../globales/Formulario';

interface CrearTipoCultivoProps {
    onSuccess: (nombre: string) => void; // Ajustamos el tipo para que acepte un parámetro `nombre`
}

const CrearTipoCultivo = ({ onSuccess }: CrearTipoCultivoProps) => {
    const mutation = useCrearTipoCultivo();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const formFields = [
        { id: 'nombre', label: 'Nombre', type: 'text' },
        { id: 'descripcion', label: 'Descripción', type: 'textarea' },
    ];

    const handleSubmit = (formData: { [key: string]: string | File }) => {
        setErrorMessage(null);

        const nombre = formData.nombre;
        const descripcion = formData.descripcion;

        if (typeof nombre !== 'string' || typeof descripcion !== 'string') {
            setErrorMessage("❌ Todos los campos deben ser de tipo texto");
            return;
        }

        if (!nombre) {
            setErrorMessage("❌ El campo Nombre es obligatorio");
            return;
        }

        const nuevoTipoCultivo = {
            nombre: nombre.trim(),
            descripcion: descripcion || '',
        };

        mutation.mutate(nuevoTipoCultivo, {
            onSuccess: () => {
                console.log("✅ Tipo de cultivo creado");
                onSuccess(nuevoTipoCultivo.nombre); // Pasamos el nombre al callback `onSuccess`
            },
            onError: (error: any) => {
                const errorMsg = error.message || "Error desconocido al crear el tipo de cultivo";
                console.error("❌ Error al crear tipo de cultivo:", errorMsg);
                setErrorMessage(`❌ Error al crear tipo de cultivo: ${errorMsg}`);
            },
        });
    };

    return (
        <div className="p-4">
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
                title="Crear Nuevo Tipo de Cultivo"
            />
        </div>
    );
};

export default CrearTipoCultivo;