import { Asignacion } from '@/hooks/trazabilidad/useCrearAsignacion';
import { useCrearAsignacion } from '../../hooks/trazabilidad/useCrearAsignacion';
import Formulario from '../globales/Formulario';
import { useUsuarios } from '@/hooks/usuarios/useUsuarios';
import { useNavigate } from 'react-router-dom';


const CrearAsignacion = () => {
const mutation = useCrearAsignacion()
const navigate = useNavigate();
const { data: usuarios = [] } = useUsuarios();
const formFields = [
    { id: 'fecha', label: 'Fecha', type: 'Date' },
    { id: 'observaciones', label: 'Observaciones ', type: 'text' },
    { id: 'fk_id_actividad', label: 'Actividad ', type: 'number' },
    { 
        id: "id_identificacion", 
        label: "Usuario", 
        type: "select", 
        options: usuarios?.map((usr) => ({ value: usr.id, label: usr.nombre })) || [] 
    },

];

const handleSubmit = (formData: { [key: string]: string }) => {

    if (!formData.fecha || !formData.observaciones || !formData.fk_id_actividad || !formData.id_identificacion) {
        console.log('Campos faltantes');
        return;
    }

    const newAsignacion: Asignacion = {
        fecha: new Date(formData.fecha).toISOString().split('T')[0],
        observaciones: formData.observaciones,
        fk_id_actividad: parseInt(formData.fk_id_actividad),
        id_identificacion: parseInt(formData.id_identificacion),
    };
    mutation.mutate(newAsignacion);
    navigate('/actividad');
};


return (
    <div className="max-w-4xl mx-auto p-4">
        <Formulario 
        fields={formFields} 
        onSubmit={handleSubmit} 
        isError={mutation.isError} 
        isSuccess={mutation.isSuccess}
        title="Crear Asignacion"  />
    </div>
    );
};

export default CrearAsignacion;
