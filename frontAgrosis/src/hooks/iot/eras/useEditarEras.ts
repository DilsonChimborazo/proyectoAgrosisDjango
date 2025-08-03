import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export interface Eras {
  id: number;
  fk_id_lote: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

const useEditarEras = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eraActualizada: Eras) => {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No se encontró el token. Por favor, inicia sesión.");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };


      const url = `/api/eras/${eraActualizada.id}/`;


      try {
        const { data } = await axios.put(url, eraActualizada, { headers });
        return data;
      } catch (error) {
        console.error("❌ Error en la solicitud:", error);
        if (axios.isAxiosError(error) && error.response) {
          console.error("📡 Detalles del error del servidor:", error.response.data);
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eras"] });
    },
    onError: (error: any) => {
      console.error("❌ Error al actualizar la Era:", error);
      if (error.response?.status === 401) {
        console.error("🔐 Error 401: Verifica tu token o permisos de administrador.");
      }
    },
  });
};

export { useEditarEras };