import { Especie } from '@/hooks/trazabilidad/useCrearEspecie';
import { useCrearEspecie } from '../../hooks/trazabilidad/useCrearEspecie';
import Formulario from '../globales/Formulario';
import { useNavigate } from "react-router-dom";

const CrearEspecie = () => {
    const mutation = useCrearEspecie(); // Hook para manejar creación de especie
    const navigate = useNavigate();

    // Campos ajustados para la estructura correcta
    const formFields = [
        { id: 'nombre_comun', label: 'Nombre Común', type: 'text' },
        { id: 'nombre_cientifico', label: 'Nombre Científico', type: 'text' },
        { id: 'descripcion', label: 'Descripción', type: 'text' },
        { id: 'fk_id_tipo_cultivo', label: 'ID Tipo de Cultivo', type: 'number' },
    ];

    // Manejo del formulario
    const handleSubmit = (formData: { [key: string]: string }) => {
        // Validaciones iniciales
        if (!formData.nombre_comun || !formData.nombre_cientifico || !formData.descripcion || !formData.fk_id_tipo_cultivo) {
            console.error("❌ Todos los campos son obligatorios");
            return;
        }

        const nuevaEspecie: Especie = {
            id:0,
            nombre_comun: formData.nombre_comun.trim(),
            nombre_cientifico: formData.nombre_cientifico.trim(),
            descripcion: formData.descripcion.trim(),
            fk_id_tipo_cultivo: parseInt(formData.fk_id_tipo_cultivo, 10),
        };

        console.log("🚀 Enviando especie al backend:", nuevaEspecie);

        // Llamada al hook para enviar datos al backend
        mutation.mutate(nuevaEspecie, {
            onSuccess: () => {
                console.log("✅ Especie creada exitosamente");
                navigate("/especies"); // Redirigir al listado
            },
            onError: (error) => {
                console.error("❌ Error al crear especie:", error);
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
                title="Registrar Nueva Especie" 
            />
        </div>
    );
};

export default CrearEspecie;
