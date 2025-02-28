import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface Usuario {
  name: string;
  email: string;
}

// Función para crear usuario
const createUsuario = async (newUser: Usuario): Promise<Usuario> => {
  const { data } = await axios.post('http://localhost:8000/api/usuarios/', newUser);
  return data;
};

const CrearUsuario = () => {
  const mutation = useMutation({
    mutationFn: createUsuario, // Corrección: uso de mutationFn
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget); // Mejor uso de e.currentTarget
    const newUser: Usuario = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    };
    mutation.mutate(newUser); // Dispara la mutación
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Crear Usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Nombre"
          className="w-full p-3 border border-gray-300 rounded-md"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-3 border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          disabled={mutation.isPending} // Corrección: useMutation ahora usa isPending en vez de isLoading
        >
          {mutation.isPending ? 'Creando...' : 'Crear Usuario'}
        </button>
      </form>
      {mutation.isError && <div className="text-red-500 mt-2">Error al crear el usuario</div>}
      {mutation.isSuccess && <div className="text-green-500 mt-2">Usuario creado exitosamente</div>}
    </div>
  );
};

export default CrearUsuario;
