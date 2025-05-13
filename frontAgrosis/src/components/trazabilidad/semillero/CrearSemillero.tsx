import { useState } from 'react';
import { useCrearSemillero, Semillero } from '@/hooks/trazabilidad/semillero/useCrearSemillero';
import Formulario from '../../globales/Formulario';
import { useNavigate } from "react-router-dom";

const CrearSemillero = ({ onSuccess }: { onSuccess: () => void }) => {
    const mutation = useCrearSemillero(); // Hook para manejar la creación
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Definimos los campos del formulario
    const formFields = [
        { id: 'nombre_semilla', label: 'Nombre del Semillero', type: 'text' },
        { id: 'fecha_siembra', label: 'Fecha de Siembra', type: 'date' },
        { id: 'fecha_estimada', label: 'Fecha Estimada', type: 'date' },
        { id: 'cantidad', label: 'Cantidad', type: 'number' },
    ];

    // Validar si una fecha es válida
    const isValidDate = (dateString: string): boolean => {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    };

    // Controlamos el envío de datos
    const handleSubmit = (formData: { [key: string]: string | File }) => {
        // Reiniciamos el mensaje de error
        setErrorMessage(null);

        // Verificamos que los valores sean strings (ya que no esperamos Files en este formulario)
        const nombreSemilla = formData.nombre_semilla;
        const fechaSiembra = formData.fecha_siembra;
        const fechaEstimada = formData.fecha_estimada;
        const cantidad = formData.cantidad;

        if (
            typeof nombreSemilla !== 'string' ||
            typeof fechaSiembra !== 'string' ||
            typeof fechaEstimada !== 'string' ||
            typeof cantidad !== 'string'
        ) {
            setErrorMessage("❌ Todos los campos deben ser de tipo texto o número");
            return;
        }

        // Validamos campos obligatorios
        if (!nombreSemilla || !fechaSiembra || !fechaEstimada || !cantidad) {
            setErrorMessage("❌ Todos los campos son obligatorios");
            return;
        }

        // Validamos las fechas
        if (!isValidDate(fechaSiembra)) {
            setErrorMessage("❌ La fecha de siembra no es válida");
            return;
        }

        if (!isValidDate(fechaEstimada)) {
            setErrorMessage("❌ La fecha estimada no es válida");
            return;
        }

        // Validamos que cantidad sea un número válido
        const cantidadNum = parseInt(cantidad, 10);
        if (isNaN(cantidadNum) || cantidadNum <= 0) {
            setErrorMessage("❌ La cantidad debe ser un número mayor que 0");
            return;
        }

        // Creamos el objeto de semillero
        const nuevoSemillero: Semillero = {
            id: 0, // El ID será asignado automáticamente por el backend
            nombre_semilla: nombreSemilla.trim(),
            fecha_siembra: new Date(fechaSiembra).toISOString().split("T")[0],
            fecha_estimada: new Date(fechaEstimada).toISOString().split("T")[0],
            cantidad: cantidadNum,
        };

        console.log("🚀 Enviando semillero al backend:", nuevoSemillero);

        // Usamos el hook para crear un semillero
        mutation.mutate(nuevoSemillero, {
            onSuccess: () => {
                console.log("✅ Semillero creado exitosamente");
                onSuccess();
                navigate("");
            },
            onError: (error: any) => {
                const errorMsg = error.message || "Error desconocido al crear el semillero";
                console.error("❌ Error al crear semillero:", errorMsg);
                setErrorMessage(`❌ Error al crear semillero: ${errorMsg}`);
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
                title="Registrar Nuevo Semillero"
            />
        </div>
    );
};

export default CrearSemillero;