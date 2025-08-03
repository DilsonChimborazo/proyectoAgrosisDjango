import { useMutation } from "@tanstack/react-query";
import axios from "axios";


export const useRecuperarContrasena = () => {
  return useMutation({
    mutationFn: async ({email}: { email: string }) => {
      const { data } = await axios.post(`/api/solicitar-recuperacion/`, { email });
      return data;
    },
  });
};
