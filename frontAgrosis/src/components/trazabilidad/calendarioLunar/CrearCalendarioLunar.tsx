import { CalendarioLunar } from '@/hooks/trazabilidad/calendarioLunar/useCrearCalendarioLunar';
import { useCrearCalendarioLunar } from '../../../hooks/trazabilidad/calendarioLunar/useCrearCalendarioLunar';
import Formulario from '../../globales/Formulario';


const CrearCalendarioLunar = () => {
const mutation = useCrearCalendarioLunar()

const formFields = [
    { id: 'fecha', label: 'Fecha', type: 'Date' },
    { id: 'descripcion_evento', label: 'Descripcion ', type: 'text' },
    { id: 'evento', label: 'Evento ', type: 'text' },
   
];

const handleSubmit = (formData: { [key: string]: string }) => {
    const newCalendarioLunar: CalendarioLunar = {
        fecha: new Date(formData.fecha).toISOString(), 
        descripcion_evento: formData.descripcion_evento,
        evento: formData.evento,
    };
    mutation.mutate(newCalendarioLunar);
};


return (
    <div className="max-w-4xl mx-auto p-4">
        <Formulario fields={formFields} 
        onSubmit={handleSubmit} 
        isError={mutation.isError} 
        isSuccess={mutation.isSuccess}
        title="Crear Calendario Lunar"
        />
    </div>
    );
};

export default CrearCalendarioLunar;
