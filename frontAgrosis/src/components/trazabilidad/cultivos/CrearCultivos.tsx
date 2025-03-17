    import { Cultivos } from '../../../hooks/trazabilidad/cultivo/useCrearCultivos';
    import { useCrearCultivo } from '../../../hooks/trazabilidad/cultivo/useCrearCultivos';
    import Formulario from '../../globales/Formulario';
    import { useNavigate } from "react-router-dom";

    const CrearCultivo = () => {
        const mutation = useCrearCultivo();
        const navigate = useNavigate();

        const formFields = [
            { id: 'nombre_cultivo', label: 'Nombre del Cultivo', type: 'text' },
            { id: 'fecha_plantacion', label: 'Fecha de Plantación', type: 'date' },
            { id: 'descripcion', label: 'Descripción', type: 'text' },
            { id: 'fk_id_especie', label: 'ID de Especie', type: 'number' },
            { id: 'fk_id_semillero', label: 'ID de Semillero', type: 'number' },
        ];

        const handleSubmit = (formData: { [key: string]: string }) => {
            if (!formData.fecha_plantacion) {
                console.error("Error: La fecha de plantación es obligatoria.");
                return;
            }

            const fechaISO = new Date(formData.fecha_plantacion).toISOString().split("T")[0];

            const nuevoCultivo: Cultivos = {
                nombre_cultivo: formData.nombre_cultivo,
                fecha_plantacion: fechaISO,
                descripcion: formData.descripcion,
                fk_id_especie: parseInt(formData.fk_id_especie) || 0,
                fk_id_semillero: parseInt(formData.fk_id_semillero) || 0,
            };

            console.log("Enviando cultivo al backend:", nuevoCultivo);
            
            mutation.mutate(nuevoCultivo, {
                onSuccess: () => {
                    console.log("Cultivo creado exitosamente, redirigiendo a /cultivo...");
                    navigate("/cultivo"); 
                },
                onError: (error) => {
                    console.error("Error al crear cultivo:", error);
                }
            });
        }

        return (
            <div className="max-w-4xl mx-auto p-4">
                <Formulario 
                    fields={formFields} 
                    onSubmit={handleSubmit} 
                    isError={mutation.isError} 
                    isSuccess={mutation.isSuccess}
                    title="Registra Nuevo Cultivo"  
                />
            </div>
        );
    };

    export default CrearCultivo;
