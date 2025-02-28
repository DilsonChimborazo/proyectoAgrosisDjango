import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Definimos el tipo de los datos que esperamos (ajustado al modelo de Django)
interface Rol {
  id: number;  // Añadimos el ID del rol si es necesario
  rol: string; // Nombre del rol
}

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  fk_id_rol: Rol;  // El rol será un objeto con los detalles del rol
}

// Función que hace la solicitud GET
const fetchUsuarios = async (): Promise<Usuario[]> => {
  const { data } = await axios.get('http://localhost:8000/api/usuario/');
  return data;
};

const Usuarios = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: fetchUsuarios,
  });

  // Mostrar loading
  if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;

  // Mostrar error
  if (error instanceof Error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Lista de Usuarios</h1>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">ID</th>
            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Nombre</th>
            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Apellido</th>
            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Correo Electrónico</th>
            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Rol</th>
            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((usuario) => (
            <tr key={usuario.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-6 text-sm text-gray-800">{usuario.id}</td>
              <td className="py-3 px-6 text-sm text-gray-800">{usuario.nombre}</td>
              <td className="py-3 px-6 text-sm text-gray-800">{usuario.apellido}</td>
              <td className="py-3 px-6 text-sm text-gray-800">{usuario.email}</td>
              <td className="py-3 px-6 text-sm text-gray-800">{usuario.fk_id_rol.rol}</td>
              <td className="py-3 px-6 text-sm text-center">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
                  onClick={() => alert(`Detalles 
                    nombre:${usuario.nombre} ${usuario.apellido}
                    Correo: ${usuario.email}
                    Rol: ${usuario.fk_id_rol.rol}
                  `)}
                >
                  Ver detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;
