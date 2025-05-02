    import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
    import axios from 'axios';


    const apiUrl = import.meta.env.VITE_API_URL; 

    export interface Ficha {
    id: number;
    numero_ficha: number;
    nombre_ficha: string;
    abreviacion: string;
    fecha_inicio: string;
    fecha_salida: string;
    is_active: boolean;
    }
    // Interfaces
    export interface Rol {
    id: number;
    rol: string;
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
    password: string;
    img: string | null;
    img_url: string;
    }

    export interface FormData {
        identificacion: string;
        nombre: string;
        apellido: string;
        email: string;
        password: string;
        img?: File | null;
    }

    // Función para obtener usuarios
    const fetchPerfil = async (): Promise<Usuario> => {
        const token = localStorage.getItem('token');
    
        if (!token) {
        throw new Error('No hay token de autenticación');
        }
    
        try {
        const response = await axios.get(`${apiUrl}usuario/img/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Perfil obtenido:', response.data);  // Verifica la respuesta aquí
        return response.data;
        } catch (error: any) {
        throw new Error(error.response?.data?.detail || 'Error al obtener el perfil del usuario');
        }
    };
    

    const updatePerfil = async (formData: FormData): Promise<Usuario> => {
        const token = localStorage.getItem('token');
    
        if (!token) {
        throw new Error('No hay token de autenticación');
        }
    
        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('apellido', formData.apellido);
        data.append('email', formData.email);
        if (formData.img) {
            data.append('img', formData.img);
        }
    
        try {
        const response = await axios.put(`${apiUrl}usuario/img/`, data, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        
        return response.data;
        } catch (error: any) {
        throw new Error(error.response?.data?.detail || 'Error al actualizar el perfil del usuario');
        }
    };
    
    export const usePerfilUsuario = () => {
        const queryClient = useQueryClient();
    
        const perfilQuery = useQuery({
        queryKey: ['perfil'],
        queryFn: fetchPerfil,
        staleTime: 1000 * 60 * 10,
        retry: 1,
        });
    
        const updateMutation = useMutation({
        mutationFn: updatePerfil,
        onSuccess: (data: Usuario) => {
            queryClient.setQueryData(['perfil'], data);
        },
        });
    
        return {
        perfil: perfilQuery.data,
        isLoading: perfilQuery.isPending,
        error: perfilQuery.error,
        updatePerfil: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        };
    };