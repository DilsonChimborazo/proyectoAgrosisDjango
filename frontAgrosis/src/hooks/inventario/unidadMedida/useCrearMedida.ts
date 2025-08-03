import { useMutation } from '@tanstack/react-query';
import axios from 'axios';


export interface UnidadMedida {
    nombre_medida: string;
    unidad_base: 'g' | 'ml' | 'u';  
    factor_conversion: number;
}

const crearUnidadMedida = async (unidad: UnidadMedida) => {
    const token = localStorage.getItem("token");

    const { data } = await axios.post(`/api/unidad_medida/`, unidad, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    return data;
};

export const useUnidadMedida = () => {
    return useMutation({
        mutationFn: crearUnidadMedida,
    });
};
