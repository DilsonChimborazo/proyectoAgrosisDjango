// src/hooks/usuarios/usuario/useCargaMasivaUsuarios.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useCargaMasivaUsuarios = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se ha encontrado un token de autenticación");
      }

      const { data } = await axios.post(
        `${apiUrl}usuario/carga_masiva/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data; 
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },

    onError: (error: any) => {
      console.error("Error al cargar usuarios masivamente:", error.message);
    },
  });
};
