import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Eras {
  id: number;
  fk_id_lote: number;
  descripcion: string;
  estado: boolean;
}

const useEditarEras = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eraActualizada: Eras) => {
      const token = localStorage.getItem("token");
      console.log("🔑 Token para actualizar era:", token);

      if (!token) {
        throw new Error("No se encontró el token. Por favor, inicia sesión.");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      console.log("📋 Encabezados de la solicitud:", headers);

      try {
        console.log("🚀 Enviando solicitud de actualización para la era:", eraActualizada);
        const { data } = await axios.put(
          `${apiUrl}eras/${eraActualizada.id}/`, // Aseguramos el formato del endpoint
          eraActualizada,
          { headers }
        );
        console.log("✅ Respuesta del servidor:", data);
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
      console.log("✅ Era actualizada correctamente, invalidando caché...");
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