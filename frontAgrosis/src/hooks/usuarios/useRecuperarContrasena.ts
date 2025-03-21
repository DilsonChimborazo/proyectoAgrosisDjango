import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useRecuperarContrasena = () => {
  return useMutation({
    mutationFn: async ({email}: { email: string }) => {
      const { data } = await axios.post(`${apiUrl}solicitar-recuperacion/`, { email });
      return data;
    },
  });
};
