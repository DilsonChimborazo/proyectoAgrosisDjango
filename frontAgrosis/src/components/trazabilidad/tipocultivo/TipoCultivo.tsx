import { useState } from 'react';
import { useCrearTipoCultivo, TipoCultivo } from '@/hooks/trazabilidad/tipoCultivo/useCrearTipoCultivo';
import Formulario from '../../globales/Formulario';

const CrearTipoCultivo = ({ onSuccess }: { onSuccess: (nombre: string) => void }) => {
    const mutation = useCrearTipoCultivo();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Definimos los campos del formulario, incluyendo ciclo_duracion
    const formFields = [
        { id: 'nombre', label: 'Nombre del Tipo de Cultivo', type: 'text' },
        { id: 'descripcion', label: 'Descripción', type: 'textarea' },
        { id: 'ciclo_duracion', label: 'Duración del Ciclo', type: 'text' },
    ];

    // Controlamos el envío de datos
    const handleSubmit = (formData: { [key: string]: string | File | string[] }) => {
        // Reiniciamos el mensaje de error
        setErrorMessage(null);

        // Verificamos que los valores sean strings (no esperamos Files ni string[])
        const nombre = Array.isArray(formData.nombre)
            ? formData.nombre[0] // Tomamos el primer valor si es un array
            : typeof formData.nombre === 'string'
            ? formData.nombre
            : '';
        const descripcion = Array.isArray(formData.descripcion)
            ? formData.descripcion[0]
            : typeof formData.descripcion === 'string'
            ? formData.descripcion
            : '';
        const ciclo_duracion = Array.isArray(formData.ciclo_duracion)
            ? formData.ciclo_duracion[0]
            : typeof formData.ciclo_duracion === 'string'
            ? formData.ciclo_duracion
            : '';

        // Verificamos que no se hayan recibido Files
        if (
            formData.nombre instanceof File ||
            formData.descripcion instanceof File ||
            formData.ciclo_duracion instanceof File
        ) {
            setErrorMessage('❌ Los campos no pueden contener archivos');
            return;
        }

        // Validamos que los valores sean strings válidos
        if (
            !nombre ||
            !ciclo_duracion ||
            Array.isArray(formData.nombre) ||
            Array.isArray(formData.descripcion) ||
            Array.isArray(formData.ciclo_duracion)
        ) {
            setErrorMessage('❌ Todos los campos deben ser de tipo texto');
            return;
        }

        // Validamos campos obligatorios
        if (!nombre) {
            setErrorMessage('❌ El campo Nombre es obligatorio');
            return;
        }
        if (!ciclo_duracion) {
            setErrorMessage('❌ El campo Duración del Ciclo es obligatorio');
            return;
        }

        // Creamos el objeto de tipo de cultivo
        const nuevoTipoCultivo: Omit<TipoCultivo, 'id'> = {
            nombre: nombre.trim(),
            descripcion: descripcion || '',
            ciclo_duracion: ciclo_duracion.trim(),
        };

        // Usamos el hook para crear un tipo de cultivo
        mutation.mutate(nuevoTipoCultivo, {
            onSuccess: () => {
                onSuccess(nombre.trim()); // Pasamos el nombre del tipo de cultivo creado
            },
            onError: (error: any) => {
                const errorMsg = error.message || 'Error desconocido al crear el tipo de cultivo';
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