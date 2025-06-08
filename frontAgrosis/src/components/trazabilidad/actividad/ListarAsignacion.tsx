import { useState, useMemo, memo, useEffect } from 'react';
import { useAsignacion, Asignacion } from '@/hooks/trazabilidad/asignacion/useAsignacion';
import { useRealiza, Realiza } from '@/hooks/trazabilidad/realiza/useRealiza';
import { useUsuarios, Usuario } from '@/hooks/usuarios/usuario/useUsuarios';
import { useProgramacion, Programacion } from '@/hooks/trazabilidad/programacion/useProgramacion';
import { useCurrentUser } from '@/hooks/trazabilidad/asignacion/useCurrentUser';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import CrearAsignacionModal from './CrearAsignacion';
import CrearProgramacion from '../programacion/CrearProgramacion';
import { showToast } from '@/components/globales/Toast';

// URL base del servidor donde se almacenan las imágenes
const BASE_URL = 'http://localhost:8000';

interface AsignacionTabla {
  id: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_programada: string;
  observaciones: string;
  plantacion: string;
  actividad: string;
  usuarios: string[];
  fecha_realizada: string | null | string;
  duracion: number | null | string;
  img: string | null | React.ReactNode;
}

const DetalleAsignacionModal = memo(({ item, realizaList, usuarios }: { item: Asignacion; realizaList: Realiza[]; usuarios: Usuario[] }) => {
  const realiza = realizaList.find((r) => r.id === (typeof item.fk_id_realiza === 'object' ? item.fk_id_realiza?.id : item.fk_id_realiza));

  // Debug fk_identificacion and usuarios
  console.log('DetalleAsignacionModal - Asignacion:', item);
  console.log('DetalleAsignacionModal - fk_identificacion:', item.fk_identificacion);
  console.log('DetalleAsignacionModal - Usuarios:', usuarios);

  const usuariosAsignados = Array.isArray(item.fk_identificacion)
    ? item.fk_identificacion
        .map((id) => {
          const usuarioId = typeof id === 'object' ? id.id : id;
          const usuario = usuarios.find((u) => u.id === Number(usuarioId) || u.id === usuarioId);
          return usuario;
        })
        .filter((u): u is Usuario => !!u)
    : [];

  console.log('DetalleAsignacionModal - Usuarios Asignados:', usuariosAsignados);

  const realizaNombre = realiza
    ? `${realiza.fk_id_actividad?.nombre_actividad || 'Sin actividad'} (${realiza.fk_id_plantacion?.fk_id_semillero?.nombre_semilla || 'Sin cultivo'})`
    : `Sin realiza (ID: ${item.fk_id_realiza || 'N/A'})`;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Detalles de la Asignación</h2>
      <div className="space-y-3">
        <p><span className="font-semibold">ID:</span> {item.id}</p>
        <p><span className="font-semibold">Estado:</span> {item.estado}</p>
        <p><span className="font-semibold">Fecha Programada:</span> {item.fecha_programada}</p>
        <p><span className="font-semibold">Observaciones:</span> {item.observaciones || 'Sin observaciones'}</p>
        <p><span className="font-semibold">Realiza:</span> {realizaNombre}</p>
        <p>
          <span className="font-semibold">Usuarios:</span>
          {usuariosAsignados.length > 0 ? (
            <ul className="list-none space-y-2 mt-1">
              {usuariosAsignados.map((u, index) => (
                <li key={index} className="text-gray-700 before:content-['-'] before:mr-2">
                  {`${u.nombre} ${u.apellido}`}
                </li>
              ))}
            </ul>
          ) : (
            ' Sin usuarios'
          )}
        </p>
      </div>
    </div>
  );
});

const ListarAsignacion: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isProgramacionModalOpen, setIsProgramacionModalOpen] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState<Asignacion | null>(null);
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);

  const { data: user, isLoading: isLoadingUser, error: errorUser } = useCurrentUser() as { data: Usuario | undefined };
  const { data: asignaciones = [], isLoading: isLoadingAsignaciones, error: errorAsignaciones, refetch: refetchAsignaciones } = useAsignacion();
  const { data: realizaList = [], isLoading: isLoadingRealiza, error: errorRealiza } = useRealiza();
  const { data: usuarios = [], isLoading: isLoadingUsuarios, error: errorUsuarios } = useUsuarios();
  const { data: programaciones = [], isLoading: isLoadingProgramaciones, error: errorProgramaciones, refetch: refetchProgramaciones } = useProgramacion();

  // Mostrar toasts al cargar los datos
  useEffect(() => {
    if (asignaciones.length === 0 && !isLoadingAsignaciones && !errorAsignaciones) {
      showToast({
        title: 'Aviso',
        description: 'No hay asignaciones disponibles. Crea una nueva asignación para empezar.',
        timeout: 3000,
        variant: 'info',
      });
    }
  }, [asignaciones, isLoadingAsignaciones, errorAsignaciones]);

  // Depuración: Mostrar datos recibidos
  useEffect(() => {
    console.log('Asignaciones:', asignaciones);
    console.log('Realiza List:', realizaList);
    console.log('Usuarios:', usuarios);
    console.log('Programaciones:', programaciones);
    console.log('Usuario actual:', user);
  }, [asignaciones, realizaList, usuarios, programaciones, user]);

  const filteredAsignaciones = useMemo(() => {
    if (!user || !user.fk_id_rol) return asignaciones; // Verificación más segura

    const allowedRoles = ['Administrador', 'Instructor', 'Operario'];
    if (user.fk_id_rol && allowedRoles.includes(user.fk_id_rol.rol)) {
      return asignaciones; // Administrador, Instructor, Operario ven todas las asignaciones
    } else {
      // Otros roles solo ven asignaciones donde están incluidos
      return asignaciones.filter((asignacion) =>
        Array.isArray(asignacion.fk_identificacion) &&
        asignacion.fk_identificacion.some((id) => {
          const userId = typeof id === 'object' ? id.id : id;
          return userId === user.id;
        })
      );
    }
  }, [asignaciones, user]);

  const tablaData: AsignacionTabla[] = useMemo(() => {
    if (!filteredAsignaciones.length) {
      console.log('No hay asignaciones para mapear.');
      return [];
    }
    if (!realizaList.length) {
      console.log('No hay datos en realizaList.');
      return filteredAsignaciones.map((asignacion) => ({
        id: asignacion.id,
        estado: asignacion.estado as 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada',
        fecha_programada: asignacion.fecha_programada || 'Sin fecha',
        observaciones: asignacion.observaciones || 'Sin observaciones',
        plantacion: `Sin cultivo (No hay datos en realizaList)`,
        actividad: `Sin actividad (No hay datos en realizaList)`,
        usuarios: ['Sin usuarios'],
        fecha_realizada: 'No asignada',
        duracion: 'No asignada',
        img: 'No asignada',
      }));
    }

    return filteredAsignaciones.map((asignacion) => {
      const realizaId = typeof asignacion.fk_id_realiza === 'object' ? asignacion.fk_id_realiza?.id : asignacion.fk_id_realiza;
      console.log(`Mapeando asignación ID: ${asignacion.id}, fk_id_realiza: ${realizaId}`);
      const realiza = realizaList.find((r) => r.id === realizaId);
      if (!realiza) {
        console.warn(`No se encontró realiza para fk_id_realiza: ${realizaId}`);
      }

      const usuariosAsignados = Array.isArray(asignacion.fk_identificacion)
        ? asignacion.fk_identificacion
            .map((id) => {
              const usuarioId = typeof id === 'object' ? id.id : id;
              const usuario = usuarios.find((u) => u.id === Number(usuarioId) || u.id === usuarioId);
              return usuario ? `${usuario.nombre} ${usuario.apellido}` : null;
            })
            .filter((u): u is string => !!u)
        : [];

      const programacion = programaciones.find((p) => {
        const programacionId = typeof p.fk_id_asignacionActividades === 'object'
          ? p.fk_id_asignacionActividades?.id
          : p.fk_id_asignacionActividades;
        return programacionId === asignacion.id;
      });

      let imgElement: React.ReactNode = 'No asignada';
      let imgUrl: string | null = null;
      if (programacion?.img) {
        if (typeof programacion.img === 'string') {
          imgUrl = programacion.img.startsWith('http') ? programacion.img : `${BASE_URL}${programacion.img}`;
        } else if (programacion.img instanceof File) {
          imgUrl = URL.createObjectURL(programacion.img);
        }
        if (imgUrl) {
          imgElement = (
            <img
              src={imgUrl}
              alt={`Imagen de programación ${asignacion.id}`}
              className="min-w-[3rem] w-12 h-12 rounded-full object-cover mx-auto cursor-pointer hover:scale-105 transition-transform"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.png';
                e.currentTarget.alt = 'Imagen no disponible';
              }}
              onClick={() => setImagenAmpliada(imgUrl)}
              loading="lazy"
            />
          );
        }
      }

      return {
        id: asignacion.id,
        estado: asignacion.estado as 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada',
        fecha_programada: asignacion.fecha_programada || 'Sin fecha',
        observaciones: asignacion.observaciones || 'Sin observaciones',
        plantacion: realiza?.fk_id_plantacion?.fk_id_semillero?.nombre_semilla ?? realiza?.fk_id_plantacion?.nombre_cultivo ?? `Sin cultivo (fk_id_realiza: ${realizaId || 'N/A'})`,
        actividad: realiza?.fk_id_actividad?.nombre_actividad ?? `Sin actividad (fk_id_realiza: ${realizaId || 'N/A'})`,
        usuarios: usuariosAsignados.length > 0 ? usuariosAsignados : ['Sin usuarios'],
        fecha_realizada: programacion?.fecha_realizada || 'No asignada',
        duracion: programacion?.duracion ?? 'No asignada',
        img: imgElement,
      };
    });
  }, [filteredAsignaciones, realizaList, usuarios, programaciones]);

  // Depuración: Mostrar tablaData después de que se haya inicializado
  useEffect(() => {
    console.log('Tabla Data:', tablaData);
    return () => {
      tablaData.forEach((item) => {
        if (typeof item.img === 'string' && item.img?.startsWith('blob:')) {
          URL.revokeObjectURL(item.img);
        }
      });
    };
  }, [tablaData]);

  const handleItemClick = (item: AsignacionTabla) => {
    const asignacion = asignaciones.find((a) => a.id === item.id) ?? null;
    setSelectedAsignacion(asignacion);
    setIsDetailModalOpen(true);
  };

  const handleUpdateClick = (item: AsignacionTabla) => {
    if (!user) {
      showToast({
        title: 'Error',
        description: 'Debes iniciar sesión para actualizar una programación.',
        timeout: 3000,
        variant: 'error',
      });
      return;
    }
    const asignacion = asignaciones.find((a) => a.id === item.id);
    if (!asignacion) {
      showToast({
        title: 'Error',
        description: 'Asignación no encontrada.',
        timeout: 3000,
        variant: 'error',
      });
      return;
    }
    if (asignacion.estado === 'Completada') {
      showToast({
        title: 'Acción no permitida',
        description: 'No se puede editar una asignación ya finalizada.',
        timeout: 3000,
        variant: 'error',
      });
      return;
    }
    console.log('Asignación encontrada:', asignacion);
    console.log('Usuario ID:', user.id, 'fk_identificacion:', asignacion.fk_identificacion);
    const userAssigned = Array.isArray(asignacion.fk_identificacion)
      ? asignacion.fk_identificacion.some((id) => {
          const userId = typeof id === 'object' ? id.id : id;
          return userId === user.id;
        })
      : false;
    if (!userAssigned) {
      showToast({
        title: 'Acceso Denegado',
        description: 'No estás asignado a esta asignación para actualizarla.',
        timeout: 3000,
        variant: 'error',
      });
      return;
    }
    if (!user.fk_id_rol || !['Aprendiz', 'Operario', 'Administrador', 'Instructor', 'Pasante'].includes(user.fk_id_rol.rol)) {
      showToast({
        title: 'Acceso Denegado',
        description: 'No tienes permiso para finalizar esta asignación.',
        timeout: 3000,
        variant: 'error',
      });
      return;
    }
    setSelectedAsignacion(asignacion);
    setIsProgramacionModalOpen(true);
  };

  const handleCreateAsignacion = () => {
    if (!user) {
      showToast({
        title: 'Error',
        description: 'Debes iniciar sesión para crear una asignación.',
        timeout: 3000,
        variant: 'error',
      });
      return;
    }
    if (user.fk_id_rol && ['Aprendiz', 'Operario'].includes(user.fk_id_rol.rol)) {
      showToast({
        title: 'Acceso Denegado',
        description: 'No tienes permiso para crear una asignación.',
        timeout: 3000,
        variant: 'error',
      });
      return;
    }
    setModalContenido(
      <CrearAsignacionModal
        onSuccess={() => {
          refetchAsignaciones();
          closeModal();
          showToast({
            title: 'Asignación Creada',
            description: 'La asignación se ha registrado correctamente.',
            timeout: 3000,
            variant: 'success',
          });
        }}
        usuarios={usuarios}
        onCreateUsuario={() => refetchAsignaciones()}
      />
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDetailModalOpen(false);
    setIsProgramacionModalOpen(false);
    setModalContenido(null);
    setSelectedAsignacion(null);
  };

  const loading = isLoadingAsignaciones || isLoadingRealiza || isLoadingUsuarios || isLoadingProgramaciones || isLoadingUser;
  const error = errorAsignaciones || errorRealiza || errorUsuarios || errorProgramaciones || errorUser;

  if (loading) return <div className="text-center text-gray-500">Cargando asignaciones...</div>;
  if (error) {
    showToast({
      title: 'Error al cargar datos',
      description: error.message || 'No se pudieron cargar las asignaciones',
      timeout: 3000,
      variant: 'error',
    });
    return <div className="text-center text-red-500">Error al cargar datos. Intenta de nuevo.</div>;
  }

  const headers = [
    'ID',
    'Fecha Programada',
    'Usuarios',
    'Actividad',
    'Plantacion',
    'Observaciones',
    'Fecha Realizada',
    'Duracion',
    'Img',
    'Estado',
  ];

  const renderRow = (item: AsignacionTabla) => {
    console.log('Renderizando fila para ID:', item.id, 'Estado:', item.estado, 'Usuario:', user);
    return (
      <tr key={item.id} className="hover:bg-gray-100 cursor-pointer">
        <td className="p-3">{item.id}</td>
        <td className="p-3">{item.fecha_programada}</td>
        <td className="p-3">
          {item.usuarios[0] === 'Sin usuarios' ? (
            <span className="text-gray-500">Sin usuarios</span>
          ) : (
            <span className="text-gray-700">{item.usuarios.join(' - ')}</span>
          )}
        </td>
        <td className="p-3">{item.actividad}</td>
        <td className="p-3">{item.plantacion}</td>
        <td className="p-3">{item.observaciones}</td>
        <td className="p-3">{item.fecha_realizada}</td>
        <td className="p-3">{item.duracion}</td>
        <td className="p-3">{item.img}</td>
        <td className="p-3">{item.estado}</td>
        <td className="p-3">
          <div className="flex space-x-2">
            <button
              onClick={() => handleItemClick(item)}
              className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400"
            >
              Ver detalles
            </button>
            {item.estado === 'Pendiente' &&
              user &&
              asignaciones.find((a) => a.id === item.id)?.fk_identificacion.some((id) => {
                const userId = typeof id === 'object' ? id.id : id;
                return userId === user.id;
              }) &&
              user.fk_id_rol &&
              ['Aprendiz', 'Pasante'].includes(user.fk_id_rol.rol) && (
                <button
                  onClick={() => handleUpdateClick(item)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Actualizar
                </button>
              )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <VentanaModal isOpen={isModalOpen} onClose={closeModal} titulo="" contenido={modalContenido} />
      {selectedAsignacion && (
        <>
          <VentanaModal
            isOpen={isDetailModalOpen}
            onClose={closeModal}
            titulo="Detalles de Asignación"
            contenido={<DetalleAsignacionModal item={selectedAsignacion} realizaList={realizaList} usuarios={usuarios} />}
          />
          <VentanaModal
            isOpen={isProgramacionModalOpen}
            onClose={closeModal}
            titulo=""
            contenido={
              <CrearProgramacion
                asignacionId={selectedAsignacion.id}
                existingProgramacion={programaciones.find((p) => {
                  const programacionId = typeof p.fk_id_asignacionActividades === 'object'
                    ? p.fk_id_asignacionActividades?.id
                    : p.fk_id_asignacionActividades;
                  return programacionId === selectedAsignacion.id;
                }) as Programacion | undefined} // Aserción de tipo explícita
                onSuccess={() => {
                  refetchProgramaciones();
                  refetchAsignaciones();
                  closeModal();
                  showToast({
                    title: 'Programación Actualizada',
                    description: 'La programación se ha actualizado correctamente.',
                    timeout: 3000,
                    variant: 'success',
                  });
                }}
                onCancel={closeModal}
              />
            }
          />
        </>
      )}
      <div className="bg-white rounded-lg shadow p-6">
        <Tabla
          title="Lista de Asignaciones"
          headers={headers}
          data={tablaData}
          onClickAction={handleItemClick}
          onUpdate={handleUpdateClick}
          onCreate={handleCreateAsignacion}
          createButtonTitle="Crear Asignación"
          renderRow={renderRow}
        />
      </div>

      {imagenAmpliada && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setImagenAmpliada(null)}
        >
          <img
            src={imagenAmpliada}
            alt="Imagen ampliada"
            className="max-w-4xl max-h-[90vh] rounded-lg shadow-lg border-4 border-white"
          />
        </div>
      )}
    </div>
  );
};

export default ListarAsignacion;