import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export interface Ficha {
    id?: number;
    numero_ficha: string;
    nombre_ficha: string;
    abreviacion: string;
    fecha_inicio: string;
    fecha_salida: string;
    is_active?: boolean;
}

export const useCreateFicha = () =>{
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: async (nuevaFicha: Ficha) => {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No se ha encontrado un token de autenticacion");
        }
  const {data} = await axios.post(
    `/api/ficha/`,
    nuevaFicha,
    {

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
},
onSuccess: () => {
  queryClient.invalidateQueries({queryKey: ["fichas"]});
},
onError: (error: any) => {
  console.error("Error al crear una nueva ficha:", error.message)
}
  });
};