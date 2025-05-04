import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = 'http://127.0.0.1:8000/api/';

// Interfaz para Programacion
interface Programacion {
  id?: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_realizada: string; // Formato esperado: YYYY-MM-DD
  duracion: number; // Duración en minutos
  fk_id_asignacionActividades: number;
  cantidad_insumo: number;
  img?: File | string;
  fk_unidad_medida: number;
}

// Hook para obtener programaciones (opcionalmente filtrado por asignación)
export const useProgramacion = (fk_id_asignacion?: number) => {
  return useQuery<Programacion[]>({
    queryKey: ['programaciones', fk_id_asignacion],
    queryFn: async () => {
      const url = fk_id_asignacion
        ? `${apiUrl}programacion/?fk_id_asignacionActividades=${fk_id_asignacion}`
        : `${apiUrl}programaciones/`;
      const { data } = await axios.get(url);
      return data;
    },
    enabled: !!fk_id_asignacion || fk_id_asignacion === undefined, // Ejecutar si no hay filtro o si se pasa un ID
  });
};