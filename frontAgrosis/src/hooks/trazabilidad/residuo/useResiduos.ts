import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Residuos {
    id: number;
    nombre_residuo: string;
    fecha: Date;
    descripcion: string;
    fk_id_cultivo: Cultivos ;
    fk_id_tipo_residuo: TipoResiduos;
}
export interface Cultivos{
    id: number;
    nombre_cultivo: string; 
    fecha_plantacion: Date;
    descripcion: string;
    fk_id_especie: Especie;
    fk_id_semillero: Semillero;
}

export interface Semillero {
    id: number;
    nombre_semillero: string;
    fecha_siembra: Date;
    fecha_estimada: Date;
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
    fk_id_tipo_cultivo: TipoCultivo;
}
export interface TipoResiduos {
    id: number;
    nombre_tipo_residuo: string;
    descripcion: string;
}


// Función para obtener los usuarios con manejo de errores
const fetchAsignacion = async (): Promise<Residuos[]> => {
    try {
        const response = await axios.get(`${apiUrl}residuos/`);
        console.log("Respuesta completa de la API:", response);
        console.log("Datos de residuos:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener residuos:", error);
        throw new Error("No se pudo obtener la lista de los residuos");
    }
};

export const useResiduos= () => {
    return useQuery<Residuos[], Error>({
        queryKey: ['Residuos'],
        queryFn: async () => {
            const data = await fetchAsignacion();
            console.log("Datos de residuos en React Query:", data);
            return data;
        },
        gcTime: 1000 * 60 * 10, 
    });
};


