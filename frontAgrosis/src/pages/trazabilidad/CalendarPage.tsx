
import ActividadNotifications from '@/components/trazabilidad/actividad/ActividadNotifications';
import ListarAsignacion from '../../components/trazabilidad/actividad/ListarAsignacion'; 

const CalendarPage = () => {
  return (
    <div>
      <ListarAsignacion />
      <ActividadNotifications/>
    </div>
  );
};

export default CalendarPage;
