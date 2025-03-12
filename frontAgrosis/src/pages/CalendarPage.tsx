
import ActividadNotifications from '@/components/trazabilidad/ActividadNotifications';
import ListarAsignacion from '../components/trazabilidad/ListarAsignacion'; 

const CalendarPage = () => {
  return (
    <div>
      <ListarAsignacion />
      <ActividadNotifications/>
    </div>
  );
};

export default CalendarPage;
