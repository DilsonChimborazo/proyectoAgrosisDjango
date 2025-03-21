import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Rol {
    id: number;
    nombre: string;
}

interface Usuario {
    id: number;
    identificacion: number;
    email: string;
    nombre: string;
    apellido: string;
    password?: string;
    fk_id_rol: Rol; 
}

const apiUrl = import.meta.env.VITE_API_URL;

export const useUsuarioPorId = (id: string | undefined) => {
    return useQuery<Usuario>({  // 🔥 Aquí especificamos que la consulta devuelve un 'Usuario'
        queryKey: ["Usuario", id],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No se ha encontrado un token de autenticación");
            }

            const { data } = await axios.get<Usuario>(`${apiUrl}usuario/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            return data;
        },
        enabled: !!id, // Solo ejecuta la consulta si hay un ID válido
    });
};
