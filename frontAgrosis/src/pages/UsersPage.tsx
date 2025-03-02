
import Usuarios from '../components/usuarios/Usuarios';
import CrearUsuario from '../components/usuarios/CrearUsuario';  

const UsersPage = () => {
  return (
    <div>
      <div>
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
