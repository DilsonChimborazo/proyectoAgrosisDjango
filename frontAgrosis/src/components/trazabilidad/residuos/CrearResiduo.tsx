import { useCrearResiduo } from '@/hooks/trazabilidad/residuo/useCrearResiduo';
import Formulario from '@/components/globales/Formulario';
import { useNavigate } from 'react-router-dom';
import { useCultivo } from '@/hooks/trazabilidad/cultivo/useCultivo';
import { useResiduos } from '@/hooks/trazabilidad/residuo/useResiduos';

const CrearResiduo = () => {
    const mutation = useCrearResiduo();
    const navigate = useNavigate();
    const { data: cultivos = [], isLoading: isLoadingCultivos } = useCultivo();
    const { data: residuos = [], isLoading: isLoadingResiduos } = useResiduos();

    console.log("🚀 Cultivos recibidos:", cultivos);
    console.log("🚀 Residuos recibidos:", residuos);

    // Validar cultivos y residuos antes de mapear
    const cultivosValidos = Array.isArray(cultivos) ? cultivos.filter(c => c?.id) : [];
    const residuosValidos = Array.isArray(residuos) ? residuos.filter(r => r?.fk_id_tipo_residuo?.id) : [];

    // Obtener cultivos únicos
    const cultivosUnicos = Array.from(new Map(cultivosValidos.map((cultivo) => [cultivo.id, cultivo])).values());
    
    // Obtener tipos de residuos únicos
    const tiposResiduosUnicos = Array.from(
        new Map(residuosValidos.map((residuo) => [residuo.fk_id_tipo_residuo.id, residuo.fk_id_tipo_residuo])).values()
    );

    // Si los datos aún no están listos, mostrar mensaje de carga
    if (isLoadingCultivos || isLoadingResiduos || cultivosUnicos.length === 0 || tiposResiduosUnicos.length === 0) {
        return <div className="text-center text-gray-500">Cargando datos de residuos y cultivos...</div>;
    }

    // Definir los campos del formulario
    const formFields = [
        { id: 'nombre_residuo', label: 'Nombre del Residuo', type: 'text' },
        { id: 'fecha', label: 'Fecha', type: 'date' },
        { id: 'descripcion', label: 'Descripción', type: 'text' },
        { 
            id: 'fk_id_cultivo', 
            label: 'Cultivo', 
            type: 'select', 
            options: cultivosUnicos.map(cultivo => ({ value: cultivo.id, label: cultivo.nombre_cultivo }))
        },
        { 
            id: 'fk_id_tipo_residuo', 
            label: 'Tipo de Residuo', 
            type: 'select', 
            options: tiposResiduosUnicos.map(tipo => ({ value: tipo.id, label: tipo.nombre_tipo_residuo }))
        },
    ];

    // Manejo del formulario
    const handleSubmit = (formData: { [key: string]: string }) => {
        if (!formData.fecha || !formData.fk_id_cultivo || !formData.fk_id_tipo_residuo) {
            console.error("❌ Todos los campos son obligatorios");
            return;
        }

        const nuevoResiduo = {
            nombre_residuo: formData.nombre_residuo,
            fecha: new Date(formData.fecha).toISOString().split('T')[0],
            descripcion: formData.descripcion,
            fk_id_cultivo: parseInt(formData.fk_id_cultivo) || 0,
            fk_id_tipo_residuo: parseInt(formData.fk_id_tipo_residuo) || 0,
        };

        console.log("🚀 Enviando residuo al backend:", nuevoResiduo);
        
        mutation.mutate(nuevoResiduo, {
            onSuccess: () => {
                console.log("✅ Residuo creado exitosamente, redirigiendo a /residuos...");
                navigate("/residuos");
            },
            onError: (error) => {
                console.error("❌ Error al crear residuo:", error);
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario 
                fields={formFields} 
                onSubmit={handleSubmit} 
                isError={mutation.isError} 
                isSuccess={mutation.isSuccess}
                title="Registrar Nuevo Residuo"  
            />
        </div>
    );
};

export default CrearResiduo;