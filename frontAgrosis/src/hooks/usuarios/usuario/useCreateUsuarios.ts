  import { useMutation, useQueryClient } from "@tanstack/react-query";
  import axios from "axios";
  import { showToast } from "@/components/globales/Toast";

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
        showToast({
          title: 'Usuario creado',
          description: 'El usuario se creó correctamente',
          variant: 'success',
        });
      },

      onError: (error: any) => {
        if (axios.isAxiosError(error) && error.response) {
          const errors = error.response.data;
          if (errors.email) {
            showToast({
              title: 'Error email ya existe',
              description: 'Ya existe un usuario con esta identificacion',
              variant: 'error',
            });
          }
          else if (errors.identificacion) {
            showToast({
              title: 'Error identifiacion ya existe',
              description: 'Ya existe un usuario con esta identificacion',
              variant: 'error',
            });
          } else if (errors.detail) {
            // Para errores generales que pueden venir en detail
            showToast({
              title: 'Error',
              description: errors.detail,
              variant: 'error',
            });
          } else {
            showToast({
              title: 'Error',
              description: 'Error desconocido al crear el usuario',
              variant: 'error',
            });
          }
        } else {
          showToast({
            title: 'Error al crear usuario',
            description: error.message ?? 'Error al crear un nuevo usuario',
            variant: 'error',
          });
        }
      },
    });
  };
