import { ChevronDown, ChevronUp, Activity } from 'lucide-react';
import Tabla from '@/components/globales/Tabla';

interface SeccionActividadesProps {
    actividades: any[];
    isOpen: boolean;
    onToggle: () => void;
    onRowClick: (row: any) => void;
}

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No realizada';
    
    try {
        // Manejar diferentes formatos de fecha
        let date: Date;
        
        // Intentar parsear como ISO (con 'T')
        if (dateString.includes('T')) {
            date = new Date(dateString);
        } 
        // Intentar parsear como fecha simple (YYYY-MM-DD)
        else if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            date = new Date(dateString + 'T00:00:00');
        }
        // Intentar parsear como fecha con hora pero sin 'T'
        else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(dateString)) {
            date = new Date(dateString.replace(' ', 'T'));
        }
        // Otros formatos
        else {
            date = new Date(dateString);
        }

        if (isNaN(date.getTime())) {
            return dateString; // Devolver original si no se puede parsear
        }

        // Nombres de meses en español
        const meses = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];

        const dia = date.getDate();
        const mes = meses[date.getMonth()];
        const año = date.getFullYear();

        return `${dia} de ${mes} de ${año}`;
    } catch (e) {
        console.error('Error formateando fecha:', dateString, e);
        return dateString; // Devolver original si hay error
    }
};

const SeccionActividades = ({
    actividades,
    isOpen,
    onToggle,
    onRowClick
}: SeccionActividadesProps) => {
    return (
        <div className="border rounded-lg overflow-hidden">
            <button 
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">Actividades realizadas</h3>
                    <span className="text-sm text-gray-500 ml-2">
                        ({actividades?.length || 0})
                    </span>
                </div>
                {isOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {isOpen && (
                <div>
                    {actividades?.length > 0 ? (
                        <Tabla
                            title=""
                            headers={['Actividad', 'Responsable', 'Programada', 'Realizada', 'Duración', 'Estado']}
                            data={actividades.map(a => ({
                                actividad: a.actividad,
                                responsable: a.responsable || 'No asignado',
                                programada: formatDate(a.fecha_programada || a.fecha_programada),
                                realizada: a.fecha_realizada ? formatDate(a.fecha_realizada) : 'No realizada',
                                duración: `${a.duracion_minutos} min`,
                                estado: a.estado
                            }))}
                            onClickAction={onRowClick}
                            onUpdate={() => {}}
                            onCreate={() => {}}
                            rowsPerPageOptions={[5, 10]}
                            hiddenColumnsByDefault={[]}
                        />
                    ) : (
                        <p className="text-gray-500 text-center py-4">No hay actividades registradas</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SeccionActividades;