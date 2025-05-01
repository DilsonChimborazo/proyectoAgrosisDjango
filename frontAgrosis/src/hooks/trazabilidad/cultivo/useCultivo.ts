import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Semillero {
    id: number;
    nombre_semillero: string;
    fecha_siembra: string;
    fecha_estimada: string;
    cantidad: number;
}

export interface TipoCultivo {
    id: number;
    nombre: string;
    descripcion: string;
}

export interface Especie {
    id: number;
    nombre_comun: string;
    nombre_cientifico: string;
    descripcion: string;
    fk_id_tipo_cultivo: TipoCultivo | null;
}

export interface Cultivos {
    id: number;
    nombre_cultivo: string;
    fecha_plantacion: string;
    descripcion: string;
    fk_id_especie: Especie | null;
    fk_id_semillero: Semillero | null;
    kc_inicial: number;
    kc_desarrollo: number;
    kc_final: number;
    etapa_actual: string;
    etapa_actual_display: string;
    kc_actual: number;
}

const fetchAsignacion = async (): Promise<Cultivos[]> => {
    try {
        const response = await axios.get(`${apiUrl}cultivo/`, {
            headers: {
                // Si tu API requiere autenticación, descomenta y ajusta
                // Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        console.log("Datos recibidos del backend:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Error al obtener cultivos:", error.response?.data || error.message);
        throw new Error("No se pudo obtener la lista de los cultivos");
    }
};

export const useCultivo = () => {
    return useQuery<Cultivos[], Error>({
        queryKey: ['Cultivos'],
        queryFn: fetchAsignacion,
        gcTime: 1000 * 60 * 10,
        staleTime: 1000 * 60 * 5,
    });
};