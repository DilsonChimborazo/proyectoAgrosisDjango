import { useState, useCallback } from 'react';
import { useUsuarios } from '../../hooks/usuarios/useUsuarios';
import Tabla from '../globales/Tabla';
import VentanaModal from '../globales/VentanasModales';

const Usuarios = () => {
  const { data: usuarios, isLoading, error } = useUsuarios();
  const [selectedUser, setSelectedUser] = useState<Record<string, any> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Abrir modal con un usuario seleccionado
  const openModalHandler = useCallback((usuario: Record<string, any>) => {
    setSelectedUser(usuario);
    setIsModalOpen(true);
  }, []);

  // Cerrar modal
  const closeModal = useCallback(() => {
    setSelectedUser(null);
    setIsModalOpen(false);
  }, []);

  // Encabezados de la tabla
  const headers = ['Identificación', 'Nombre', 'Apellido', 'Email', 'Rol'];

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
      {/* Estado de carga */}
      {isLoading && <div className="text-center text-gray-500">Cargando usuarios...</div>}

      {/* Errores */}
      {error instanceof Error && (
        <div className="text-center text-red-500">
          Error al cargar los usuarios: {error.message}
        </div>
      )}

      {/* Sin datos */}
      {!isLoading && !error && (!Array.isArray(usuarios) || usuarios.length === 0) && (
        <div className="text-center text-gray-500">No hay usuarios registrados.</div>
      )}

      {/* Tabla de usuarios */}
      {Array.isArray(usuarios) && usuarios.length > 0 && (
        <Tabla
          title="Lista de Usuarios"
          headers={headers}
          data={usuarios.map(usuario => ({
            identificacion: usuario.identificacion,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.fk_id_rol?.rol || 'Sin rol asignado',
          }))}
          onClickAction={openModalHandler}
        />
      )}

      {/* Modal de usuario */}
      {selectedUser && (
        <VentanaModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          titulo="Detalles del Usuario" 
          contenido={selectedUser} 
        />
      )}
    </div>
  );
};

export default Usuarios;
