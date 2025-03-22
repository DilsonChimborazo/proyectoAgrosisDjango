
import { Semillero } from '@/hooks/trazabilidad/semillero/useCrearSemillero';
import { useCrearSemillero } from '@/hooks/trazabilidad/semillero/useCrearSemillero';
import Formulario from '../../globales/Formulario';
import { useNavigate } from "react-router-dom";


const CrearSemillero = () => {
    const mutation = useCrearSemillero(); // Hook para manejar creación
    const navigate = useNavigate();

    // Campos ajustados para la estructura correcta
    const formFields = [
        { id: 'nombre_semillero', label: 'Nombre del Semillero', type: 'text' },
        { id: 'fecha_siembra', label: 'Fecha de Siembra', type: 'date' },
        { id: 'fecha_estimada', label: 'Fecha Estimada', type: 'date' },
        { id: 'cantidad', label: 'Cantidad', type: 'number' },
    ];

    // Manejo del formulario
    const handleSubmit = (formData: { [key: string]: string }) => {
        // Validaciones iniciales
        if (!formData.nombre_semillero || !formData.fecha_siembra || !formData.fecha_estimada || !formData.cantidad) {
            console.error("❌ Todos los campos son obligatorios");
            return;
        }

        const nuevoSemillero: Semillero = {
            id: 0, // El ID será asignado automáticamente por el backend
            nombre_semillero: formData.nombre_semillero.trim(),
            fecha_siembra: new Date(formData.fecha_siembra).toISOString().split("T")[0],
            fecha_estimada: new Date(formData.fecha_estimada).toISOString().split("T")[0],
            cantidad: parseInt(formData.cantidad, 10),
        };

        console.log("🚀 Enviando semillero al backend:", nuevoSemillero);

        // Llamada al hook para enviar datos al backend
        mutation.mutate(nuevoSemillero, {
            onSuccess: () => {
                console.log("✅ Semillero creado exitosamente");
                navigate("/semilleros"); // Redirigir al listado
            },
            onError: (error) => {
                console.error("❌ Error al crear semillero:", error);
            },
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
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
