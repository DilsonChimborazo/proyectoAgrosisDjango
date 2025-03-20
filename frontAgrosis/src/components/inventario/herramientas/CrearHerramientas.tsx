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
        { id: 'fecha_prestamo', label: 'Fecha de Préstamo', type: 'datetime-local' },
    ];

    const handleSubmit = (formData: { [key: string]: string }) => {
        console.log("Valor de fecha_prestamo recibido del formulario:", formData.fecha_prestamo);
    
        // Validar y convertir la fecha a formato ISO-8601
        let fecha: string | null = null;
    
        if (formData.fecha_prestamo) {
            const fechaObj = new Date(formData.fecha_prestamo);
    
            if (isNaN(fechaObj.getTime())) {
                console.error("Fecha no válida:", formData.fecha_prestamo);
                alert("Por favor, introduce una fecha válida.");
                return; // Detenemos la ejecución si la fecha es inválida
            } else {
                fecha = fechaObj.toISOString(); // Convertimos la fecha a ISO-8601
                console.log("Fecha válida y convertida a ISO-8601:", fecha);
            }
        } else {
            console.log("Fecha no proporcionada");
        }
    
        const nuevaHerramienta: Herramientas = {
            nombre_h: formData.nombre_h, // Nombre de la herramienta
            fecha_prestamo: fecha, // Fecha en formato ISO-8601
            estado: formData.estado, // Estado de la herramienta
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
