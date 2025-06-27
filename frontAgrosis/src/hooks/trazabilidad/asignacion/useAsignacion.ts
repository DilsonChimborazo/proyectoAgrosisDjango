import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// URL base de la API
const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/';

// Definición de interfaces
export interface Insumo {
  id: number;
  nombre: string; // Puedes agregar más propiedades si la API las incluye
}

export interface Herramienta {
  id: number;
  nombre_h: string; // Puedes agregar más propiedades si la API las incluye
}

export interface RecursosAsignados {
  insumos?: Insumo[];
  herramientas?: Herramienta[];
}

export interface Rol {
  id: number;
  rol: string;
}

export interface Ficha {
  id: number;
  numero_ficha: number;
  nombre_ficha: string;
  abreviacion: string;
  fecha_inicio: string;
  fecha_salida: string;
  is_active: boolean;
}

export interface Usuario {
  id: number;
  identificacion: string;
  email: string;
  nombre: string;
  apellido: string;
  is_active: boolean;
  fk_id_rol: Rol | null;
  ficha: Ficha | null;
  img: string | null;
  img_url: string;
}

export interface Actividad {
  id: number;
  nombre_actividad: string;
  descripcion: string;
}

export interface TipoCultivo {
  id: number;
  nombre: string;
  descripcion: string;
  ciclo_duracion?: string;
}

export interface Especie {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  fk_id_tipo_cultivo: TipoCultivo;
}

export interface Cultivo {
  id: number;
  nombre_cultivo: string;
  descripcion: string;
  fk_id_especie: Especie;
}


export interface Semillero {

  id: number;
  nombre_semilla: string;
  fecha_siembra: Date;
  fecha_estimada: Date;
  cantidad: number;
}

export interface Plantacion {
  id: number;
  descripcion: string;
  fk_id_cultivo: Cultivo;
  cantidad_transplante?: number;
  fk_id_semillero: Semillero|undefined;
  fecha_plantacion: string;
}

export interface Realiza {
  id: number;
  fk_id_plantacion: Plantacion| undefined;
  fk_id_actividad: Actividad;
}

export interface Lote {
  id: number;
  nombre_lote: string;
  dimencion: string;
  estado: boolean;
}

export interface Eras {
  id: number;
  descripcion: string;
  fk_id_lote: Lote;
  estado: boolean;
}

export interface Asignacion {
  id: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_programada: string;
  observaciones: string;
  fk_id_realiza: Realiza | number;
  fk_identificacion: (Usuario | number | { id: number })[];
  recursos_asignados: (string | RecursosAsignados)[];
}

// Función para obtener el token de autenticación
const getAuthToken = () => {
  return localStorage.getItem('token') || null;
};

// Configurar interceptores de axios para incluir el token en las solicitudes
axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Función auxiliar para obtener detalles de insumos
const fetchInsumos = async (ids: number[]): Promise<Insumo[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}insumo/`, {
      params: { ids: ids.join(',') }, // Ajusta según la API, podría necesitar un filtro diferente
    });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

// Función auxiliar para obtener detalles de herramientas
const fetchHerramientas = async (ids: number[]): Promise<Herramienta[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}herramientas/`, {
      params: { ids: ids.join(',') }, // Ajusta según la API
    });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

// Función para obtener las asignaciones desde la API
const fetchAsignaciones = async (): Promise<Asignacion[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}asignaciones_actividades/`);
    if (!Array.isArray(data)) {
      throw new Error('La API no devolvió un array válido.');
    }

    // Obtener todos los IDs únicos de insumos y herramientas
    const allInsumoIds = new Set<number>();
    const allHerramientaIds = new Set<number>();
    data.forEach((item: any) => {
      if (item.recursos_asignados && typeof item.recursos_asignados === 'object') {
        item.recursos_asignados.insumos?.forEach((id: number) => allInsumoIds.add(id));
        item.recursos_asignados.herramientas?.forEach((id: number) => allHerramientaIds.add(id));
      }
    });

    // Obtener detalles de insumos y herramientas
    const insumos = await fetchInsumos(Array.from(allInsumoIds));
    const herramientas = await fetchHerramientas(Array.from(allHerramientaIds));

    // Mapear los datos con los nombres correspondientes
    const transformedData = await Promise.all(
      data.map(async (item: any) => {
        let recursosAsignados: (string | RecursosAsignados)[] = [];
        if (item.recursos_asignados && typeof item.recursos_asignados === 'object') {
          const { insumos: insumoIds = [], herramientas: herramientaIds = [] } = item.recursos_asignados;
          const insumosMap = insumos.filter((i) => insumoIds.includes(i.id));
          const herramientasMap = herramientas.filter((h) => herramientaIds.includes(h.id));

          if (insumosMap.length > 0 || herramientasMap.length > 0) {
            recursosAsignados.push({
              insumos: insumosMap,
              herramientas: herramientasMap,
            });
          }
        }

        return {
          ...item,
          recursos_asignados: recursosAsignados.length > 0 ? recursosAsignados : [],
        };
      })
    );

    return transformedData as Asignacion[];
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail || error.message || 'No se pudo obtener la lista de asignaciones';
    throw new Error(errorMessage);
  }
};

// Función para finalizar una asignación
export const finalizarAsignacion = async (id: number): Promise<Asignacion> => {
  try {
    const { data } = await axios.post(`${apiUrl}asignaciones_actividades/${id}/finalizar/`);
    return data.asignacion;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || 'No se pudo finalizar la asignación';
    throw new Error(errorMessage);
  }
};

// Hook personalizado useAsignacion
export const useAsignacion = () => {
  return useQuery<Asignacion[], Error>({
    queryKey: ['Asignaciones'],
    queryFn: fetchAsignaciones,
    gcTime: 1000 * 60 * 10, // 10 minutos
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
  });
};