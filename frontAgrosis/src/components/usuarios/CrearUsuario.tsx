import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Formulario from '../globales/Formulario';

interface Usuario {
  name: string;
  email: string;
}

const createUsuario = async (newUser: Usuario): Promise<Usuario> => {
  const { data } = await axios.post(`${import.meta.env.VITE_API_URL}usuarios/`, newUser);
  return data;
};

const CrearUsuario = () => {
  const mutation = useMutation({
    mutationFn: createUsuario,
  });

  const formFields = [
    { id: 'name', label: 'Nombre', type: 'text' },
    { id: 'email', label: 'Correo electrónico', type: 'email' },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    const newUser: Usuario = {
      name: formData.name,
      email: formData.email,
    };
    mutation.mutate(newUser);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Crear Usuario</h1>
      <Formulario fields={formFields} onSubmit={handleSubmit} />
      {mutation.isError && <div className="text-red-500 mt-2">Error al crear el usuario</div>}
      {mutation.isSuccess && <div className="text-green-500 mt-2">Usuario creado exitosamente</div>}
    </div>
  );
};

export default CrearUsuario;
