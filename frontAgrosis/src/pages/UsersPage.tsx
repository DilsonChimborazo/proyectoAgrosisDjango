
import Usuarios from '../components/Usuarios';  // Asegúrate de que la ruta es correcta
import CrearUsuario from '../components/CrearUsuario';  // Asegúrate de que la ruta es correcta

const UsersPage = () => {
  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <div>
        <h2>Lista de Usuarios</h2>
        <Usuarios />
      </div>
      <div>
        <h2>Crear Nuevo Usuario</h2>
        <CrearUsuario />
      </div>
    </div>
  );
};

export default UsersPage;
