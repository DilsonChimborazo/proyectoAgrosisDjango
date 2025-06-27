import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthContext } from '../../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const apiUrl = import.meta.env.VITE_API_URL;

export interface FormData {
  identificacion: string;
  nombre: string;
  apellido: string;
  email: string;
  password?: string;
  img?: File | null;
}

export interface DecodedUsuario {
  user_id: number;
  identificacion: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  numero_ficha: string;
  img_url?: string;
  exp: number;
  iat: number;
}

const updatePerfil = async (formData: FormData): Promise<{ access: string }> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No hay token');

  const data = new FormData();
  data.append('nombre', formData.nombre);
  data.append('apellido', formData.apellido);
  data.append('email', formData.email);
  if (formData.img) data.append('img', formData.img);
  if (formData.password) data.append('password', formData.password);

  const response = await axios.put(`${apiUrl}usuario/img/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data; // { access: "nuevo_token" }
};

export const usePerfilUsuario = () => {
  const { setUsuario } = useAuthContext();

  const updateMutation = useMutation({
    mutationFn: updatePerfil,
    onSuccess: (data: { access: string }) => {
      const nuevoToken = data.access;
      localStorage.setItem('token', nuevoToken);
      const decoded = jwtDecode<DecodedUsuario>(nuevoToken);
      localStorage.setItem('user', JSON.stringify(decoded)); // Para mantener sincronía entre pestañas
      setUsuario(decoded); // Actualiza el contexto global
    },
  });

  return {
    updatePerfil: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    error: updateMutation.error,
  };
};