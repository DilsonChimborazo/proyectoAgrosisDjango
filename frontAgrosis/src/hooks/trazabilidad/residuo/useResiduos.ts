import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


export interface Residuos {
    id: number;
    nombre: string;
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
    nombre: string;
    descripcion: string;
}


// Función para obtener los usuarios con manejo de errores
const fetchAsignacion = async (): Promise<Residuos[]> => {
    try {
        const response = await axios.get(`/api/residuos/`);
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
            return data;
        },
        gcTime: 1000 * 60 * 10, 
    });
};


