import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface User {
    id: number;
    nombre: string;
    apellido: string;
    rol: string;
}

export interface AuthResponse {
    access: string;
    refresh: string;
    user_id: number;
    nombre: string;
    apellido: string;
    rol: string;
    exp: number; 
}

const fetchUser = async (): Promise<User | null> => {
    const storedUser = localStorage.getItem('user');
    const tokenExpiration = localStorage.getItem('token_expiration');

    if (storedUser && tokenExpiration && Date.now() < Number(tokenExpiration)) {
        return JSON.parse(storedUser);
    }
    return null;
};

const loginRequest = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const { data } = await axios.post<AuthResponse>(`${apiUrl}token/`, { email, password });
        return data;
    } catch (error) {
        console.error("Error al autenticar:", error);
        throw new Error("Error de autenticación");
    }
};

const logoutRequest = async() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expiration');
    localStorage.removeItem('user');
};

export const useAuth = () => {
    const { data: user, isLoading, refetch } = useQuery<User | null, Error>({
        queryKey: ['user'],
        queryFn: fetchUser,
        staleTime: 1000 * 60 * 10,
        retry: false,
    });

    const loginMutation = useMutation({
        mutationFn: (variables: { email: string, password: string }) => loginRequest(variables.email, variables.password),
        onSuccess: (data: AuthResponse) => {
            const { access, refresh, user_id, nombre, apellido, rol, exp } = data;
            const expirationTime = Date.now() + exp * 1000;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('token_expiration', expirationTime.toString());
            localStorage.setItem('user', JSON.stringify({ id: user_id, nombre, apellido, rol }));

            refetch(); // Refrescar la información del usuario
        },
        onError: (error: any) => {
            console.error("Error al realizar el login:", error.message);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await logoutRequest(); 
        },
        onSuccess: () => {
            refetch();  
        },
    });
    

    return {
        user,
        isAuthenticated: !!user,
        isLoading,
        login: loginMutation.mutate,
        logout: logoutMutation.mutate,
    };
};
