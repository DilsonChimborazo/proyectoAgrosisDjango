import { useState } from 'react';
import { useUsuarios } from '../../hooks/usuarios/useUsuarios';
import Tabla from '../globales/Tabla';
import VentanaModal from '../globales/VentanasModales';

const Usuarios = () => {
  const { data: usuarios, isLoading, error } = useUsuarios();
  const [selectedUser, setSelectedUser] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const openModalHandler = (usuario: object) => {
    setSelectedUser(usuario);  
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null); 
    setIsModalOpen(false);
  };

  const headers = ['ID', 'Nombre', 'Apellido', 'Email', 'Rol'];

  const handleRowClick = (usuario: object) => {
    openModalHandler(usuario);
  };

  if (isLoading) return <div>Cargando usuarios...</div>;
  if (error instanceof Error) return <div>Error al cargar los usuarios: {error.message}</div>;

  const usuariosList = Array.isArray(usuarios) ? usuarios : [];

  const mappedUsuarios = usuariosList.map(usuario => ({
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    rol: usuario.fk_id_rol?.rol || 'Sin rol', 
  }));

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <Tabla
        headers={headers}
        data={mappedUsuarios} 
        onClickAction={handleRowClick}
      />
      <VentanaModal
        isOpen={isModalOpen}
        onClose={closeModal}
        contenido={selectedUser || undefined} 
        tipo="usuario"
      />
    </div>
  );
};

export default Usuarios;
