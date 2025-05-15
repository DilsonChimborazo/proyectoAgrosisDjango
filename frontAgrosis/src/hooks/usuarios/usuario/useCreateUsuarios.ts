import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Usuario {
  id?: number;
  identificacion: number;
  email: string;
  nombre: string;
  apellido: string;
  password: string;
  fk_id_rol: number;
  ficha?: number | null;
  img?: File | null; // imagen opcional
}

export const useCreateUsuarios = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevoUsuario: Usuario) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se ha encontrado un token de autenticación");
      }

      const formData = new FormData();
      formData.append("identificacion", String(nuevoUsuario.identificacion));
      formData.append("email", nuevoUsuario.email);
      formData.append("nombre", nuevoUsuario.nombre);
      formData.append("apellido", nuevoUsuario.apellido);
      formData.append("password", nuevoUsuario.password);
      formData.append("fk_id_rol", String(nuevoUsuario.fk_id_rol));

      // Si ficha está presente y no es null
      if (nuevoUsuario.ficha !== undefined && nuevoUsuario.ficha !== null) {
        formData.append("ficha", String(nuevoUsuario.ficha));
      }

      // Si hay imagen
      if (nuevoUsuario.img) {
        formData.append("img", nuevoUsuario.img);
      }

      const { data } = await axios.post(`${apiUrl}usuario/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // necesario para FormData
        },
      });

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },

    onError: (error: any) => {
      console.error("Error al crear un nuevo usuario:", error.message);
    },
  });
};
