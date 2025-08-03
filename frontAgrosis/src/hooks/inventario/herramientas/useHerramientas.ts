    import { useQuery } from '@tanstack/react-query';
    import axios from 'axios';


    export interface Herramientas{
        id: number;
        nombre_h: string;
        cantidad_herramienta: number;
        estado: 'Disponible' | 'Prestado' | 'En reparacion';
        precio: number;
    }
    // Función para obtener los usuarios con manejo de errores
    const fetch = async (): Promise<Herramientas[]> => {
        try {
            const { data } = await axios.get(`/api/herramientas/`);
            return data;
        } catch (error) {
            console.error("Error al obtener herramientas:", error);
            throw new Error("No se pudo obtener la lista de las herramientas");
        }
    };


    export const useHerramientas = () => {
        return useQuery<Herramientas[], Error>({
            queryKey: ['Herramientas'],
            queryFn: fetch,
            gcTime: 1000 * 60 * 10, 

        });
    };