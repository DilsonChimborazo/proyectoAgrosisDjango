import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Rol {
    id?: number;
    rol: string;
    fecha_creacion: string;
}

export const useCreateRol = () =>{
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: async (nuevoRol: Rol) => {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No se ha encontrado un token de autenticacion");
        }
  const {data} = await axios.post(
    `${apiUrl}rol/`,
    nuevoRol,
    {

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
},
onSuccess: () => {
  queryClient.invalidateQueries({queryKey: ["roles"]});
},
onError: (error: any) => {
  console.error("Error al crear una nuevo rol:", error.message)
}
  });
};