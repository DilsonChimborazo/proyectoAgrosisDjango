import { useState } from 'react';
import { useUsuarios } from '../../hooks/usuarios/useUsuarios';
import Tabla from '../globales/Tabla';
import VentanaModal from '../globales/VentanasModales';

const Usuarios = () => {
  const { data: usuarios, isLoading, error } = useUsuarios();
  const [selectedUser, setSelectedUser] = useState<object | null>(null); // Cambio aquí
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para abrir el modal
  const openModalHandler = (usuario: object) => {
    setSelectedUser(usuario);  // Asignar el usuario seleccionado
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null); // Resetear el estado a null al cerrar
    setIsModalOpen(false);
  };

  const headers = ['ID', 'Nombre', 'Apellido', 'Email', 'Rol'];

  const handleRowClick = (usuario: object) => {
    openModalHandler(usuario);
  };

  // Verifica si los datos aún están cargando o si hay un error
  if (isLoading) return <div>Cargando usuarios...</div>;
  if (error instanceof Error) return <div>Error al cargar los usuarios: {error.message}</div>;

  // Asegúrate de que `usuarios` es un array, si es null o undefined, usas un array vacío
  const usuariosList = Array.isArray(usuarios) ? usuarios : [];

  // Aquí le decimos explícitamente a TypeScript que estamos mapeando una lista de usuarios
  const mappedUsuarios = usuariosList.map(usuario => ({
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    rol: usuario.fk_id_rol?.rol || 'Sin rol', // Manejar valores faltantes de rol
  }));

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <Tabla
        headers={headers}
        data={mappedUsuarios} // Usamos el array mapeado
        onClickAction={handleRowClick}
      />
      <VentanaModal
        isOpen={isModalOpen}
        onClose={closeModal}
        contenido={selectedUser || undefined} // Pasamos 'undefined' si 'selectedUser' es 'null'
        tipo="usuario"
      />
    </div>
  );
};

export default Usuarios;
