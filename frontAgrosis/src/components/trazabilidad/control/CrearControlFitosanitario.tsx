import { useCrearControlFitosanitario } from '@/hooks/trazabilidad/control/useCrearControlFitosanitario';
import { useControlFitosanitario } from '@/hooks/trazabilidad/control/useControlFitosanitario';
import Formulario from '@/components/globales/Formulario';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const CrearControlFitosanitario = () => {
    const mutation = useCrearControlFitosanitario();
    const navigate = useNavigate();
    const [errorMensaje, setErrorMensaje] = useState("");

    // Obtener lista de controles fitosanitarios
    const { data: controles = [], isLoading: isLoadingControles } = useControlFitosanitario();

    // Extraer desarrolladores únicos
    const desarrollanOptions = Array.from(new Map(controles.map((control) => {
        const desarrollan = control.fk_id_desarrollan;
        const nombrePea = desarrollan.fk_id_pea ? desarrollan.fk_id_pea.nombre_pea : '';
        const nombreCultivo = desarrollan.fk_id_cultivo ? desarrollan.fk_id_cultivo.nombre_cultivo : '';
        const label = nombreCultivo && nombrePea ? `${nombreCultivo} - ${nombrePea}` : nombreCultivo || nombrePea || `Desarrollan ID: ${desarrollan.id}`;
        return [desarrollan.id, { value: desarrollan.id, label }];
    })).values());

    // Definición de los campos del formulario
    const formFields = [
        { id: 'fecha_control', label: 'Fecha de Control', type: 'date' },
        { id: 'descripcion', label: 'Descripción', type: 'text' },
        {
            id: 'fk_id_desarrollan',
            label: 'Selecciona el pea y cultivo al cual se le desarrollara el control',
            type: 'select',
            options: desarrollanOptions,
        },
    ];

    const handleSubmit = (formData: Record<string, any>) => {
        // Validación de campos vacíos
        if (!formData.fecha_control || !formData.descripcion || !formData.fk_id_desarrollan) {
            setErrorMensaje("❌ Todos los campos son obligatorios.");
            return;
        }

        const nuevoControl = {
            fecha_control: new Date(formData.fecha_control).toISOString().split('T')[0],
            descripcion: formData.descripcion.trim(),
            fk_id_desarrollan: formData.fk_id_desarrollan,
        };

        console.log("🚀 Enviando Control Fitosanitario al backend:", nuevoControl);

        mutation.mutate(nuevoControl, {
            onSuccess: () => {
                console.log("✅ Control Fitosanitario creado exitosamente.");
                navigate("/control-fitosanitario");
            },
            onError: (error) => {
                console.error("❌ Error al crear Control Fitosanitario:", error);
                setErrorMensaje("Ocurrió un error al registrar el control.");
            },
        });
    };

    if (isLoadingControles) {
        return <div className="text-center text-gray-500">Cargando desarrolladores...</div>;
    }

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
