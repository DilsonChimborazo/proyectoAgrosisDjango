import { useState, useCallback } from 'react';
import { useUsuarios } from '../../hooks/usuarios/useUsuarios';
import Tabla from '../globales/Tabla';
import VentanaModal from '../globales/VentanasModales';

const Usuarios = () => {
  const { data: usuarios, isLoading, error } = useUsuarios();
  const [selectedUser, setSelectedUser] = useState<Record<string, any> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para abrir el modal con un usuario seleccionado
  const openModalHandler = useCallback((usuario: Record<string, any>) => {
    setSelectedUser(usuario);
    setIsModalOpen(true);
  }, []);

  // Función para cerrar el modal
  const closeModal = useCallback(() => {
    setSelectedUser(null);
    setIsModalOpen(false);
  }, []);

  // Definir los encabezados de la tabla
  const headers = ['ID', 'Nombre', 'Apellido', 'Email', 'Rol'];

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
      {/* Estado de carga */}
      {isLoading && <div className="text-center text-gray-500">Cargando usuarios...</div>}

      {/* Manejo de errores */}
      {error instanceof Error && (
        <div className="text-center text-red-500">Error al cargar los usuarios: {error.message}</div>
      )}

      {/* Verificar si hay usuarios */}
      {!isLoading && !error && (!Array.isArray(usuarios) || usuarios.length === 0) && (
        <div className="text-center text-gray-500">No hay usuarios registrados.</div>
      )}

      {/* Renderizar tabla solo si hay usuarios */}
      {Array.isArray(usuarios) && usuarios.length > 0 && (
        <Tabla
          title="Usuarios"
          headers={headers}
          data={usuarios.map(usuario => ({
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.fk_id_rol?.rol || 'Sin rol',
          }))}
          onClickAction={openModalHandler}
        />
      )}

      {/* Modal de usuario */}
      {selectedUser && (
        <VentanaModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        titulo="Detalles de usuarios" 
        contenido={selectedUser} 
        />
      )}
    </div>
  );
};

export default Usuarios;
