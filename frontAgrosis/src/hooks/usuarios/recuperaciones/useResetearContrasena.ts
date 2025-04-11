import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useResetearContrasena = () => {
  return useMutation({
    mutationFn: async ({ token, id, password }: { token: string; id: string; password: string }) => {
      const { data } = await axios.post(`${apiUrl}resetear-contrasena/`, { token, id, password });
      return data;
    },
  });
};
